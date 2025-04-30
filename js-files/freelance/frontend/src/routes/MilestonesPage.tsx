import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  VStack,
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage,
  Select,
  Card,
  CardBody,
  Spinner,
  Badge,
  HStack,
  Stack,
  useToast,
  IconButton,
  Progress,
} from '@chakra-ui/react';
import {  FiCheck, FiEdit, FiPlus, FiFileText } from 'react-icons/fi';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
  
import apiService from '@/api/ApiConfig';
import { MilestoneStatus, userRole, ProjectStatus } from '@/AllEnums';
import useAuth from '@/hooks/useAuth';

interface Project {
  id: string;
  title: string;
  freelancerName: string;
  clientName: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: MilestoneStatus;
  projectId: string;
  project: {
    id: string;
    title: string;
  };
}

interface MilestoneFormData {
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  projectId: string;
}

function MilestonesPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isInvoiceModalOpen, onOpen: onInvoiceModalOpen, onClose: onInvoiceModalClose } = useDisclosure();
  const toast = useToast();
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);
  const [formAction, setFormAction] = useState<'create' | 'edit'>('create');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'all'>('all');
  const isClient = user?.role === userRole.CLIENT;

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MilestoneFormData>();

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('Fetching projects...');
        const response = await (
          isClient 
            ? apiService.projects.getClientProjects() 
            : apiService.projects.getFreelancerProjects()
        );
        console.log('Projects response:', response.data);
        setProjects(response.data.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Failed to load projects',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    
    fetchProjects();
  }, [isClient, toast]);

  // Fetch milestones
  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching milestones...');
        console.log('Selected project:', selectedProject);
        console.log('Projects:', projects);
        
        let response;
        if (selectedProject) {
          response = await apiService.milestones.getByProject(selectedProject);
          console.log('Single project milestones response:', response.data);
          setMilestones(response.data);
        } else if (projects.length > 0) {
          // Get all milestones from all projects
          console.log('Fetching milestones for all projects...');
          const projectPromises = projects.map(project => 
            apiService.milestones.getByProject(project.id)
          );
          
          const projectResponses = await Promise.all(projectPromises);
          console.log('All projects milestones responses:', projectResponses);
          const allMilestones = projectResponses.flatMap(res => res.data);
          console.log('Combined milestones:', allMilestones);
          setMilestones(allMilestones);
        } else {
          // No projects, set empty milestones
          setMilestones([]);
        }
      } catch (error) {
        console.error('Error fetching milestones:', error);
        toast({
          title: 'Failed to load milestones',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setMilestones([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMilestones();
  }, [projects, selectedProject, toast]);

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId === 'all' ? null : projectId);
  };

  const handleCreateMilestone = () => {
    setFormAction('create');
    setCurrentMilestone(null);
    reset({
      title: '',
      description: '',
      amount: 0,
      dueDate: '',
      projectId: selectedProject || '',
    });
    onOpen();
  };

  const handleEditMilestone = (milestone: Milestone) => {
    setFormAction('edit');
    setCurrentMilestone(milestone);
    
    // Format date to YYYY-MM-DD for input field
    const formattedDate = new Date(milestone.dueDate).toISOString().split('T')[0];
    
    setValue('title', milestone.title);
    setValue('description', milestone.description);
    setValue('amount', milestone.amount);
    setValue('dueDate', formattedDate);
    setValue('projectId', milestone.projectId);
    
    onOpen();
  };

  const handleCompleteMilestone = async (milestoneId: string) => {
    try {
      await apiService.milestones.complete(milestoneId);
      
      // Update the local state
      setMilestones(milestones.map(m => 
        m.id === milestoneId ? { ...m, status: MilestoneStatus.COMPLETED } : m
      ));
      
      toast({
        title: 'Milestone marked as completed',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to update milestone',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleApproveMilestone = async (milestoneId: string) => {
    try {
      await apiService.milestones.approve(milestoneId);
      
      // Update the local state
      setMilestones(milestones.map(m => 
        m.id === milestoneId ? { ...m, status: MilestoneStatus.APPROVED } : m
      ));
      
      toast({
        title: 'Milestone approved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to approve milestone',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onSubmit = async (data: MilestoneFormData) => {
    try {
      setIsSubmitting(true);
      
      if (formAction === 'create') {
        await apiService.milestones.create(
          Number(data.projectId),
          {
            title: data.title,
            description: data.description,
            amount: Number(data.amount),
            dueDate: data.dueDate
          }
        );
        toast({
          title: 'Milestone created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else if (formAction === 'edit' && currentMilestone) {
        await apiService.milestones.update(currentMilestone.id, {
          title: data.title,
          description: data.description,
          amount: Number(data.amount),
          dueDate: data.dueDate
        });
        toast({
          title: 'Milestone updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      // Refresh milestones data
      const response = await apiService.milestones.getByProject(
        selectedProject || data.projectId
      );
      setMilestones(response.data);
      
      onClose();
    } catch (error) {
      toast({
        title: 'Failed to save milestone',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate project progress
  const calculateProgress = (projectId: string): number => {
    const projectMilestones = milestones.filter(m => m.projectId === projectId);
    
    if (projectMilestones.length === 0) return 0;
    
    const completedCount = projectMilestones.filter(
      m => m.status === MilestoneStatus.COMPLETED || m.status === MilestoneStatus.APPROVED
    ).length;
    
    return Math.round((completedCount / projectMilestones.length) * 100);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    let color;
    switch (status) {
      case MilestoneStatus.PENDING:
        color = 'yellow';
        break;
      case MilestoneStatus.COMPLETED:
        color = 'blue';
        break;
      case MilestoneStatus.APPROVED:
        color = 'green';
        break;
      default:
        color = 'gray';
    }
    
    return (
      <Badge colorScheme={color} textTransform="capitalize">
        {status}
      </Badge>
    );
  };

  const handleGenerateInvoice = async () => {
    try {
      setIsSubmitting(true);
      const response = await apiService.invoices.generateInvoice({
        projectId: selectedProject || 'all',
        status: selectedStatus,
      });
      
      // Create a blob from the PDF data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Invoice generated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onInvoiceModalClose();
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast({
        title: 'Failed to generate invoice',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && projects.length === 0) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  return (
    <VStack spacing={8} align="stretch">
      <Flex justify="space-between" align="center">
        <Box>
          <Heading size="lg">Milestones</Heading>
          <Text color="gray.600">Track and manage project milestones</Text>
        </Box>
        <HStack spacing={4}>
       
          <Button
            leftIcon={<FiFileText />}
            colorScheme="blue"
            onClick={onInvoiceModalOpen}
          >
            Generate Invoice
          </Button>
          {isClient && (
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={handleCreateMilestone}
            >
              Create Milestone
            </Button>
          )}
        </HStack>
      </Flex>

      <Card mb={6}>
        <CardBody>
          <Stack 
            direction={{ base: 'column', md: 'row' }} 
            spacing={4}
            justify="space-between"
            align={{ base: 'stretch', md: 'center' }}
          >
            <Box>
              <FormControl maxW="300px">
                <FormLabel>Filter by Project</FormLabel>
                <Select 
                  value={selectedProject || 'all'} 
                  onChange={(e) => handleProjectChange(e.target.value)}
                >
                  <option value="all">All Projects</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {selectedProject && (
              <Box>
                <Text fontWeight="medium" mb={1}>Project Progress</Text>
                <Progress 
                  value={calculateProgress(selectedProject)} 
                  colorScheme="brand" 
                  borderRadius="md"
                  size="sm"
                  width="200px"
                />
                <Text fontSize="sm" mt={1}>
                  {calculateProgress(selectedProject)}% Complete
                </Text>
              </Box>
            )}
          </Stack>
        </CardBody>
      </Card>

      {isLoading ? (
        <Flex justify="center" p={10}>
          <Spinner />
        </Flex>
      ) : milestones.length > 0 ? (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Milestone</Th>
                <Th>Project</Th>
                <Th>Amount</Th>
                <Th>Due Date</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {milestones.map(milestone => (
                <Tr key={milestone.id}>
                  <Td>
                    <VStack align="flex-start" spacing={1}>
                      <Text fontWeight="semibold">{milestone.title}</Text>
                      <Text fontSize="sm" color="gray.600" noOfLines={2}>
                        {milestone.description}
                      </Text>
                    </VStack>
                  </Td>
                  <Td>{milestone.project?.title || 'N/A'}</Td>
                  <Td>${milestone.amount.toLocaleString()}</Td>
                  <Td>{format(new Date(milestone.dueDate), 'MMM dd, yyyy')}</Td>
                  <Td>{getStatusBadge(milestone.status)}</Td>
                  <Td>
                    <HStack spacing={2}>
                      {isClient && milestone.status === MilestoneStatus.PENDING && (
                        <IconButton
                          icon={<FiEdit />}
                          aria-label="Edit milestone"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditMilestone(milestone)}
                        />
                      )}
                      
                      {!isClient && milestone.status === MilestoneStatus.PENDING && (
                        <Button
                          leftIcon={<FiCheck />}
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleCompleteMilestone(milestone.id)}
                        >
                          Mark Complete
                        </Button>
                      )}
                      
                      {isClient && milestone.status === MilestoneStatus.COMPLETED && (
                        <Button
                          leftIcon={<FiCheck />}
                          size="sm"
                          colorScheme="green"
                          onClick={() => handleApproveMilestone(milestone.id)}
                        >
                          Approve
                        </Button>
                      )}
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Card>
          <CardBody textAlign="center" py={10}>
            <Heading size="md" mb={2}>No Milestones Found</Heading>
            <Text color="gray.600" mb={6}>
              {isClient 
                ? "You haven't created any milestones yet."
                : "This project doesn't have any milestones yet."}
            </Text>
            
            {isClient && (
              <Button
                leftIcon={<FiPlus />}
                colorScheme="brand"
                onClick={handleCreateMilestone}
              >
                Create First Milestone
              </Button>
            )}
          </CardBody>
        </Card>
      )}

      {/* Invoice Generation Modal */}
      <Modal isOpen={isInvoiceModalOpen} onClose={onInvoiceModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Generate Invoice</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Project</FormLabel>
                <Select
                  value={selectedProject || 'all'}
                  onChange={(e) => setSelectedProject(e.target.value === 'all' ? null : e.target.value)}
                >
                  <option value="all">All Projects</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Project Status</FormLabel>
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ProjectStatus | 'all')}
                >
                  <option value="all">All Statuses</option>
                  <option value={ProjectStatus.IN_PROGRESS}>In Progress</option>
                  <option value={ProjectStatus.COMPLETED}>Completed</option>
                  <option value={ProjectStatus.DRAFT}>Draft (On Hold)</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onInvoiceModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleGenerateInvoice}
              isLoading={isSubmitting}
            >
              Generate & Download
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Milestone Form Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              {formAction === 'create' ? 'Create Milestone' : 'Edit Milestone'}
            </ModalHeader>
            <ModalCloseButton />
            
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.projectId}>
                  <FormLabel>Project</FormLabel>
                  <Select
                    {...register('projectId', { required: 'Project is required' })}
                    disabled={selectedProject !== null || formAction === 'edit'}
                  >
                    <option value="">Select a project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.projectId?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.title}>
                  <FormLabel>Title</FormLabel>
                  <Input
                    {...register('title', { required: 'Title is required' })}
                    placeholder="Milestone title"
                  />
                  <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.description}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    {...register('description', { required: 'Description is required' })}
                    placeholder="Describe what needs to be delivered"
                    rows={4}
                  />
                  <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.amount}>
                  <FormLabel>Amount</FormLabel>
                  <Input
                    type="number"
                    {...register('amount', { 
                      required: 'Amount is required',
                      min: { value: 0, message: 'Amount must be positive' }
                    })}
                    placeholder="Enter amount"
                  />
                  <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.dueDate}>
                  <FormLabel>Due Date</FormLabel>
                  <Input
                    type="date"
                    {...register('dueDate', { required: 'Due date is required' })}
                  />
                  <FormErrorMessage>{errors.dueDate?.message}</FormErrorMessage>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="brand"
                type="submit"
                isLoading={isSubmitting}
              >
                {formAction === 'create' ? 'Create' : 'Update'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default MilestonesPage; 