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
  Progress,
  List,
  ListItem,
  useColorModeValue,
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
import apiService from '@api';
import ProjectCard from '@components/projects/ProjectCard';

function DashboardStat({ icon, label, value, helpText, colorScheme }) {
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

function FreelancerDashboard() {
  // Fetch freelancer dashboard data
  const { data: dashboardData, isLoading } = useQuery({
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
          value={stats.activeProjects}
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
          <VStack spacing={5} align="stretch">
            {currentProjects.map((project) => (
              <Card key={project.id}>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Flex justify="space-between" align="center">
                      <Heading size="sm">{project.title}</Heading>
                      <Badge colorScheme="blue">
                        ${project.budget}
                      </Badge>
                    </Flex>
                    
                    <Text fontSize="sm" color="gray.600" noOfLines={2}>
                      {project.description}
                    </Text>
                    
                    <Box>
                      <Flex justify="space-between" mb={1}>
                        <Text fontSize="xs">Progress</Text>
                        <Text fontSize="xs" fontWeight="bold">{project.progress}%</Text>
                      </Flex>
                      <Progress value={project.progress} size="sm" colorScheme="blue" rounded="full" />
                    </Box>
                    
                    <Flex justify="space-between" align="center">
                      <HStack>
                        <Badge>{project.category}</Badge>
                        <Text fontSize="sm" color="gray.500">
                          Due: {new Date(project.deadline).toLocaleDateString()}
                        </Text>
                      </HStack>
                      <Button
                        as={Link}
                        to={`/projects/${project.id}`}
                        size="sm"
                        colorScheme="blue"
                      >
                        View Details
                      </Button>
                    </Flex>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
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
                          <Badge colorScheme="green">${bid.amount}</Badge>
                          <Badge>{bid.project.category}</Badge>
                          <Badge colorScheme={bid.status === 'accepted' ? 'green' : 'yellow'}>
                            {bid.status}
                          </Badge>
                        </HStack>
                      </VStack>
                      <Button
                        as={Link}
                        to={`/projects/${bid.project.id}`}
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