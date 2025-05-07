import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Input,
  Button,
  Flex,
  Spinner,
  Divider,
  useToast,
  useColorModeValue,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FiPaperclip, FiSend } from 'react-icons/fi';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '@/hooks/useAuth';
import apiService from '@/api/ApiConfig';
import { userRole } from '@/AllEnums';

interface MessageFile {
  id: number;
  name: string;
  url: string;
}

interface MessageSender {
  id: number;
  name: string;
  avatar: string | null;
}

interface Message {
  id: number;
  content: string;
  sender: MessageSender;
  createdAt: string | Date;
  files: MessageFile[];
}

interface MessageData {
  content: string;
}

interface MessageItemProps {
  message: Message;
  currentUserId: number | undefined;
}

function MessageItem({ message, currentUserId }: MessageItemProps) {
  const { content, sender, createdAt, files } = message;
  const isCurrentUser = sender.id === currentUserId;
  const messageBg = useColorModeValue(
    isCurrentUser ? 'blue.100' : 'gray.100',
    isCurrentUser ? 'blue.800' : 'gray.700'
  );

  return (
    <Flex 
      direction="column" 
      alignSelf={isCurrentUser ? 'flex-end' : 'flex-start'}
      maxW={{ base: '90%', md: '70%' }}
      mb={4}
    >
      <Flex mb={1} align="center" alignSelf={isCurrentUser ? 'flex-end' : 'flex-start'}>
        {!isCurrentUser && (
          <Avatar size="xs" name={sender.name} src={sender.avatar || undefined} mr={2} />
        )}
        <Text fontSize="sm" fontWeight="medium">
          {isCurrentUser ? 'You' : sender.name} (ID: {sender.id})
        </Text>
      </Flex>
      <Box
        bg={messageBg}
        p={3}
        borderRadius="lg"
        borderTopRightRadius={isCurrentUser ? 0 : 'lg'}
        borderTopLeftRadius={isCurrentUser ? 'lg' : 0}
      >
        <Text whiteSpace="pre-wrap">{content}</Text>
        {files && files.length > 0 && (
          <VStack mt={2} align="stretch">
            {files.map((file) => (
              <HStack 
                key={file.id} 
                bg={useColorModeValue('white', 'gray.600')} 
                p={2} 
                borderRadius="md"
              >
                <FiPaperclip />
                <Text 
                  as="a" 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  fontWeight="medium"
                  color="blue.500"
                >
                  {file.name}
                </Text>
              </HStack>
            ))}
          </VStack>
        )}
      </Box>
      <Text 
        fontSize="xs" 
        color="gray.500" 
        mt={1}
        alignSelf={isCurrentUser ? 'flex-end' : 'flex-start'}
      >
        {new Date(createdAt).toLocaleString()}
      </Text>
    </Flex>
  );
}

interface MessageListProps {
  projectId: string | number;
}

function MessageList({ projectId }: MessageListProps) {
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Query for fetching project details to check assignment
  const { data: projectData } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await apiService.projects.getById(projectId.toString());
      return response.data;
    }
  });

  // Check if user is assigned to this project
  const isUserAssigned = projectData && (
    (user?.role === userRole.FREELANCER && projectData.freelancer?.id === user.id) ||
    (user?.role === userRole.CLIENT && projectData.client?.id === user.id)
  );

  // Query for fetching messages
  const { 
    data: messages = [], 
    isLoading, 
    error 
  } = useQuery<Message[]>({
    queryKey: ['messages', projectId],
    queryFn: async () => {
      // First check if user is assigned to this project before fetching messages
      if (!projectData) {
        const projectResponse = await apiService.projects.getById(projectId.toString());
        
        // Verify user is authorized to view this project's messages
        const project = projectResponse.data;
        const isAuthorized = 
          (user?.role === userRole.FREELANCER && project.freelancer?.id === user.id) ||
          (user?.role === userRole.CLIENT && project.client?.id === user.id);
          
        if (!isAuthorized) {
          throw new Error('You are not authorized to view messages for this project');
        }
      } else if (!isUserAssigned) {
        throw new Error('You are not authorized to view messages for this project');
      }
      
      // If we get here, user is authorized
      const response = await apiService.messages.getByProject(projectId.toString());
      return response.data;
    },
    refetchInterval: 10000, // Poll every 10 seconds for new messages
    enabled: true, // We'll handle the authorization check in the queryFn
  });

  // Mutation for sending new messages
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: MessageData) => {
      const response = await apiService.messages.send(projectId.toString(), messageData);
      return response.data;
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', projectId] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to send message',
        description: error.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate({
      content: newMessage,
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isUserAssigned) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="red.500">
          You are not authorized to view messages for this project.
        </Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Flex justify="center" py={10}>
        <Spinner />
      </Flex>
    );
  }

  if (error) {
    return (
      <Text color="red.500">
        Error loading messages: {(error as Error).message}
      </Text>
    );
  }

  return (
    <Box>
      <VStack 
        spacing={6} 
        align="stretch" 
        maxH="500px" 
        overflowY="auto" 
        p={4}
        borderWidth="1px"
        borderRadius="md"
        mb={4}
      >
        {messages.length === 0 ? (
          <Text color="gray.500" textAlign="center" py={8}>
            No messages yet. Start the conversation!
          </Text>
        ) : (
          messages.map((message: Message) => (
            <MessageItem 
              key={message.id} 
              message={message} 
              currentUserId={user?.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </VStack>
      <Divider mb={4} />
      <HStack>
        <Input
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Tooltip label="Attach files" placement="top">
          <IconButton
            icon={<FiPaperclip />}
            aria-label="Attach files"
            variant="ghost"
          />
        </Tooltip>
        <Button
          leftIcon={<FiSend />}
          colorScheme="blue"
          onClick={handleSendMessage}
          isLoading={sendMessageMutation.isPending}
        >
          Send
        </Button>
      </HStack>
    </Box>
  );
}

export default MessageList;
