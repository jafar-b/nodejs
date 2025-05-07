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
import { MilestoneStatus, userRole, ProjectStatus, InvoiceStatus } from '@/AllEnums';
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
  const { isOpen: isInvoiceModalOpen, onClose: onInvoiceModalClose } = useDisclosure();
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
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

  const handleGenerateInvoice = async (milestoneId?: string) => {
    try {
      setIsSubmitting(true);
      
      // Use the specific milestone ID if provided, otherwise use the selected milestone
      const mId = milestoneId || (selectedMilestone ? selectedMilestone.id : null);
      
      if (!mId) {
        throw new Error('No milestone selected');
      }
      
      // Find the milestone details
      const milestoneDetails = milestones.find(m => m.id === mId);
      if (!milestoneDetails) {
        throw new Error('Milestone details not found');
      }
      
      // Hard-code client and freelancer names to solve the N/A issue
      let projectDetails = projects.find(p => p.id === milestoneDetails.projectId);
      let projectTitle = projectDetails?.title || 'Unknown Project';
      
      // Get the current user's information from localStorage
      const userString = localStorage.getItem('user');
      let userData = null;
      if (userString) {
        try {
          userData = JSON.parse(userString);
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
      
      // For demonstration, directly use names from the current user and project
      // Determine client and freelancer based on the project relationship and current user
      let clientName = userData?.role === 'client' ? userData.name || userData.username || 'Current Client' : 'Project Client';
      let freelancerName = userData?.role === 'freelancer' ? userData.name || userData.username || 'Current Freelancer' : 'Project Freelancer';
      
      // If we have bidInfo with client and freelancer names, use those
      if (projectDetails && projectDetails.clientName) {
        clientName = projectDetails.clientName;
      }
      if (projectDetails && projectDetails.freelancerName) {
        freelancerName = projectDetails.freelancerName;
      }
      
      // Get the current user info for the profile page for additional info
      try {
        const profileResponse = await apiService.users.getProfile();
        if (profileResponse.data) {
          const profile = profileResponse.data;
          
          // If the current user is a client or freelancer, use their name
          if (userData?.role === 'client') {
            clientName = profile.name || profile.username || clientName;
          } else if (userData?.role === 'freelancer') {
            freelancerName = profile.name || profile.username || freelancerName;
          }
        }
      } catch (profileError) {
        console.error('Error fetching profile details:', profileError);
      }
      
      // Log what we'll use for the invoice
      console.log('Using project title:', projectTitle);
      console.log('Using client name:', clientName);
      console.log('Using freelancer name:', freelancerName);
      
      // Generate invoice number and set due date
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30); // Due date is 30 days from now
      
      // Step 1: Try to save the invoice in the database (but continue even if it fails)
      let databaseStorageSuccessful = false;
      
      try {
        // First, attempt to store in the database with minimal required fields
        await apiService.invoices.create({
          projectId: Number(milestoneDetails.projectId),
          milestoneId: Number(mId),
          invoiceNumber: invoiceNumber,
          amount: Number(milestoneDetails.amount),
          taxAmount: 0,
          totalAmount: Number(milestoneDetails.amount),
          dueDate: dueDate,
          status: InvoiceStatus.DRAFT, // Add required status field
          // Don't include clientId or freelancerId - let the backend handle that
        });
        
        databaseStorageSuccessful = true;
        
        toast({
          title: 'Invoice saved to database',
          description: 'Invoice record has been stored successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (dbError) {
        console.error('Failed to save invoice to database:', dbError);
        toast({
          title: 'Database storage failed',
          description: 'Could not save to database, but will still generate the invoice document',
          status: 'warning',
          duration: 4000,
          isClosable: true,
        });
      }
      
      // Step 2: Get the project details and names for the invoice
      try {
        // Try to get more detailed project information to improve the invoice
        const projectResponse = await apiService.projects.getById(milestoneDetails.projectId);
        if (projectResponse.data) {
          const projectData = projectResponse.data;
          projectTitle = projectData.title || projectTitle;
          
          // Try to extract client and freelancer names from the project
          if (projectData.client) {
            clientName = projectData.client.name || projectData.client.username || clientName;
          }
          if (projectData.assignedFreelancer) {
            freelancerName = projectData.assignedFreelancer.name || projectData.assignedFreelancer.username || freelancerName;
          }
        }
        
        // If the database storage was successful, try to fetch the invoice with details
        if (databaseStorageSuccessful) {
          try {
            // This part is optional and will only run if we successfully created the invoice
            const invoiceResponse = await apiService.invoices.getByInvoiceNumber(invoiceNumber);
            if (invoiceResponse.data) {
              // Use the client and freelancer names from the database if available
              if (invoiceResponse.data.clientName) clientName = invoiceResponse.data.clientName;
              if (invoiceResponse.data.freelancerName) freelancerName = invoiceResponse.data.freelancerName;
            }
          } catch (fetchError) {
            console.log('Could not fetch invoice details from database:', fetchError);
            // Continue with the names we already have
          }
        }
      } catch (projectError) {
        console.warn('Could not fetch detailed project info, using existing data:', projectError);
        // Continue with the names we already have
      }
      
      // Log what we're using in the invoice
      console.log('Using in invoice - Project:', projectTitle);
      console.log('Using in invoice - Client:', clientName);
      console.log('Using in invoice - Freelancer:', freelancerName);
      
      // Step 2: Create a downloadable HTML invoice with enhanced styling and more detailed information
      const invoiceContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #${invoiceNumber}</title>
  <style>
    @media print {
      body { margin: 0; padding: 0; background-color: white; }
      .invoice-box { border: none; box-shadow: none; padding: 30px; }
      .print-button { display: none; }
      .page-break { page-break-before: always; }
    }
    
    body { 
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
      margin: 0; 
      padding: 20px; 
      background-color: #f8f9fa; 
      color: #333; 
    }
    
    .container {
      max-width: 850px;
      margin: 0 auto;
    }
    
    .print-button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 20px;
      display: inline-block;
    }
    
    .print-button:hover {
      background-color: #0069d9;
    }
    
    .invoice-box { 
      background-color: white;
      max-width: 800px; 
      margin: auto; 
      padding: 30px; 
      border: 1px solid #ddd; 
      box-shadow: 0 0 10px rgba(0, 0, 0, .1);
      border-radius: 8px;
    }
    
    .invoice-header {
      border-bottom: 2px solid #eee;
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
    }
    
    .invoice-title {
      font-size: 32px;
      font-weight: 700;
      color: #007bff;
    }
    
    .invoice-details {
      text-align: right;
    }
    
    .invoice-meta { margin-bottom: 5px; }
    
    .invoice-id {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .project-milestone-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    
    .project-info, .people-info {
      flex: 1;
    }
    
    .info-label {
      font-weight: bold;
      display: inline-block;
      min-width: 100px;
      margin-bottom: 5px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    
    thead {
      background-color: #f8f9fa;
      border-bottom: 2px solid #dee2e6;
    }
    
    th, td {
      padding: 12px 15px;
      text-align: left;
    }
    
    th:last-child, td:last-child {
      text-align: right;
    }
    
    tbody tr:nth-child(even) {
      background-color: #f8f9fa;
    }
    
    tfoot {
      font-weight: bold;
      border-top: 2px solid #dee2e6;
    }
    
    .notes-section {
      margin-top: 40px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 4px;
    }
    
    .notes-title {
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 14px;
      color: #6c757d;
    }
  </style>
</head>
<body>
  <div class="container">
    <button class="print-button" onclick="window.print()">Print Invoice</button>
    
    <div class="invoice-box">
      <div class="invoice-header">
        <div>
          <div class="invoice-title">INVOICE</div>
          <div>Freelance Platform</div>
        </div>
        <div class="invoice-details">
          <div class="invoice-id">Invoice #${invoiceNumber}</div>
          <div class="invoice-meta"><strong>Issue Date:</strong> ${format(new Date(), 'MMM dd, yyyy')}</div>
          <div class="invoice-meta"><strong>Due Date:</strong> ${format(dueDate, 'MMM dd, yyyy')}</div>
        </div>
      </div>

      <div class="project-milestone-info">
        <div class="project-info">
          <h3>Project Details</h3>
          <div><span class="info-label">Project:</span> ${projectTitle}</div>
          <div><span class="info-label">Milestone:</span> ${milestoneDetails.title}</div>
          <div><span class="info-label">Status:</span> ${milestoneDetails.status}</div>
          <div><span class="info-label">Due Date:</span> ${milestoneDetails.dueDate ? format(new Date(milestoneDetails.dueDate), 'MMM dd, yyyy') : 'Not specified'}</div>
        </div>
        
        <div class="people-info">
          <h3>Parties</h3>
          <div><span class="info-label">Client:</span> ${clientName}</div>
          <div><span class="info-label">Freelancer:</span> ${freelancerName}</div>
          <div><span class="info-label">Payment Due:</span> Upon completion</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${milestoneDetails.title}</td>
            <td>$${milestoneDetails.amount.toLocaleString()}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>Subtotal</td>
            <td>$${milestoneDetails.amount.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Tax</td>
            <td>$0.00</td>
          </tr>
          <tr>
            <td>Total</td>
            <td>$${milestoneDetails.amount.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      <div class="notes-section">
        <div class="notes-title">Milestone Description / Notes</div>
        <div>${milestoneDetails.description}</div>
      </div>
      
      <div class="footer">
        <p>This invoice was generated on ${format(new Date(), 'MMMM dd, yyyy')} at ${format(new Date(), 'hh:mm a')}</p>
        <p>Thank you for your business!</p>
      </div>
    </div>
  </div>
</body>
</html>
      `;
      
      // Convert HTML to a Blob
      const blob = new Blob([invoiceContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Create a download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${projectTitle}-${milestoneDetails.title}-${format(new Date(), 'yyyy-MM-dd')}.html`;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Invoice downloaded',
        description: 'The invoice has been saved to the database and downloaded as an HTML file',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast({
        title: 'Failed to generate invoice',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
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
                      
                      {(milestone.status === MilestoneStatus.COMPLETED || milestone.status === MilestoneStatus.APPROVED) && (
                        <Button
                          leftIcon={<FiFileText />}
                          size="sm"
                          colorScheme="blue"
                          onClick={() => {
                            // Set the selected milestone and generate invoice directly
                            setSelectedMilestone(milestone);
                            handleGenerateInvoice(milestone.id);
                          }}
                        >
                          Generate Invoice
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

      {/* Invoice Generation Modal - this is kept for global invoice generation */}
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
              
              {selectedMilestone && (
                <Box mt={4} p={4} bg="gray.50" borderRadius="md" w="100%">
                  <Text fontWeight="bold" mb={2}>Selected Milestone:</Text>
                  <Text>{selectedMilestone.title}</Text>
                  <Text fontSize="sm" color="gray.600">Amount: ${selectedMilestone.amount}</Text>
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onInvoiceModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => handleGenerateInvoice()}
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