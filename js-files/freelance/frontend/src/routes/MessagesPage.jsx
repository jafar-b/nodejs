import {
  Box,
  Heading,
  Text,
  Flex,
  VStack,
  HStack,
  Avatar,
  Input,
  IconButton,
  Divider,
  Badge,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import { FiSend, FiSearch } from 'react-icons/fi';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiService from '@api';
import { useAuth } from '@hooks/useAuth';

function ConversationList({ conversations, activeId, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredConversations = conversations.filter((conversation) =>
    conversation.with.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <VStack 
      align="stretch" 
      spacing={0} 
      h="100%" 
      borderRightWidth="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Box p={4}>
        <Heading size="md" mb={4}>Messages</Heading>
        <Flex mb={4}>
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="md"
            borderRadius="md"
            pl="10"
            _focus={{ borderColor: 'blue.400' }}
          />
          <IconButton
            icon={<FiSearch />}
            aria-label="Search"
            position="absolute"
            left="1.5rem"
            top="5.5rem"
            fontSize="sm"
            variant="ghost"
            color="gray.400"
            zIndex={1}
          />
        </Flex>
      </Box>
      
      <Divider />
      
      <VStack 
        align="stretch" 
        spacing={0} 
        overflowY="auto"
        flex={1}
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: useColorModeValue('gray.300', 'gray.600'),
            borderRadius: '24px',
          },
        }}
      >
        {filteredConversations.length === 0 ? (
          <Text p={4} color="gray.500" textAlign="center">
            No conversations found
          </Text>
        ) : (
          filteredConversations.map((conversation) => (
            <Box 
              key={conversation.id}
              py={3}
              px={4}
              cursor="pointer"
              onClick={() => onSelect(conversation.id)}
              bg={activeId === conversation.id ? useColorModeValue('gray.100', 'gray.700') : 'transparent'}
              _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
              borderBottomWidth="1px"
              borderBottomColor={useColorModeValue('gray.100', 'gray.700')}
            >
              <HStack spacing={3} align="center">
                <Avatar size="md" name={conversation.with.name} src={conversation.with.avatar} />
                <Box flex={1}>
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="medium" noOfLines={1}>
                      {conversation.with.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </Flex>
                  <HStack>
                    <Text fontSize="sm" color="gray.600" noOfLines={1}>
                      {conversation.lastMessage.text}
                    </Text>
                    {conversation.unreadCount > 0 && (
                      <Badge colorScheme="blue" borderRadius="full">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </HStack>
                </Box>
              </HStack>
            </Box>
          ))
        )}
      </VStack>
    </VStack>
  );
}

function MessageView({ conversation, onSendMessage }) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  
  const handleSend = () => {
    if (message.trim() === '') return;
    onSendMessage(message);
    setMessage('');
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  if (!conversation) {
    return (
      <Flex 
        justify="center" 
        align="center" 
        h="100%" 
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Text color="gray.500">Select a conversation to start messaging</Text>
      </Flex>
    );
  }
  
  return (
    <Flex 
      direction="column" 
      h="100%"
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Box 
        p={4} 
        borderBottomWidth="1px"
        bg={useColorModeValue('white', 'gray.700')}
      >
        <HStack>
          <Avatar name={conversation.with.name} src={conversation.with.avatar} size="sm" />
          <Box>
            <Text fontWeight="medium">{conversation.with.name}</Text>
            <Text fontSize="xs" color="gray.500">
              {conversation.projectTitle}
            </Text>
          </Box>
        </HStack>
      </Box>
      
      <VStack 
        flex={1} 
        overflowY="auto" 
        spacing={4} 
        p={4}
        align="stretch"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: useColorModeValue('gray.300', 'gray.600'),
            borderRadius: '24px',
          },
        }}
      >
        {conversation.messages.map((msg) => {
          const isCurrentUser = msg.sender.id === user?.id;
          return (
            <Flex 
              key={msg.id} 
              justify={isCurrentUser ? 'flex-end' : 'flex-start'}
            >
              <HStack 
                spacing={2} 
                align="flex-start"
                maxW="70%"
              >
                {!isCurrentUser && (
                  <Avatar 
                    size="sm" 
                    name={msg.sender.name} 
                    src={msg.sender.avatar} 
                  />
                )}
                <Box>
                  <Box
                    p={3}
                    borderRadius="lg"
                    bg={isCurrentUser 
                      ? 'blue.500' 
                      : useColorModeValue('white', 'gray.700')
                    }
                    color={isCurrentUser ? 'white' : undefined}
                    shadow="sm"
                  >
                    <Text>{msg.text}</Text>
                  </Box>
                  <Text fontSize="xs" color="gray.500" textAlign={isCurrentUser ? 'right' : 'left'} mt={1}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </Box>
                {isCurrentUser && (
                  <Avatar 
                    size="sm" 
                    name={msg.sender.name} 
                    src={msg.sender.avatar}
                  />
                )}
              </HStack>
            </Flex>
          );
        })}
      </VStack>
      
      <HStack 
        p={4} 
        spacing={2}
        bg={useColorModeValue('white', 'gray.700')}
      >
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          borderRadius="full"
          _focus={{ borderColor: 'blue.400' }}
        />
        <IconButton
          colorScheme="blue"
          aria-label="Send message"
          icon={<FiSend />}
          isDisabled={message.trim() === ''}
          borderRadius="full"
          onClick={handleSend}
        />
      </HStack>
    </Flex>
  );
}

function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState(null);
  
  // Fetch conversations
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => apiService.messages.getConversations(),
    // Mock data for development
    initialData: [
      {
        id: 1,
        with: {
          id: 101,
          name: 'TechSolutions Inc.',
          avatar: null,
        },
        projectId: 1,
        projectTitle: 'E-commerce Website Development',
        lastMessage: {
          text: 'Can you provide an update on the shopping cart feature?',
          timestamp: new Date(2025, 4, 20, 14, 32),
        },
        unreadCount: 2,
        messages: [
          {
            id: 1001,
            sender: {
              id: 101,
              name: 'TechSolutions Inc.',
              avatar: null,
            },
            text: "Hi there! Thanks for bidding on our e-commerce project.",
            timestamp: new Date(2025, 4, 15, 10, 30),
          },
          {
            id: 1002,
            sender: {
              id: 201,
              name: 'John Smith',
              avatar: null,
            },
            text: "Hello! I'm excited to work with you on this project. I have experience building several e-commerce platforms.",
            timestamp: new Date(2025, 4, 15, 10, 45),
          },
          {
            id: 1003,
            sender: {
              id: 101,
              name: 'TechSolutions Inc.',
              avatar: null,
            },
            text: "Great! When can you start working on it?",
            timestamp: new Date(2025, 4, 15, 11, 15),
          },
          {
            id: 1004,
            sender: {
              id: 201,
              name: 'John Smith',
              avatar: null,
            },
            text: "I can start right away. I'll begin with setting up the project structure and database models.",
            timestamp: new Date(2025, 4, 15, 11, 30),
          },
          {
            id: 1005,
            sender: {
              id: 101,
              name: 'TechSolutions Inc.',
              avatar: null,
            },
            text: "Perfect. Please keep me updated on your progress.",
            timestamp: new Date(2025, 4, 18, 9, 15),
          },
          {
            id: 1006,
            sender: {
              id: 201,
              name: 'John Smith',
              avatar: null,
            },
            text: "I've made significant progress. The basic structure is set up, and I'm now working on the user authentication system.",
            timestamp: new Date(2025, 4, 19, 16, 45),
          },
          {
            id: 1007,
            sender: {
              id: 101,
              name: 'TechSolutions Inc.',
              avatar: null,
            },
            text: "Can you provide an update on the shopping cart feature?",
            timestamp: new Date(2025, 4, 20, 14, 32),
          },
        ],
      },
      {
        id: 2,
        with: {
          id: 102,
          name: 'AI Innovations',
          avatar: null,
        },
        projectId: 2,
        projectTitle: 'Logo Design for Tech Startup',
        lastMessage: {
          text: 'I really like the second concept. Can we iterate on that?',
          timestamp: new Date(2025, 4, 19, 17, 45),
        },
        unreadCount: 0,
        messages: [
          {
            id: 2001,
            sender: {
              id: 102,
              name: 'AI Innovations',
              avatar: null,
            },
            text: "Hi, thanks for your interest in our logo design project!",
            timestamp: new Date(2025, 4, 17, 13, 20),
          },
          {
            id: 2002,
            sender: {
              id: 201,
              name: 'John Smith',
              avatar: null,
            },
            text: "Hello! I'd love to work on your logo design. Could you tell me more about your brand values?",
            timestamp: new Date(2025, 4, 17, 15, 10),
          },
          {
            id: 2003,
            sender: {
              id: 102,
              name: 'AI Innovations',
              avatar: null,
            },
            text: "We focus on innovation, simplicity, and user-friendliness. Our main product is an AI assistant for productivity.",
            timestamp: new Date(2025, 4, 17, 15, 25),
          },
          {
            id: 2004,
            sender: {
              id: 201,
              name: 'John Smith',
              avatar: null,
            },
            text: "I understand. I'll create 3 initial concepts that reflect these values. When do you need this completed?",
            timestamp: new Date(2025, 4, 17, 15, 45),
          },
          {
            id: 2005,
            sender: {
              id: 102,
              name: 'AI Innovations',
              avatar: null,
            },
            text: "We'd like to have the final logo in 2 weeks. Is that feasible?",
            timestamp: new Date(2025, 4, 17, 16, 0),
          },
          {
            id: 2006,
            sender: {
              id: 201,
              name: 'John Smith',
              avatar: null,
            },
            text: "Yes, that works for me. I'll have the initial concepts ready in 3-4 days for your review.",
            timestamp: new Date(2025, 4, 17, 16, 15),
          },
          {
            id: 2007,
            sender: {
              id: 201,
              name: 'John Smith',
              avatar: null,
            },
            text: "I've attached the three initial concepts for your logo. Let me know your thoughts!",
            timestamp: new Date(2025, 4, 19, 14, 30),
          },
          {
            id: 2008,
            sender: {
              id: 102,
              name: 'AI Innovations',
              avatar: null,
            },
            text: "I really like the second concept. Can we iterate on that?",
            timestamp: new Date(2025, 4, 19, 17, 45),
          },
        ],
      },
    ],
  });
  
  // Fetch active conversation messages if needed
  const active = conversations?.find(c => c.id === activeConversation) || null;
  
  const handleSendMessage = (message) => {
    // In a real app, we would use a mutation here
    console.log(`Sending message: ${message}`);
  };
  
  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="500px">
        <Spinner />
      </Flex>
    );
  }
  
  return (
    <Box>
      <Heading size="lg" mb={6}>Messages</Heading>
      
      <Flex 
        h="calc(100vh - 200px)" 
        minH="500px"
        border="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        borderRadius="md" 
        overflow="hidden"
      >
        <Box w={{ base: activeConversation ? '0' : 'full', md: '350px' }} display={{ base: activeConversation ? 'none' : 'block', md: 'block' }}>
          <ConversationList 
            conversations={conversations} 
            activeId={activeConversation}
            onSelect={setActiveConversation}
          />
        </Box>
        
        <Box flex={1} display={{ base: !activeConversation ? 'none' : 'block', md: 'block' }}>
          <MessageView 
            conversation={active} 
            onSendMessage={handleSendMessage}
          />
        </Box>
      </Flex>
    </Box>
  );
}

export default MessagesPage; 