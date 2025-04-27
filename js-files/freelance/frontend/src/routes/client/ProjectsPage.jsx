import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  Button,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  Select,
  Spinner,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiService from '@api';
import ProjectCard from '@components/projects/ProjectCard';

function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Fetch projects data
  const { data: projects, isLoading } = useQuery({
    queryKey: ['clientProjects'],
    queryFn: () => apiService.projects.getAll({ role: 'client' }),
    // Mock data for development
    initialData: [
      {
        id: 1,
        title: 'E-commerce Website Development',
        description: 'Build a fully functional e-commerce website with product listings, user authentication, and payment processing.',
        budget: 2500,
        deadline: new Date(2025, 6, 30),
        category: 'Web Development',
        status: 'inProgress',
        bidsCount: 7,
      },
      {
        id: 2,
        title: 'Logo Design for Tech Startup',
        description: 'Create a modern, professional logo for a new tech startup in the AI space.',
        budget: 350,
        deadline: new Date(2025, 5, 15),
        category: 'Graphic Design',
        status: 'open',
        bidsCount: 12,
      },
      {
        id: 3,
        title: 'Mobile App for Fitness Tracking',
        description: 'Develop a mobile application for tracking workouts, nutrition, and fitness progress.',
        budget: 3000,
        deadline: new Date(2025, 7, 20),
        category: 'Mobile App Development',
        status: 'completed',
        bidsCount: 8,
      },
      {
        id: 4,
        title: 'Content Writing for Blog',
        description: 'Write 10 SEO-optimized blog posts about artificial intelligence and machine learning.',
        budget: 500,
        deadline: new Date(2025, 5, 30),
        category: 'Content Writing',
        status: 'open',
        bidsCount: 5,
      },
    ],
  });
  
  // Filter and search projects
  const filteredProjects = projects?.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];
  
  // Separate projects by status
  const openProjects = filteredProjects.filter(p => p.status === 'open');
  const inProgressProjects = filteredProjects.filter(p => p.status === 'inProgress');
  const completedProjects = filteredProjects.filter(p => p.status === 'completed');
  
  if (isLoading) {
    return (
      <Flex justify="center" py={10}>
        <Spinner />
      </Flex>
    );
  }
  
  return (
    <Box>
      <Stack 
        direction={{ base: 'column', md: 'row' }} 
        justify="space-between" 
        align={{ base: 'flex-start', md: 'center' }}
        mb={6}
        spacing={4}
      >
        <Box>
          <Heading size="lg">My Projects</Heading>
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
      </Stack>
      
      <HStack mb={6} spacing={4} wrap="wrap">
        <InputGroup maxW={{ base: 'full', md: '300px' }}>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        
        <Select 
          maxW={{ base: 'full', md: '200px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="inProgress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>
      </HStack>
      
      <Tabs colorScheme="blue" variant="enclosed-colored">
        <TabList>
          <Tab>All ({filteredProjects.length})</Tab>
          <Tab>Open ({openProjects.length})</Tab>
          <Tab>In Progress ({inProgressProjects.length})</Tab>
          <Tab>Completed ({completedProjects.length})</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel px={0}>
            {filteredProjects.length === 0 ? (
              <Text textAlign="center" py={10} color="gray.500">
                No projects found matching your search criteria.
              </Text>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </SimpleGrid>
            )}
          </TabPanel>
          
          <TabPanel px={0}>
            {openProjects.length === 0 ? (
              <Text textAlign="center" py={10} color="gray.500">
                No open projects found.
              </Text>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {openProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </SimpleGrid>
            )}
          </TabPanel>
          
          <TabPanel px={0}>
            {inProgressProjects.length === 0 ? (
              <Text textAlign="center" py={10} color="gray.500">
                No projects in progress.
              </Text>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {inProgressProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </SimpleGrid>
            )}
          </TabPanel>
          
          <TabPanel px={0}>
            {completedProjects.length === 0 ? (
              <Text textAlign="center" py={10} color="gray.500">
                No completed projects.
              </Text>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {completedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </SimpleGrid>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default ProjectsPage; 