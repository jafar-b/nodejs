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
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiService from '@/api/ApiConfig';
import ProjectCard from '@components/projects/ProjectCard';
import { ProjectStatus } from '@/AllEnums';

interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  budget: number;
  deadline: string;
  category: {
    id: number;
    name: string;
  };
  bidsCount: number;
}

function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus>(ProjectStatus.DRAFT);
  
  // Fetch projects data
  const { data, isLoading, error } = useQuery<{ data: Project[] }>({
    queryKey: ['clientProjects'],
    queryFn: () => apiService.projects.getClientProjects(),
  });
  
  const projects = data?.data || [];
  
  // Filter and search projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === ProjectStatus.DRAFT || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Separate projects by status
  const openProjects = filteredProjects.filter(p => p.status === ProjectStatus.OPEN);
  const inProgressProjects = filteredProjects.filter(p => p.status === ProjectStatus.IN_PROGRESS);
  const completedProjects = filteredProjects.filter(p => p.status === ProjectStatus.COMPLETED);
  
  if (isLoading) {
    return (
      <Flex justify="center" py={10}>
        <Spinner size="lg" color="blue.500" />
      </Flex>
    );
  }
  
  if (error) {
    return (
      <Alert status="error" mb={6}>
        <AlertIcon />
        Error loading projects: {error instanceof Error ? error.message : 'Unknown error'}
      </Alert>
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
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
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
                {filteredProjects.map((project) => {
                  const formattedProject = {
                    ...project,
                    category: {
                      id: 1,
                      name: typeof project.category === 'string' ? project.category : project.category.name
                    }
                  };
                  return <ProjectCard key={project.id} project={formattedProject} />;
                })}
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