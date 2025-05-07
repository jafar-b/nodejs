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
import { 
  FiSearch, 
  FiBriefcase, 
  FiCheckCircle, 
  FiClock, 
  FiDollarSign,
  FiStar
} from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import apiService from '@/api/ApiConfig';
import ProjectCard from '@components/projects/ProjectCard';
import { BidStatus, ProjectStatus } from '@/AllEnums';

interface DashboardStatProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  helpText?: string;
  colorScheme: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: {
    id: number;
    name: string;
  };
  status: ProjectStatus;
  bidsCount: number;
  client?: {
    name: string;
    avatar?: string;
  };
}

interface Bid {
  id: string;
  amount: number;
  status: BidStatus;
  project: {
    id: string;
    title: string;
    category: {
      id: number;
      name: string;
    };
  };
}

interface DashboardStats {
  activeBids: number;
  activeProjects: number;
  completedProjects: number;
  totalEarned: number;
  rating: number;
}

interface DashboardData {
  stats: DashboardStats;
  currentProjects: Project[];
  recentBids: Bid[];
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

export function FreelancerDashboard() {
  // Fetch freelancer dashboard data
  const { data: dashboardData, isLoading } = useQuery<{ data: DashboardData }>({
    queryKey: ['freelancerDashboard'],
    queryFn: () => apiService.projects.getFreelancerDashboardStats(),
  });

  // Extract data safely with defaults
  const stats = dashboardData?.data?.stats || {
    activeBids: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalEarned: 0,
    rating: 0,
  };
  
  const currentProjects = dashboardData?.data?.currentProjects || [];
  const recentBids = dashboardData?.data?.recentBids || [];

  // Calculate active projects (ASSIGNED status)
  const activeProjectsCount = currentProjects.filter(
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
          <Heading size="lg">Freelancer Dashboard</Heading>
          <Text color="gray.600">Manage your work and find new opportunities</Text>
        </Box>
        <Button
          as={Link}
          to="/dashboard/browse-projects"
          leftIcon={<FiSearch />}
          colorScheme="blue"
        >
          Browse Projects
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={5}>
        <DashboardStat
          label="Active Bids"
          value={stats.activeBids}
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
          label="Total Earned"
          value={`$${stats.totalEarned}`}
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
        <Heading size="md" mb={4}>Current Projects</Heading>
        {currentProjects.length === 0 ? (
          <Text textAlign="center" color="gray.500">No active projects found</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {currentProjects.map((project) => {
              const formattedProject = {
                ...project,
                category: {
                  id: project.category?.id || 1,
                  name: typeof project.category === 'string' ? project.category : project.category?.name || 'Uncategorized'
                }
              };
              return <ProjectCard key={project.id} project={formattedProject} />;
            })}
          </SimpleGrid>
        )}
      </Box>

      <Card>
        <CardHeader>
          <Heading size="md">Recent Bids</Heading>
        </CardHeader>
        <CardBody>
          {recentBids.length === 0 ? (
            <Text textAlign="center" color="gray.500">No recent bids found</Text>
          ) : (
            <List spacing={3}>
              {recentBids.map((bid) => (
                <ListItem key={bid.id}>
                  <Box
                    p={3}
                    rounded="md"
                    borderWidth="1px"
                    _hover={{ bg: 'gray.50' }}
                  >
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">{bid.project.title}</Text>
                        <HStack>
                          <Badge colorScheme="blue">
                            {typeof bid.project.category === 'string' 
                              ? bid.project.category 
                              : bid.project.category?.name || 'Uncategorized'}
                          </Badge>
                          <Badge colorScheme="green">${bid.amount}</Badge>
                          <Badge colorScheme={bid.status === BidStatus.ACCEPTED ? 'green' : bid.status === BidStatus.PENDING ? 'yellow' : 'red'}>
                            {bid.status}
                          </Badge>
                        </HStack>
                      </VStack>
                      <Button
                        as={Link}
                        to={`/dashboard/projects/${bid.project.id}`}
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                      >
                        View Project
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

export default FreelancerDashboard; 