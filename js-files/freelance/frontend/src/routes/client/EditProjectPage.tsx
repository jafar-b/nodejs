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
  Spinner,
} from '@chakra-ui/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '@/api/ApiConfig';
import ProjectForm from '@components/projects/ProjectForm';
import { PaymentType } from '@/AllEnums';

interface ApiResponse {
  data: any;
  message?: string;
  status: number;
}

interface ProjectFormData {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  categoryId: number;
  paymentType: PaymentType;
}

function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [project, setProject] = useState<ProjectFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError('Project ID is required');
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiService.projects.getById(id);
        if (response.data) {
          setProject({
            title: response.data.title,
            description: response.data.description,
            budget: response.data.budget,
            deadline: response.data.deadline,
            categoryId: response.data.category.id,
            paymentType: response.data.paymentType,
          });
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

  const updateProjectMutation = useMutation<ApiResponse, Error, ProjectFormData>({
    mutationFn: (projectData) => {
      if (!id) {
        throw new Error('Project ID not found');
      }

      // Create the project data object
      const formattedData = {
        title: projectData.title,
        description: projectData.description,
        budget: Number(projectData.budget),
        deadline: projectData.deadline,
        categoryId: Number(projectData.categoryId),
        paymentType: projectData.paymentType,
      };

      console.log('Sending project data:', formattedData);
      return apiService.projects.update(id, formattedData);
    },
    onSuccess: () => {
      toast({
        title: 'Project updated successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['clientProjects'] });
      
      // Navigate to the project detail page
      navigate(`/dashboard/projects/${id}`);
    },
    onError: (error) => {
      console.error('Project update error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 
                         'Failed to update project. Please try again.';
      
      setError(errorMessage);
      
      toast({
        title: 'Failed to update project',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    updateProjectMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="brand.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Breadcrumb
        spacing="8px"
        separator={<Icon as={FiChevronRight} color="gray.500" />}
        mb={6}
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/dashboard">
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/dashboard/projects">
            Projects
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <Text>Edit Project</Text>
        </BreadcrumbItem>
      </Breadcrumb>

      <Card>
        <CardBody>
          <Stack spacing={6}>
            <Heading size="lg">Edit Project</Heading>
            
            {error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <ProjectForm
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
              initialData={project || undefined}
            />
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
}

export default EditProjectPage; 