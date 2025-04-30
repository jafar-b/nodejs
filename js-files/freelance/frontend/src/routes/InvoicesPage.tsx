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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2, FiFileText } from 'react-icons/fi';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import useAuth from '@/hooks/useAuth';
import apiService from '@/api/ApiConfig';
import { InvoiceStatus, userRole } from '@/AllEnums';

interface Project {
  id: string;
  title: string;
}

interface Milestone {
  id: string;
  title: string;
  amount: number;
}

interface Invoice {
  id: string;
  projectId: string;
  milestoneId: string;
  invoiceNumber: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  dueDate: string;
  paymentMethod?: string;
  attachments?: string[];
  project?: {
    id: string;
    title: string;
  };
  milestone?: {
    id: string;
    title: string;
  };
}

interface InvoiceFormData {
  projectId: string;
  milestoneId: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  dueDate: string;
  paymentMethod?: string;
  attachments?: File[];
}

function InvoicesPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [formAction, setFormAction] = useState<'create' | 'edit'>('create');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isFreelancer = user?.role === userRole.FREELANCER;

  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>();

  const watchAmount = watch('amount');
  const watchTaxAmount = watch('taxAmount');

  // Calculate total amount whenever amount or tax amount changes
  useEffect(() => {
    const amount = Number(watchAmount) || 0;
    const taxAmount = Number(watchTaxAmount) || 0;
    setValue('totalAmount', amount + taxAmount);
  }, [watchAmount, watchTaxAmount, setValue]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await (
          isFreelancer 
            ? apiService.projects.getFreelancerProjects() 
            : apiService.projects.getClientProjects()
        );
        // Ensure we have an array of projects
        const projectsData = Array.isArray(response.data) ? response.data : [];
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Failed to load projects',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, [isFreelancer, toast]);

  // Fetch milestones when project is selected
  useEffect(() => {
    const fetchMilestones = async () => {
      if (!selectedProject || selectedProject === 'all') {
        setMilestones([]);
        return;
      }

      try {
        const response = await apiService.milestones.getByProject(selectedProject);
        setMilestones(response.data || []);
      } catch (error) {
        console.error('Error fetching milestones:', error);
        toast({
          title: 'Failed to load milestones',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setMilestones([]);
      }
    };

    fetchMilestones();
  }, [selectedProject, toast]);

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        let response;
        
        if (selectedProject && selectedProject !== 'all') {
          // Get invoices for specific project
          response = await apiService.invoices.getByProject(selectedProject);
        } else if (Array.isArray(projects) && projects.length > 0) {
          // Get all invoices for user's projects
          const projectPromises = projects.map(project => 
            apiService.invoices.getByProject(project.id)
          );
          const projectResponses = await Promise.all(projectPromises);
          const allInvoices = projectResponses.flatMap(res => Array.isArray(res.data) ? res.data : []);
          response = { data: allInvoices };
        } else {
          // No projects, set empty invoices
          response = { data: [] };
        }
        
        setInvoices(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        toast({
          title: 'Failed to load invoices',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setInvoices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [projects, selectedProject, toast]);

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId === 'all' ? null : projectId);
    setValue('milestoneId', '');
    setMilestones([]); // Reset milestones when project changes
  };

  const handleCreateInvoice = () => {
    setFormAction('create');
    setCurrentInvoice(null);
    reset({
      projectId: '',
      milestoneId: '',
      amount: 0,
      taxAmount: 0,
      totalAmount: 0,
      dueDate: '',
      paymentMethod: '',
    });
    onOpen();
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setFormAction('edit');
    setCurrentInvoice(invoice);
    
    // Format date to YYYY-MM-DD for input field
    const formattedDate = new Date(invoice.dueDate).toISOString().split('T')[0];
    
    setValue('projectId', invoice.projectId);
    setValue('milestoneId', invoice.milestoneId);
    setValue('amount', invoice.amount);
    setValue('taxAmount', invoice.taxAmount);
    setValue('totalAmount', invoice.totalAmount);
    setValue('dueDate', formattedDate);
    setValue('paymentMethod', invoice.paymentMethod || '');
    
    onOpen();
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      await apiService.invoices.delete(invoiceId);
      
      // Update the local state
      setInvoices(invoices.filter(i => i.id !== invoiceId));
      
      toast({
        title: 'Invoice deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to delete invoice',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      await apiService.invoices.markAsPaid(invoiceId);
      
      // Update the local state
      setInvoices(invoices.map(i => 
        i.id === invoiceId ? { ...i, status: InvoiceStatus.PAID } : i
      ));
      
      toast({
        title: 'Invoice marked as paid',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to mark invoice as paid',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      setIsSubmitting(true);
      
      if (formAction === 'create') {
        await apiService.invoices.create({
          projectId: Number(data.projectId),
          milestoneId: Number(data.milestoneId),
          amount: Number(data.amount),
          taxAmount: Number(data.taxAmount),
          totalAmount: Number(data.totalAmount),
          status: InvoiceStatus.DRAFT,
          dueDate: new Date(data.dueDate),
          paymentMethod: data.paymentMethod,
        });
        toast({
          title: 'Invoice created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else if (formAction === 'edit' && currentInvoice) {
        await apiService.invoices.update(currentInvoice.id, {
          amount: Number(data.amount),
          taxAmount: Number(data.taxAmount),
          totalAmount: Number(data.totalAmount),
          dueDate: new Date(data.dueDate),
          paymentMethod: data.paymentMethod,
        });
        toast({
          title: 'Invoice updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      // Refresh invoices data
      const response = await apiService.invoices.getAll();
      setInvoices(response.data);
      
      onClose();
    } catch (error) {
      toast({
        title: 'Failed to save invoice',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    let color;
    switch (status) {
      case InvoiceStatus.DRAFT:
        color = 'gray';
        break;
      case InvoiceStatus.SENT:
        color = 'blue';
        break;
      case InvoiceStatus.PAID:
        color = 'green';
        break;
      case InvoiceStatus.CANCELLED:
        color = 'red';
        break;
      case InvoiceStatus.OVERDUE:
        color = 'orange';
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

  if (isLoading && projects.length === 0) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  return (
    <Box>
      <HStack justifyContent="space-between" mb={6}>
        <Heading size="lg">Invoices</Heading>
        
        {!isFreelancer && (
          <Button
            leftIcon={<FiPlus />}
            colorScheme="brand"
            onClick={handleCreateInvoice}
          >
            Generate Invoice
          </Button>
        )}
      </HStack>

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
          </Stack>
        </CardBody>
      </Card>

      {isLoading ? (
        <Flex justify="center" p={10}>
          <Spinner />
        </Flex>
      ) : invoices.length > 0 ? (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Invoice #</Th>
                <Th>Project</Th>
                <Th>Milestone</Th>
                <Th>Amount</Th>
                <Th>Due Date</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {invoices.map(invoice => (
                <Tr key={invoice.id}>
                  <Td>{invoice.invoiceNumber}</Td>
                  <Td>{invoice.project?.title || 'N/A'}</Td>
                  <Td>{invoice.milestone?.title || 'N/A'}</Td>
                  <Td>${invoice.totalAmount.toLocaleString()}</Td>
                  <Td>{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</Td>
                  <Td>{getStatusBadge(invoice.status)}</Td>
                  <Td>
                    <HStack spacing={2}>
                      {!isFreelancer && invoice.status === InvoiceStatus.DRAFT && (
                        <>
                          <IconButton
                            icon={<FiEdit />}
                            aria-label="Edit invoice"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditInvoice(invoice)}
                          />
                          <IconButton
                            icon={<FiTrash2 />}
                            aria-label="Delete invoice"
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                          />
                        </>
                      )}
                      
                      {isFreelancer && invoice.status === InvoiceStatus.SENT && (
                        <Button
                          leftIcon={<FiFileText />}
                          size="sm"
                          colorScheme="green"
                          onClick={() => handleMarkAsPaid(invoice.id)}
                        >
                          Mark as Paid
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
            <Heading size="md" mb={2}>No Invoices Found</Heading>
            <Text color="gray.600" mb={6}>
              {!isFreelancer 
                ? "You haven't generated any invoices yet."
                : selectedProject 
                  ? "There are no invoices for this project yet."
                  : "There are no invoices yet."}
            </Text>
            
            {!isFreelancer && (
              <Button
                leftIcon={<FiPlus />}
                colorScheme="brand"
                onClick={handleCreateInvoice}
              >
                Generate First Invoice
              </Button>
            )}
          </CardBody>
        </Card>
      )}

      {/* Invoice Form Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              {formAction === 'create' ? 'Create Invoice' : 'Edit Invoice'}
            </ModalHeader>
            <ModalCloseButton />
            
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.projectId}>
                  <FormLabel>Project</FormLabel>
                  <Select
                    {...register('projectId', { required: 'Project is required' })}
                    onChange={(e) => handleProjectChange(e.target.value)}
                    disabled={formAction === 'edit'}
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

                <FormControl isInvalid={!!errors.milestoneId}>
                  <FormLabel>Milestone</FormLabel>
                  <Select
                    {...register('milestoneId', { required: 'Milestone is required' })}
                    disabled={!selectedProject || formAction === 'edit'}
                  >
                    <option value="">Select a milestone</option>
                    {milestones.map(milestone => (
                      <option key={milestone.id} value={milestone.id}>
                        {milestone.title} (${milestone.amount})
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.milestoneId?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.amount}>
                  <FormLabel>Amount</FormLabel>
                  <Controller
                    name="amount"
                    control={control}
                    rules={{ required: 'Amount is required' }}
                    render={({ field }) => (
                      <NumberInput
                        {...field}
                        min={0}
                        precision={2}
                        onChange={(value) => field.onChange(Number(value))}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />
                  <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.taxAmount}>
                  <FormLabel>Tax Amount</FormLabel>
                  <Controller
                    name="taxAmount"
                    control={control}
                    rules={{ required: 'Tax amount is required' }}
                    render={({ field }) => (
                      <NumberInput
                        {...field}
                        min={0}
                        precision={2}
                        onChange={(value) => field.onChange(Number(value))}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />
                  <FormErrorMessage>{errors.taxAmount?.message}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>Total Amount</FormLabel>
                  <Input
                    {...register('totalAmount')}
                    isReadOnly
                    value={watch('totalAmount')}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.dueDate}>
                  <FormLabel>Due Date</FormLabel>
                  <Input
                    type="date"
                    {...register('dueDate', { required: 'Due date is required' })}
                  />
                  <FormErrorMessage>{errors.dueDate?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.paymentMethod}>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    {...register('paymentMethod')}
                  >
                    <option value="">Select payment method</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="PAYPAL">PayPal</option>
                  </Select>
                  <FormErrorMessage>{errors.paymentMethod?.message}</FormErrorMessage>
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
    </Box>
  );
}

export default InvoicesPage; 