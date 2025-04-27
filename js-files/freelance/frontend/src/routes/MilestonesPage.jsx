import {
  Box,
  Heading,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  VStack,
  HStack,
  Badge,
  Progress,
  Card,
  CardBody,
  SimpleGrid,
  Flex,
  Button,
  Select,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiClock, FiCheck, FiDollarSign } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiService from '@api';
import { useAuth } from '@hooks/useAuth';

function MilestoneItem({ milestone, projectId }) {
  const bgColor = useColorModeValue(
    milestone.status === 'completed' ? 'green.50' : milestone.status === 'inProgress' ? 'blue.50' : 'white',
    milestone.status === 'completed' ? 'green.900' : milestone.status === 'inProgress' ? 'blue.900' : 'gray.700'
  );

  const statusColors = {
    pending: 'gray',
    inProgress: 'blue',
    completed: 'green',
  };

  // Calculate due days
  const dueDate = new Date(milestone.dueDate);
  const today = new Date();
  const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

  return (
    <Card borderWidth="1px" bg={bgColor} transition="all 0.2s">
      <CardBody>
        <VStack align="start" spacing={3}>
          <HStack justify="space-between" width="100%">
            <Heading size="md">{milestone.title}</Heading>
            <Badge colorScheme={statusColors[milestone.status]}>
              {milestone.status === 'inProgress' ? 'In Progress' : milestone.status}
            </Badge>
          </HStack>

          <Text>{milestone.description}</Text>

          <Progress
            value={milestone.status === 'completed' ? 100 : milestone.status === 'inProgress' ? 50 : 0}
            colorScheme={statusColors[milestone.status]}
            width="100%"
            borderRadius="md"
            size="sm"
          />

          <HStack width="100%" justify="space-between" wrap={{ base: 'wrap', md: 'nowrap' }} spacing={4}>
            <HStack>
              <FiDollarSign />
              <Text fontWeight="medium">${milestone.amount}</Text>
            </HStack>

            <HStack>
              <FiClock />
              <Text>
                {milestone.status === 'completed' ? (
                  'Completed on ' + new Date(milestone.completedDate).toLocaleDateString()
                ) : daysLeft > 0 ? (
                  daysLeft + (daysLeft === 1 ? ' day' : ' days') + ' left'
                ) : (
                  'Due date passed'
                )}
              </Text>
            </HStack>

            <Button
              as={Link}
              to={`/projects/${projectId}`}
              colorScheme="blue"
              size="sm"
              variant="outline"
            >
              Go to Project
            </Button>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
}

function MilestonesPage() {
  const { user } = useAuth();
  const [projectFilter, setProjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch milestones data
  const { data: milestoneData, isLoading } = useQuery({
    queryKey: ['userMilestones'],
    queryFn: () => apiService.milestones.getUserMilestones(),
    // Mock data for development
    initialData: {
      projects: [
        { id: 1, title: 'E-commerce Website Development' },
        { id: 2, title: 'Logo Design for Tech Startup' },
      ],
      milestones: [
        {
          id: 1,
          projectId: 1,
          title: 'Project Setup and Design',
          description: 'Initialize project, design database schema, and create wireframes',
          amount: 500,
          dueDate: new Date(2025, 5, 15),
          status: 'completed',
          completedDate: new Date(2025, 5, 10),
        },
        {
          id: 2,
          projectId: 1,
          title: 'User Authentication',
          description: 'Implement user registration, login, and profile management',
          amount: 600,
          dueDate: new Date(2025, 6, 1),
          status: 'inProgress',
        },
        {
          id: 3,
          projectId: 1,
          title: 'Shopping Cart',
          description: 'Build shopping cart functionality with product management',
          amount: 800,
          dueDate: new Date(2025, 6, 20),
          status: 'pending',
        },
        {
          id: 4,
          projectId: 2,
          title: 'Initial Concepts',
          description: 'Create 3 initial logo concepts based on client requirements',
          amount: 150,
          dueDate: new Date(2025, 5, 20),
          status: 'completed',
          completedDate: new Date(2025, 5, 19),
        },
        {
          id: 5,
          projectId: 2,
          title: 'Refinement',
          description: 'Refine selected concept based on client feedback',
          amount: 100,
          dueDate: new Date(2025, 5, 30),
          status: 'inProgress',
        },
        {
          id: 6,
          projectId: 2,
          title: 'Final Delivery',
          description: 'Deliver all final files in required formats',
          amount: 100,
          dueDate: new Date(2025, 6, 10),
          status: 'pending',
        },
      ],
    },
  });

  if (isLoading) {
    return (
      <Flex justify="center" py={10}>
        <Spinner />
      </Flex>
    );
  }

  const { projects, milestones } = milestoneData;

  // Filter milestones based on selected project and status
  const filteredMilestones = milestones.filter((milestone) => {
    const matchesProject = projectFilter === 'all' || milestone.projectId.toString() === projectFilter;
    const matchesStatus = statusFilter === 'all' || milestone.status === statusFilter;
    return matchesProject && matchesStatus;
  });

  // Group milestones by status for tabs
  const pendingMilestones = filteredMilestones.filter((m) => m.status === 'pending');
  const inProgressMilestones = filteredMilestones.filter((m) => m.status === 'inProgress');
  const completedMilestones = filteredMilestones.filter((m) => m.status === 'completed');

  return (
    <Box>
      <Heading size="lg" mb={6}>Milestones</Heading>

      <HStack mb={6} spacing={4} wrap="wrap">
        <Select
          placeholder="All Projects"
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          maxW={{ base: 'full', md: '300px' }}
        >
          <option value="all">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id.toString()}>
              {project.title}
            </option>
          ))}
        </Select>

        <Select
          placeholder="All Statuses"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          maxW={{ base: 'full', md: '200px' }}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="inProgress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>
      </HStack>

      <Tabs colorScheme="blue" variant="enclosed-colored">
        <TabList>
          <Tab>All ({filteredMilestones.length})</Tab>
          <Tab>Pending ({pendingMilestones.length})</Tab>
          <Tab>In Progress ({inProgressMilestones.length})</Tab>
          <Tab>Completed ({completedMilestones.length})</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            {filteredMilestones.length === 0 ? (
              <Text textAlign="center" py={10} color="gray.500">
                No milestones found matching your criteria.
              </Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {filteredMilestones.map((milestone) => (
                  <MilestoneItem
                    key={milestone.id}
                    milestone={milestone}
                    projectId={milestone.projectId}
                  />
                ))}
              </VStack>
            )}
          </TabPanel>

          <TabPanel px={0}>
            {pendingMilestones.length === 0 ? (
              <Text textAlign="center" py={10} color="gray.500">
                No pending milestones found.
              </Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {pendingMilestones.map((milestone) => (
                  <MilestoneItem
                    key={milestone.id}
                    milestone={milestone}
                    projectId={milestone.projectId}
                  />
                ))}
              </VStack>
            )}
          </TabPanel>

          <TabPanel px={0}>
            {inProgressMilestones.length === 0 ? (
              <Text textAlign="center" py={10} color="gray.500">
                No milestones in progress.
              </Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {inProgressMilestones.map((milestone) => (
                  <MilestoneItem
                    key={milestone.id}
                    milestone={milestone}
                    projectId={milestone.projectId}
                  />
                ))}
              </VStack>
            )}
          </TabPanel>

          <TabPanel px={0}>
            {completedMilestones.length === 0 ? (
              <Text textAlign="center" py={10} color="gray.500">
                No completed milestones found.
              </Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {completedMilestones.map((milestone) => (
                  <MilestoneItem
                    key={milestone.id}
                    milestone={milestone}
                    projectId={milestone.projectId}
                  />
                ))}
              </VStack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default MilestonesPage; 