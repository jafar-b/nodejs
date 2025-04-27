import {
  Box,
  Heading,
  Text,
  Badge,
  Flex,
  HStack,
  VStack,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Avatar,
  Button,
  Divider,
  Card,
  CardBody,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
  Tag,
} from '@chakra-ui/react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiCalendar, FiDollarSign, FiChevronRight, FiUser } from 'react-icons/fi';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import apiService from '@api';
import { useAuth } from '@hooks/useAuth';
import BidList from '@components/projects/BidList';
import BidForm from '@components/projects/BidForm';
import MessageList from '@components/messaging/MessageList';
import FileUploader from '@components/files/FileUploader';
import FileList from '@components/files/FileList';
import MilestoneList from '@components/projects/MilestoneList';

function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const toast = useToast();

  // Fetch project details
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => apiService.projects.getById(id),
    // Mock data for development
    initialData: {
      id: 1,
      title: 'E-commerce Website Development',
      description: 'Build a fully functional e-commerce website with product listings, user authentication, and payment processing. The website should include the following features:\n\n- User registration and authentication\n- Product catalog with categories and search\n- Product detail pages with multiple images\n- Shopping cart functionality\n- Checkout process with payment integration\n- Order history and tracking\n- Admin dashboard for product management\n- Responsive design for mobile and desktop\n\nThe website should be built using modern technologies and follow best practices for security, performance, and SEO.',
      budget: 2500,
      deadline: new Date(2025, 6, 30),
      category: 'Web Development',
      status: 'open',
      client: {
        id: 101,
        name: 'TechSolutions Inc.',
        avatar: null,
      },
      freelancer: null,
      bids: [
        {
          id: 1001,
          freelancer: {
            id: 201,
            name: 'John Smith',
            avatar: null,
            rating: 4.8,
          },
          amount: 2300,
          deliveryTime: '30 days',
          message: 'I have 5+ years of experience building e-commerce websites with React and Node.js. I can deliver a high-quality website that meets all your requirements.',
          createdAt: new Date(2025, 4, 18),
        },
        {
          id: 1002,
          freelancer: {
            id: 202,
            name: 'Alice Johnson',
            avatar: null,
            rating: 4.5,
          },
          amount: 2400,
          deliveryTime: '25 days',
          message: 'I specialize in e-commerce development and have built over 20 online stores. I can ensure a secure and scalable solution.',
          createdAt: new Date(2025, 4, 17),
        },
      ],
      createdAt: new Date(2025, 4, 15),
    },
  });

  const isClient = user?.role === 'client';
  const isFreelancer = user?.role === 'freelancer';
  const isProjectOwner = isClient && user?.id === project?.client.id;
  const isAssignedFreelancer = isFreelancer && user?.id === project?.freelancer?.id;
  const canBid = isFreelancer && project?.status === 'open' && !isAssignedFreelancer;
  const hasBid = isFreelancer && project?.bids.some(bid => bid.freelancer.id === user?.id);

  // Mutation for accepting a bid
  const acceptBidMutation = useMutation({
    mutationFn: (bidId) => apiService.bids.accept(id, bidId),
    onSuccess: () => {
      toast({
        title: 'Bid accepted!',
        description: 'The freelancer has been assigned to this project.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // Refetch project data
    },
    onError: (error) => {
      toast({
        title: 'Failed to accept bid',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  if (isLoading) {
    return <Text>Loading project details...</Text>;
  }

  if (error) {
    return <Text>Error loading project: {error.message}</Text>;
  }

  return (
    <Box>
      <Breadcrumb 
        mb={8} 
        spacing="8px" 
        separator={<Icon as={FiChevronRight} color="gray.500" />}
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/dashboard/projects">Projects</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{project.title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <VStack spacing={8} align="stretch">
        <Card>
          <CardBody>
            <VStack align="stretch" spacing={6}>
              <Flex 
                justify="space-between" 
                align={{ base: 'start', md: 'center' }}
                direction={{ base: 'column', md: 'row' }}
                gap={4}
              >
                <Box>
                  <HStack mb={2}>
                    <Badge 
                      colorScheme={
                        project.status === 'open' ? 'green' : 
                        project.status === 'inProgress' ? 'blue' : 
                        project.status === 'completed' ? 'gray' : 'red'
                      }
                      py={1}
                      px={2}
                    >
                      {project.status === 'inProgress' ? 'In Progress' : project.status}
                    </Badge>
                    <Tag>{project.category}</Tag>
                  </HStack>
                  
                  <Heading size="lg">{project.title}</Heading>
                </Box>
                
                {(isProjectOwner || isAssignedFreelancer) && (
                  <HStack>
                    {isProjectOwner && project.status === 'open' && (
                      <Button colorScheme="blue" onClick={() => navigate(`/dashboard/projects/${id}/edit`)}>
                        Edit Project
                      </Button>
                    )}
                    {(isProjectOwner || isAssignedFreelancer) && project.status === 'inProgress' && (
                      <Button colorScheme="green">Mark Completed</Button>
                    )}
                  </HStack>
                )}
              </Flex>
              
              <HStack spacing={8} wrap="wrap">
                <HStack>
                  <Icon as={FiDollarSign} />
                  <Text fontWeight="bold">${project.budget}</Text>
                </HStack>
                <HStack>
                  <Icon as={FiCalendar} />
                  <Text>Due {new Date(project.deadline).toLocaleDateString()}</Text>
                </HStack>
                <HStack>
                  <Icon as={FiUser} />
                  <HStack>
                    <Avatar size="xs" name={project.client.name} src={project.client?.avatar} />
                    <Text>{project.client.name}</Text>
                  </HStack>
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  Posted on {new Date(project.createdAt).toLocaleDateString()}
                </Text>
              </HStack>
              
              <Divider />
              
              <Box>
                <Heading size="md" mb={4}>Project Description</Heading>
                <Text whiteSpace="pre-line">{project.description}</Text>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        <Tabs variant="enclosed" index={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab>Bids {project.bids.length > 0 && `(${project.bids.length})`}</Tab>
            <Tab>Messages</Tab>
            <Tab>Files</Tab>
            <Tab>Milestones</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0} pt={6}>
              {canBid && !hasBid && (
                <Card mb={8}>
                  <CardBody>
                    <Heading size="md" mb={4}>Submit a Bid</Heading>
                    <BidForm projectId={id} />
                  </CardBody>
                </Card>
              )}

              {project.bids.length > 0 ? (
                <BidList 
                  bids={project.bids} 
                  isProjectOwner={isProjectOwner} 
                  onAcceptBid={(bidId) => acceptBidMutation.mutate(bidId)}
                />
              ) : (
                <Text color="gray.500">No bids yet</Text>
              )}
            </TabPanel>

            <TabPanel p={0} pt={6}>
              <MessageList projectId={id} />
            </TabPanel>

            <TabPanel p={0} pt={6}>
              <VStack spacing={6} align="stretch">
                {(isProjectOwner || isAssignedFreelancer) && (
                  <Card mb={4}>
                    <CardBody>
                      <Heading size="md" mb={4}>Upload Files</Heading>
                      <FileUploader projectId={id} />
                    </CardBody>
                  </Card>
                )}
                <FileList projectId={id} />
              </VStack>
            </TabPanel>

            <TabPanel p={0} pt={6}>
              <MilestoneList projectId={id} isProjectOwner={isProjectOwner} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
}

export default ProjectDetailPage; 