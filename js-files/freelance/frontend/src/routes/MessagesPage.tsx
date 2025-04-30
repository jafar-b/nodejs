import { useState, useEffect, useRef, FormEvent } from 'react';
import {
  Box,
  Divider,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  IconButton,
  Avatar,
  HStack,
  VStack,
  Stack,
  Card,
  CardBody,
  Spinner,
  Button,
  useToast,
  FormControl,
  Textarea,
  Icon,
  Badge,
} from '@chakra-ui/react';
import { FiSend, FiPaperclip, FiMessageCircle, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import useAuth from '@/hooks/useAuth';
import apiService from '@/api/ApiConfig';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  createdAt: string;
  attachments: {
    id: string;
    fileName: string;
    fileUrl: string;
  }[];
}

interface Project {
  id: string;
  title: string;
  client: {
    id: string;
    name: string;
    avatar?: string;
  };
  freelancer: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
}

function MessagesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

  // Fetch projects with messages
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // This endpoint would return projects the user is involved in with messaging enabled
        const response = await apiService.projects.getAll({ hasMessages: true });
        setProjects(response.data);
        
        // Auto-select the first project if available
        if (response.data.length > 0 && !selectedProject) {
          setSelectedProject(response.data[0].id);
        }
      } catch (error) {
        toast({
          title: 'Error fetching projects',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [toast, selectedProject]);

  // Fetch messages for selected project
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedProject) return;
      
      try {
        setLoadingMessages(true);
        const response = await apiService.messages.getByProject(selectedProject);
        setMessages(response.data);
      } catch (error) {
        toast({
          title: 'Error fetching messages',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoadingMessages(false);
      }
    };
    
    fetchMessages();
  }, [selectedProject, toast]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    setMessages([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() && attachments.length === 0) return;
    if (!selectedProject) return;
    
    try {
      setSendingMessage(true);
      
      const messageData = {
        content: messageText,
        attachments: attachments,
      };
      
      await apiService.messages.send(selectedProject, messageData);
      
      // Refetch messages
      const response = await apiService.messages.getByProject(selectedProject);
      setMessages(response.data);
      
      // Clear form
      setMessageText('');
      setAttachments([]);
      
      toast({
        title: 'Message sent',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to send message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const getOtherParty = (project: Project) => {
    if (!user) return null;
    
    return user.role === 'client' 
      ? project.freelancer 
      : project.client;
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={6}>Messages</Heading>
      
      {projects.length === 0 ? (
        <Card>
          <CardBody textAlign="center" py={10}>
            <Icon as={FiMessageCircle} boxSize={12} mb={4} color="gray.400" />
            <Heading size="md" mb={2}>No Messages Yet</Heading>
            <Text color="gray.600">
              You don't have any active conversations at the moment.
            </Text>
          </CardBody>
        </Card>
      ) : (
        <Flex 
          direction={{ base: 'column', md: 'row' }}
          gap={4}
          h={{ base: 'auto', md: '70vh' }}
        >
          {/* Project List */}
          <Card 
            minW={{ base: 'full', md: '300px' }}
            maxW={{ base: 'full', md: '300px' }}
            overflowY="auto"
          >
            <CardBody p={0}>
              <VStack spacing={0} align="stretch" divider={<Divider />}>
                {projects.map(project => (
                  <Box 
                    key={project.id} 
                    p={4}
                    bg={selectedProject === project.id ? 'gray.100' : 'white'}
                    cursor="pointer"
                    onClick={() => handleProjectSelect(project.id)}
                    position="relative"
                  >
                    <HStack spacing={3} mb={1}>
                      <Avatar 
                        size="sm" 
                        name={getOtherParty(project)?.name} 
                        src={getOtherParty(project)?.avatar}
                      />
                      <Box flex={1}>
                        <Flex justify="space-between" align="center">
                          <Text fontWeight="semibold" noOfLines={1}>
                            {getOtherParty(project)?.name}
                          </Text>
                          {project.unreadCount > 0 && (
                            <Badge colorScheme="brand" borderRadius="full">
                              {project.unreadCount}
                            </Badge>
                          )}
                        </Flex>
                        <Text fontSize="sm" color="gray.600" noOfLines={1}>
                          {project.title}
                        </Text>
                      </Box>
                    </HStack>
                    
                    {project.lastMessage && (
                      <Stack spacing={1} pl={10}>
                        <Text fontSize="sm" noOfLines={1}>
                          {project.lastMessage.content}
                        </Text>
                        <HStack spacing={1}>
                          <Icon as={FiClock} boxSize={3} color="gray.500" />
                          <Text fontSize="xs" color="gray.500">
                            {format(new Date(project.lastMessage.createdAt), 'MMM d, h:mm a')}
                          </Text>
                        </HStack>
                      </Stack>
                    )}
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>

          {/* Message Area */}
          <Card flex={1}>
            <CardBody p={0} display="flex" flexDirection="column">
              {selectedProject ? (
                <>
                  {/* Header */}
                  <Flex 
                    p={4} 
                    borderBottomWidth="1px" 
                    align="center"
                    bg="gray.50"
                  >
                    <Avatar 
                      size="sm" 
                      name={getOtherParty(projects.find(p => p.id === selectedProject) as Project)?.name}
                      src={getOtherParty(projects.find(p => p.id === selectedProject) as Project)?.avatar}
                      mr={3}
                    />
                    <Box>
                      <Text fontWeight="semibold">
                        {getOtherParty(projects.find(p => p.id === selectedProject) as Project)?.name}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {projects.find(p => p.id === selectedProject)?.title}
                      </Text>
                    </Box>
                  </Flex>

                  {/* Messages */}
                  <Box 
                    flex={1} 
                    overflowY="auto" 
                    px={4} 
                    py={2}
                    bg="gray.50"
                  >
                    {loadingMessages ? (
                      <Flex justify="center" align="center" h="full">
                        <Spinner />
                      </Flex>
                    ) : (
                      <VStack spacing={4} align="stretch">
                        {messages.length === 0 ? (
                          <Flex justify="center" align="center" h="200px">
                            <Text color="gray.500">No messages yet. Start the conversation!</Text>
                          </Flex>
                        ) : (
                          messages.map(message => (
                            <Box 
                              key={message.id}
                              alignSelf={message.senderId === user?.id ? 'flex-end' : 'flex-start'}
                              maxW="70%"
                            >
                              <HStack 
                                mb={1} 
                                spacing={2}
                                justify={message.senderId === user?.id ? 'flex-end' : 'flex-start'}
                              >
                                {message.senderId !== user?.id && (
                                  <Avatar size="xs" name={message.senderName} src={message.senderAvatar} />
                                )}
                                <Text fontSize="xs" color="gray.500">
                                  {message.senderId === user?.id ? 'You' : message.senderName} • {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                                </Text>
                              </HStack>
                              
                              <Box 
                                bg={message.senderId === user?.id ? 'brand.500' : 'white'}
                                color={message.senderId === user?.id ? 'white' : 'inherit'}
                                borderRadius="lg"
                                p={3}
                                boxShadow="sm"
                              >
                                <Text whiteSpace="pre-wrap">{message.content}</Text>
                                
                                {message.attachments.length > 0 && (
                                  <VStack mt={2} align="stretch" spacing={1}>
                                    {message.attachments.map(file => (
                                      <Button 
                                        key={file.id}
                                        as="a"
                                        href={file.fileUrl}
                                        target="_blank"
                                        size="sm"
                                        variant={message.senderId === user?.id ? 'outline' : 'solid'}
                                        colorScheme={message.senderId === user?.id ? 'white' : 'brand'}
                                        leftIcon={<FiPaperclip />}
                                        justifyContent="flex-start"
                                      >
                                        {file.fileName}
                                      </Button>
                                    ))}
                                  </VStack>
                                )}
                              </Box>
                            </Box>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </VStack>
                    )}
                  </Box>

                  {/* Message Input */}
                  <Box 
                    p={4} 
                    borderTopWidth="1px"
                    as="form"
                    onSubmit={handleSendMessage}
                  >
                    {attachments.length > 0 && (
                      <Box mb={2}>
                        <Text fontSize="sm" fontWeight="semibold" mb={1}>
                          Attachments ({attachments.length})
                        </Text>
                        <HStack overflowX="auto" spacing={2} pb={2}>
                          {attachments.map((file, index) => (
                            <Badge key={index} p={2}>
                              {file.name}
                              <Button
                                size="xs"
                                ml={1}
                                variant="ghost"
                                onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                              >
                                ×
                              </Button>
                            </Badge>
                          ))}
                        </HStack>
                      </Box>
                    )}
                    
                    <FormControl>
                      <InputGroup>
                        <Textarea
                          placeholder="Type your message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          rows={2}
                          resize="none"
                          pr="70px"
                        />
                        <InputRightElement width="70px" h="full">
                          <HStack spacing={1} pr={2}>
                            <IconButton
                              aria-label="Attach file"
                              icon={<FiPaperclip />}
                              size="sm"
                              variant="ghost"
                              onClick={() => fileInputRef.current?.click()}
                            />
                            <IconButton
                              aria-label="Send message"
                              icon={<FiSend />}
                              size="sm"
                              colorScheme="brand"
                              isLoading={sendingMessage}
                              type="submit"
                            />
                          </HStack>
                        </InputRightElement>
                      </InputGroup>
                      <Input
                        type="file"
                        multiple
                        hidden
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                    </FormControl>
                  </Box>
                </>
              ) : (
                <Flex justify="center" align="center" h="full" p={8}>
                  <Text color="gray.500">Select a conversation to start messaging</Text>
                </Flex>
              )}
            </CardBody>
          </Card>
        </Flex>
      )}
    </Box>
  );
}

export default MessagesPage; 