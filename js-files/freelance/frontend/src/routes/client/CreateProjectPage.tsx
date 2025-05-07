import {
  Box,
  Heading,
  Text,
  Card,
  CardBody,
  Stack,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '@/api/ApiConfig';
import ProjectForm from '@components/projects/ProjectForm';
import useAuth from '@/hooks/useAuth';
import { ProjectStatus } from '@/AllEnums';

interface ProjectFormData {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  categoryId: number;
  paymentType: string;
}

interface ApiResponse {
  data: {
    id: string;
  };
}

function CreateProjectPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const createProjectMutation = useMutation<ApiResponse, Error, ProjectFormData>({
    mutationFn: (projectData) => {
      if (!user?.id) {
        throw new Error('User ID not found');
      }

      // Create the project data object
      const formattedData = {
        title: projectData.title,
        description: projectData.description,
        budget: Number(projectData.budget),
        deadline: projectData.deadline,
        categoryId: Number(projectData.categoryId),
        paymentType: projectData.paymentType,
        clientId: Number(user.id),
        status: ProjectStatus.OPEN // Set status to OPEN by default instead of DRAFT
      };

      console.log('Sending project data:', formattedData);
      return apiService.projects.create(formattedData);
    },
    onSuccess: (response) => {
      toast({
        title: 'Project created successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['clientProjects'] });
      
      // Navigate to the projects list page after successful creation
      navigate('/dashboard/projects');
      
      // Invalidate queries to refresh project lists
      queryClient.invalidateQueries({ queryKey: ['availableProjects'] });
      
      toast({
        title: 'Success!',
        description: 'Your project has been created and is now visible to freelancers',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error('Project creation error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 
                         'Failed to create project. Please try again.';
      
      setError(errorMessage);
      
      toast({
        title: 'Failed to create project',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (data: ProjectFormData) => {
    setIsSubmitting(true);
    setError('');
    createProjectMutation.mutate(data);
  };

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
          <BreadcrumbLink>Create New</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Stack spacing={6} maxW="3xl">
        <Box>
          <Heading size="lg">Post a New Project</Heading>
          <Text color="gray.600" mt={2}>
            Describe your project in detail to attract the right freelancers
          </Text>
        </Box>
        
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Card>
          <CardBody>
            <ProjectForm 
              onSubmit={handleSubmit} 
              isLoading={isSubmitting}
            />
          </CardBody>
        </Card>

        <Box>
          <Text fontSize="sm" color="gray.500">
            By posting this project, you agree to our Terms of Service and
            Privacy Policy
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}

export default CreateProjectPage; 