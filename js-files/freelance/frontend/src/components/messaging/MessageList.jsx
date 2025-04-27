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
import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@hooks/useAuth';
import apiService from '@api';

function MessageItem({ message, currentUserId }) {
  const { id, content, sender, createdAt, files } = message;
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
    >
      <Flex mb={1} align="center" alignSelf={isCurrentUser ? 'flex-end' : 'flex-start'}>
        {!isCurrentUser && (
          <Avatar size="xs" name={sender.name} src={sender.avatar} mr={2} />
        )}
        <Text fontSize="sm" fontWeight="medium">
          {isCurrentUser ? 'You' : sender.name}
        </Text>
      </Flex>
      
      <Box
        bg={messageBg}
        p={3}
        borderRadius="lg"
        borderTopRightRadius={isCurrentUser ? 0 : 'lg'}
        borderTopLeftRadius={isCurrentUser ? 'lg' : 0}
      >
        <Text>{content}</Text>
        
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

function MessageList({ projectId }) {
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  
  // Query for fetching messages
  const { 
    data: messages, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['messages', projectId],
    queryFn: () => apiService.messages.getByProject(projectId),
    refetchInterval: 10000, // Poll every 10 seconds for new messages
    // Mock data for development
    initialData: [
      {
        id: 1,
        content: 'Hello, I\'m interested in discussing the requirements for this project in more detail.',
        sender: {
          id: 201,
          name: 'John Smith',
          avatar: null,
        },
        createdAt: new Date(2025, 4, 18, 14, 30),
        files: [],
      },
      {
        id: 2,
        content: 'Hi John, thanks for your interest. Could you tell me more about your experience with e-commerce platforms?',
        sender: {
          id: 101,
          name: 'TechSolutions Inc.',
          avatar: null,
        },
        createdAt: new Date(2025, 4, 18, 15, 45),
        files: [],
      },
      {
        id: 3,
        content: 'I have 5+ years of experience building e-commerce websites with React and Node.js. Here\'s a sample of my previous work.',
        sender: {
          id: 201,
          name: 'John Smith',
          avatar: null,
        },
        createdAt: new Date(2025, 4, 18, 16, 20),
        files: [
          {
            id: 1,
            name: 'portfolio.pdf',
            url: '#',
          },
        ],
      },
    ],
  });
  
  // Mutation for sending new messages
  const sendMessageMutation = useMutation({
    mutationFn: (messageData) => apiService.messages.sendMessage(projectId, messageData),
    onSuccess: () => {
      setNewMessage('');
      // Invalidate and refetch messages
      queryClient.invalidateQueries(['messages', projectId]);
    },
    onError: (error) => {
      toast({
        title: 'Failed to send message',
        description: error.response?.data?.message || 'An error occurred',
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
        Error loading messages: {error.message}
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
          messages.map((message) => (
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
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
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
          isLoading={sendMessageMutation.isLoading}
        >
          Send
        </Button>
      </HStack>
    </Box>
  );
}

export default MessageList; 