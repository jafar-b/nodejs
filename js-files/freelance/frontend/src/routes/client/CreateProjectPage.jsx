import {
  Box,
  Heading,
  Text,
  Card,
  CardBody,
  Stack,
  Button,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import ProjectForm from '@components/projects/ProjectForm';
import apiService from '@api';

function CreateProjectPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const createProjectMutation = useMutation({
    mutationFn: (projectData) => apiService.projects.create(projectData),
    onSuccess: (response) => {
      toast({
        title: 'Project created successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate(`/projects/${response.data.id}`);
    },
    onError: (error) => {
      toast({
        title: 'Failed to create project',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (data) => {
    setIsSubmitting(true);
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