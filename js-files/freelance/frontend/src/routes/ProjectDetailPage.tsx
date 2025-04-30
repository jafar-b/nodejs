import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Badge,
  HStack,
  VStack,
  Button,
  Avatar,
  Card,
  CardBody,
  Divider,
  Icon,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
  useDisclosure,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
  Spinner,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { FiClock, FiDollarSign, FiFile } from 'react-icons/fi';
import { format } from 'date-fns';
import useAuth from '@/hooks/useAuth';
import apiService from '@/api';
import { userRole } from '@/AllEnums';
import BidList from '@components/projects/BidList';
import MilestoneList from '@components/projects/MilestoneList';

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: string;
  category: {
    id: number;
    name: string;
  };
  createdAt: string;
  skills: string[];
  client: {
    id: string;
    name: string;
    avatar?: string;
  };
  freelancer?: {
    id: string;
    name: string;
    avatar?: string;
  };
  attachments: {
    id: string;
    fileName: string;
    fileUrl: string;
  }[];
}

function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [milestoneData, setMilestoneData] = useState({
    title: '',
    description: '',
    amount: 0,
    dueDate: '',
  });

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError('Project ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await apiService.projects.getById(id);
        if (response.data) {
          setProject(response.data);
        } else {
          setError('Project not found');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load project');
        toast({
          title: 'Error',
          description: 'Failed to load project details',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, toast]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  if (error || !project) {
    return (
      <Box textAlign="center" py={10}>
        <Heading size="lg" mb={4}>Project Not Found</Heading>
        <Text mb={6}>The project you're looking for could not be found or you don't have access.</Text>
        <Button 
          colorScheme="brand" 
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  const isClient = user?.role === userRole.CLIENT;
  const isFreelancer = user?.role === userRole.FREELANCER;
  const isProjectOwner = isClient && user?.id && project.client?.id && user.id === project.client.id;
  const isAssignedFreelancer = 
    isFreelancer && 
    user?.id && 
    project.freelancer?.id && 
    user.id === project.freelancer.id;

  const handleMilestoneSubmit = async () => {
    try {
      if (!id) return;
      
      await apiService.milestones.create(id, {
        ...milestoneData,
        projectTitle: project?.title,
      });

      toast({
        title: 'Milestone created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
      setMilestoneData({
        title: '',
        description: '',
        amount: 0,
        dueDate: '',
      });
    } catch (error: any) {
      toast({
        title: 'Error creating milestone',
        description: error.response?.data?.message || 'Failed to create milestone',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Card mb={6}>
        <CardBody>
          <HStack justify="space-between" mb={4} align="start">
            <Box>
              <Heading size="lg" mb={2}>{project.title}</Heading>
              <HStack>
                <Badge colorScheme={getStatusColor(project.status)}>
                  {project.status.toUpperCase()}
                </Badge>
                <Text color="gray.500">
                  Posted {format(new Date(project.createdAt), 'MMM dd, yyyy')}
                </Text>
              </HStack>
            </Box>
            
            {isProjectOwner && (
              <Button 
                variant="outline" 
                colorScheme="brand"
                onClick={() => navigate(`/dashboard/projects/edit/${project.id}`)}
              >
                Edit Project
              </Button>
            )}
          </HStack>

          <Divider my={4} />

          <HStack spacing={10} mb={4}>
            <HStack>
              <Icon as={FiDollarSign} color="green.500" />
              <Text>${project.budget.toLocaleString()}</Text>
            </HStack>
            <HStack>
              <Icon as={FiClock} color="orange.500" />
              <Text>Due {format(new Date(project.deadline), 'MMM dd, yyyy')}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="semibold">Category:</Text>
              <Text>{project.category.name}</Text>
            </HStack>
          </HStack>

          <Box mb={4}>
            <Text fontWeight="semibold" mb={2}>Description</Text>
            <Text whiteSpace="pre-wrap">{project.description}</Text>
          </Box>

          {project.skills && project.skills.length > 0 && (
            <Box mb={4}>
              <Text fontWeight="semibold" mb={2}>Skills Required</Text>
              <Wrap>
                {project.skills.map((skill, index) => (
                  <WrapItem key={index}>
                    <Tag size="md" colorScheme="brand" borderRadius="full">
                      <TagLabel>{skill}</TagLabel>
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          )}

          {project.attachments && project.attachments.length > 0 && (
            <Box mb={4}>
              <Text fontWeight="semibold" mb={2}>Attachments</Text>
              <VStack align="stretch">
                {project.attachments.map((file) => (
                  <HStack 
                    key={file.id} 
                    p={2} 
                    borderWidth="1px" 
                    borderRadius="md"
                  >
                    <Icon as={FiFile} />
                    <Text>{file.fileName}</Text>
                    <Button 
                      size="sm" 
                      ml="auto" 
                      as="a" 
                      href={file.fileUrl}
                      target="_blank"
                    >
                      Download
                    </Button>
                  </HStack>
                ))}
              </VStack>
            </Box>
          )}

          <Divider my={4} />

          {project.client && (
            <Box>
              <Text fontWeight="semibold" mb={2}>Client</Text>
              <HStack>
                <Avatar 
                  size="sm" 
                  name={project.client.name} 
                  src={project.client.avatar} 
                />
                <Text>{project.client.name}</Text>
              </HStack>
            </Box>
          )}

          {project.freelancer && (
            <Box mt={4}>
              <Text fontWeight="semibold" mb={2}>Freelancer</Text>
              <HStack>
                <Avatar 
                  size="sm" 
                  name={project.freelancer.name} 
                  src={project.freelancer.avatar} 
                />
                <Text>{project.freelancer.name}</Text>
              </HStack>
            </Box>
          )}
        </CardBody>
      </Card>

      <Tabs variant="enclosed" colorScheme="brand">
        <TabList>
          <Tab>Proposals</Tab>
          <Tab>Messages</Tab>
          <Tab>Milestones</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <BidList 
              projectId={project.id} 
              isProjectOwner={isProjectOwner}
            />
          </TabPanel>
          <TabPanel>
            {/* Messages content */}
            <Text>Messages content would go here</Text>
          </TabPanel>
          <TabPanel>
            <Box mb={4}>

            </Box>
            <MilestoneList 
              projectId={project.id} 
              isProjectOwner={isProjectOwner}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Milestone</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  value={milestoneData.title}
                  onChange={(e) => setMilestoneData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter milestone title"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={milestoneData.description}
                  onChange={(e) => setMilestoneData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter milestone description"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Amount</FormLabel>
                <NumberInput
                  min={0}
                  value={milestoneData.amount}
                  onChange={(_, value) => setMilestoneData(prev => ({ ...prev, amount: value }))}
                >
                  <NumberInputField placeholder="Enter milestone amount" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Due Date</FormLabel>
                <Input
                  type="date"
                  value={milestoneData.dueDate}
                  onChange={(e) => setMilestoneData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </FormControl>

              <Button
                colorScheme="brand"
                onClick={handleMilestoneSubmit}
                isDisabled={!milestoneData.title || !milestoneData.description || !milestoneData.amount || !milestoneData.dueDate}
              >
                Create Milestone
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'open':
      return 'green';
    case 'in progress':
      return 'blue';
    case 'completed':
      return 'purple';
    case 'cancelled':
      return 'red';
    default:
      return 'gray';
  }
}

export default ProjectDetailPage;  