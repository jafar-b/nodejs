import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage,
  useToast,
  Spinner,
  Flex,
  Progress,
} from '@chakra-ui/react';
import { FiCalendar, FiDollarSign, FiCheck, FiFileText } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import apiService from '@/api/ApiConfig';
import { format } from 'date-fns';
import { MilestoneStatus } from '@/AllEnums';
import useAuth from '@/hooks/useAuth';

interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: MilestoneStatus;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

interface MilestoneFormData {
  title: string;
  description: string;
  amount: number;
  dueDate: string;
}

interface MilestoneListProps {
  projectId: string;
  isProjectOwner: boolean;
}

function MilestoneList({ projectId, isProjectOwner }: MilestoneListProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<MilestoneFormData>();

  const fetchMilestones = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.milestones.getByProject(projectId);
      setMilestones(response.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load milestones',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: MilestoneFormData) => {
    try {
      setIsSubmitting(true);
      await apiService.milestones.create(projectId, {
        title: data.title,
        description: data.description,
        amount: Number(data.amount),
        dueDate: data.dueDate,
      });
      toast({
        title: 'Milestone created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      reset();
      fetchMilestones();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create milestone',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteMilestone = async (milestoneId: string) => {
    try {
      await apiService.milestones.complete(milestoneId);
      toast({
        title: 'Milestone marked as complete',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchMilestones();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to complete milestone',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleApproveMilestone = async (milestoneId: string) => {
    try {
      await apiService.milestones.approve(milestoneId);
      toast({
        title: 'Milestone approved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchMilestones();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to approve milestone',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGenerateInvoice = async (milestoneId: string) => {
    try {
      console.log(`Generating invoice for milestone: ${milestoneId}`);
      await apiService.invoices.generateInvoice({
        projectId: projectId,
        status: 'pending'
      });
      toast({
        title: 'Invoice generated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to generate invoice',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, [projectId]);

  const getStatusColor = (status: MilestoneStatus) => {
    switch (status) {
      case MilestoneStatus.COMPLETED:
        return 'green';
      case MilestoneStatus.IN_PROGRESS:
        return 'blue';
      case MilestoneStatus.PENDING:
        return 'yellow';
      default:
        return 'gray';
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="200px">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  return (
    <Box>
      {isProjectOwner && (
        <Button
          colorScheme="blue"
          mb={6}
          onClick={onOpen}
          variant="solid"
        >
          Add Milestone
        </Button>
      )}

      <VStack spacing={4} align="stretch">
        {milestones.length === 0 ? (
          <Text textAlign="center" color="gray.500">
            No milestones yet
          </Text>
        ) : (
          milestones.map((milestone) => (
            <Card key={milestone.id}>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Text fontWeight="bold" fontSize="lg">
                      {milestone.title}
                    </Text>
                    <Badge colorScheme={getStatusColor(milestone.status)}>
                      {milestone.status}
                    </Badge>
                  </HStack>

                  <Text>{milestone.description}</Text>

                  <HStack spacing={4}>
                    <HStack>
                      <FiDollarSign />
                      <Text>${milestone.amount}</Text>
                    </HStack>
                    <HStack>
                      <FiCalendar />
                      <Text>Due {format(new Date(milestone.dueDate), 'MMM dd, yyyy')}</Text>
                    </HStack>
                  </HStack>

                  <Progress
                    value={milestone.status === MilestoneStatus.COMPLETED ? 100 : 0}
                    colorScheme={getStatusColor(milestone.status)}
                    size="sm"
                  />

                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.500">
                      Created {format(new Date(milestone.createdAt), 'MMM dd, yyyy')}
                    </Text>
                    <HStack spacing={2}>
                      {user?.role === 'freelancer' && milestone.status === MilestoneStatus.PENDING && (
                        <Button
                          size="sm"
                          colorScheme="green"
                          leftIcon={<FiCheck />}
                          onClick={() => handleCompleteMilestone(milestone.id)}
                        >
                          Mark as Complete
                        </Button>
                      )}
                      {milestone.status === MilestoneStatus.COMPLETED && (
                        <Button
                          size="sm"
                          colorScheme="blue"
                          leftIcon={<FiFileText />}
                          onClick={() => handleGenerateInvoice(milestone.id)}
                        >
                          Generate Invoice
                        </Button>
                      )}
                      {isProjectOwner && milestone.status === MilestoneStatus.IN_PROGRESS && (
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() => handleApproveMilestone(milestone.id)}
                        >
                          Approve
                        </Button>
                      )}
                    </HStack>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Milestone</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.title}>
                  <FormLabel>Title</FormLabel>
                  <Input
                    {...register('title', {
                      required: 'Title is required',
                    })}
                  />
                  <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.description}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    {...register('description', {
                      required: 'Description is required',
                    })}
                    rows={4}
                  />
                  <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.amount}>
                  <FormLabel>Amount ($)</FormLabel>
                  <Input
                    type="number"
                    {...register('amount', {
                      required: 'Amount is required',
                      min: {
                        value: 1,
                        message: 'Amount must be greater than 0',
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.dueDate}>
                  <FormLabel>Due Date</FormLabel>
                  <Input
                    type="date"
                    {...register('dueDate', {
                      required: 'Due date is required',
                    })}
                  />
                  <FormErrorMessage>{errors.dueDate?.message}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  isLoading={isSubmitting}
                >
                  Create Milestone
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default MilestoneList;
