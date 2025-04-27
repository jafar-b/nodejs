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
  Divider,
  Badge,
  List,
  ListItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrendingUp, FiCheckCircle, FiClock, FiDollarSign } from 'react-icons/fi';
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

function ClientDashboard() {
  // Fetch client dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['clientDashboard'],
    queryFn: () => apiService.projects.getClientDashboardStats(),
  });

  // Extract data safely with defaults
  const stats = dashboardData?.data?.stats || { 
    activeProjects: 0, 
    completedProjects: 0, 
    pendingBids: 0, 
    totalSpent: 0 
  };
  
  const recentProjects = dashboardData?.data?.recentProjects || [];
  const pendingBids = dashboardData?.data?.pendingBids || [];

  return (
    <VStack spacing={8} align="stretch">
      <Flex justify="space-between" align="center">
        <Box>
          <Heading size="lg">Client Dashboard</Heading>
          <Text color="gray.600">Manage your projects and monitor activity</Text>
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

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5}>
        <DashboardStat
          label="Active Projects"
          value={stats.activeProjects}
          icon={FiClock}
          colorScheme="blue"
        />
        <DashboardStat
          label="Completed Projects"
          value={stats.completedProjects}
          icon={FiCheckCircle}
          colorScheme="green"
        />
        <DashboardStat
          label="Pending Bids"
          value={stats.pendingBids}
          icon={FiTrendingUp}
          colorScheme="orange"
        />
        <DashboardStat
          label="Total Spent"
          value={`$${stats.totalSpent}`}
          icon={FiDollarSign}
          colorScheme="purple"
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
          {recentProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
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
                        to={`/projects/${bid.projectId}`}
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