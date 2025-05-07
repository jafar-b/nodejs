import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardHeader,
  CardBody,
  Button,
  HStack,
  VStack,
  Flex,
  Icon,
  Badge,
  List,
  ListItem,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiPlus, FiCheckCircle, FiClock, FiDollarSign, FiBriefcase, FiStar } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import apiService from '@/api/ApiConfig';
import ProjectCard from '@components/projects/ProjectCard';
import { ProjectStatus } from '@/AllEnums';
import { useEffect } from 'react';

interface DashboardStatProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  helpText?: string;
  colorScheme: string;
}

interface Bid {
  id: string;
  project: string;
  projectId: string;
  freelancer: {
    name: string;
  };
  amount: number;
  deliveryTime: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  budget: number;
  deadline: string;
  category: string;
  bidsCount: number;
}

interface DashboardStats {
  activeBids: number;
  activeProjects: number;
  completedProjects: number;
  totalSpent: number;
  rating: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentProjects: Project[];
  pendingBids: Bid[];
}

function DashboardStat({ icon, label, value, helpText, colorScheme }: DashboardStatProps) {
  const bgColor = useColorModeValue(`${colorScheme}.50`, `${colorScheme}.900`);
  const textColor = useColorModeValue(`${colorScheme}.500`, `${colorScheme}.200`);

  return (
    <Card>
      <CardBody>
        <Flex justify="space-between" align="center">
          <Stat>
            <StatLabel color="gray.500">{label}</StatLabel>
            <StatNumber fontSize="2xl" fontWeight="bold">
              {value}
            </StatNumber>
            {helpText && <StatHelpText>{helpText}</StatHelpText>}
          </Stat>
          <Flex
            w="12"
            h="12"
            align="center"
            justify="center"
            rounded="full"
            bg={bgColor}
          >
            <Icon as={icon} boxSize="5" color={textColor} />
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
}

export function ClientDashboard() {
  // Fetch client dashboard data
  const { data: dashboardData, isLoading, error } = useQuery<{ data: DashboardData }>({
    queryKey: ['clientDashboard'],
    queryFn: () => apiService.projects.getClientDashboardStats(),
  });

  // Log any errors
  useEffect(() => {
    if (error) {
      console.error('Dashboard data fetch error:', error);
    }
    if (dashboardData) {
      console.log('Dashboard data:', dashboardData);
    }
  }, [error, dashboardData]);

  // Extract data safely with defaults
  const stats = dashboardData?.data?.stats || {
    activeBids: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalSpent: 0,
    rating: 0,
  };
  
  const recentProjects = dashboardData?.data?.recentProjects || [];
  const pendingBids = dashboardData?.data?.pendingBids || [];

  // Calculate active projects (ASSIGNED status)
  const activeProjectsCount = recentProjects.filter(
    project => project.status === ProjectStatus.ASSIGNED
  ).length;

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <VStack spacing={8} align="stretch">
      <Flex justify="space-between" align="center">
        <Box>
          <Heading size="lg">Client Dashboard</Heading>
          <Text color="gray.600">Manage your projects and track their progress</Text>
        </Box>
        <Button
          as={Link}
          to="/dashboard/projects/create"
          leftIcon={<FiPlus />}
          colorScheme="blue"
        >
          Post New Project
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={5}>
        <DashboardStat
          label="Active Bids"
          value={pendingBids.length}
          icon={FiClock}
          colorScheme="orange"
        />
        <DashboardStat
          label="Active Projects"
          value={activeProjectsCount}
          icon={FiBriefcase}
          colorScheme="blue"
        />
        <DashboardStat
          label="Completed"
          value={stats.completedProjects}
          icon={FiCheckCircle}
          colorScheme="green"
        />
        <DashboardStat
          label="Total Spent"
          value={`$${stats.totalSpent}`}
          icon={FiDollarSign}
          colorScheme="purple"
        />
        <DashboardStat
          label="Rating"
          value={stats.rating}
          helpText="out of 5"
          icon={FiStar}
          colorScheme="yellow"
        />
      </SimpleGrid>

      <Box>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Recent Projects</Heading>
          <Button
            as={Link}
            to="/dashboard/projects"
            variant="ghost"
            colorScheme="blue"
            size="sm"
          >
            View All
          </Button>
        </Flex>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5}>
          {recentProjects.length === 0 ? (
            <Text textAlign="center" color="gray.500">No recent projects found</Text>
          ) : (
            recentProjects.map((project) => {
              console.log('Project data:', project);
              // Ensure all project data is properly formatted
              const formattedProject = {
                id: String(project.id),
                title: String(project.title),
                description: String(project.description),
                status: project.status as ProjectStatus,
                budget: Number(project.budget),
                deadline: String(project.deadline),
                category: typeof project.category === 'object' ? project.category : {
                  id: 1,
                  name: String(project.category)
                },
                bidsCount: Number(project.bidsCount) 
              };
              console.log('Formatted project:', formattedProject);
              
              return (
                <ProjectCard 
                  key={formattedProject.id} 
                  project={formattedProject}
                />
              );
            })
          )}
        </SimpleGrid>
      </Box>

      <Card>
        <CardHeader>
          <Heading size="md">Recent Bids</Heading>
        </CardHeader>
        <CardBody>
          {pendingBids.length === 0 ? (
            <Text textAlign="center" color="gray.500">No pending bids found</Text>
          ) : (
            <List spacing={3}>
              {pendingBids.map((bid) => (
                <ListItem key={bid.id}>
                  <Box
                    p={3}
                    rounded="md"
                    borderWidth="1px"
                    _hover={{ bg: 'gray.50' }}
                  >
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">{bid.project}</Text>
                        <HStack>
                          <Text fontSize="sm">by {bid.freelancer.name}</Text>
                          <Badge colorScheme="green">${bid.amount}</Badge>
                          <Badge colorScheme="blue">{bid.deliveryTime}</Badge>
                        </HStack>
                      </VStack>
                      <Button
                        as={Link}
                        to={`/dashboard/projects/${bid.projectId}`}
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                      >
                        Review
                      </Button>
                    </Flex>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </CardBody>
      </Card>
    </VStack>
  );
}

export default ClientDashboard; 