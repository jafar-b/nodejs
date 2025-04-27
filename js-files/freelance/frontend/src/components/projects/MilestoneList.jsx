import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Flex,
  Progress,
  Divider,
  IconButton,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { FiPlus, FiCalendar, FiDollarSign, FiCheckCircle, FiClock } from 'react-icons/fi';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import apiService from '@api';
import { useAuth } from '@hooks/useAuth';

function MilestoneForm({ projectId, onClose, initialData = null }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const isEdit = !!initialData;
  
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      amount: initialData?.amount || 100,
      dueDate: initialData?.dueDate 
        ? new Date(initialData.dueDate).toISOString().split('T')[0]
        : '',
    },
  });
  
  // Calculate the minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  
  const mutation = useMutation({
    mutationFn: (data) => {
      if (isEdit) {
        return apiService.milestones.update(projectId, initialData.id, data);
      } else {
        return apiService.milestones.create(projectId, data);
      }
    },
    onSuccess: () => {
      toast({
        title: `Milestone ${isEdit ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries(['project-milestones', projectId]);
      onClose();
    },
    onError: (error) => {
      toast({
        title: `Failed to ${isEdit ? 'update' : 'create'} milestone`,
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
  
  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      amount: Number(data.amount),
      dueDate: new Date(data.dueDate),
    });
  };
  
  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={errors.title}>
          <FormLabel>Milestone Title</FormLabel>
          <Input
            {...register('title', {
              required: 'Title is required',
            })}
            placeholder="e.g., Initial Design, Backend Development"
          />
          <FormErrorMessage>
            {errors.title && errors.title.message}
          </FormErrorMessage>
        </FormControl>
        
        <FormControl isInvalid={errors.description}>
          <FormLabel>Description</FormLabel>
          <Textarea
            {...register('description', {
              required: 'Description is required',
            })}
            placeholder="Describe the deliverables for this milestone"
          />
          <FormErrorMessage>
            {errors.description && errors.description.message}
          </FormErrorMessage>
        </FormControl>
        
        <FormControl isInvalid={errors.amount}>
          <FormLabel>Amount ($)</FormLabel>
          <Controller
            name="amount"
            control={control}
            rules={{
              required: 'Amount is required',
              min: {
                value: 1,
                message: 'Minimum amount is $1',
              },
            }}
            render={({ field }) => (
              <NumberInput
                min={1}
                {...field}
                onChange={(valueString) => field.onChange(valueString)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )}
          />
          <FormErrorMessage>
            {errors.amount && errors.amount.message}
          </FormErrorMessage>
        </FormControl>
        
        <FormControl isInvalid={errors.dueDate}>
          <FormLabel>Due Date</FormLabel>
          <Input
            type="date"
            {...register('dueDate', {
              required: 'Due date is required',
              validate: (value) => 
                new Date(value) >= new Date(today) || 'Due date must be in the future',
            })}
            min={today}
          />
          <FormErrorMessage>
            {errors.dueDate && errors.dueDate.message}
          </FormErrorMessage>
        </FormControl>
      </VStack>
      
      <Flex justify="flex-end" mt={6} gap={3}>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          colorScheme="blue"
          type="submit"
          isLoading={mutation.isLoading}
        >
          {isEdit ? 'Update Milestone' : 'Create Milestone'}
        </Button>
      </Flex>
    </Box>
  );
}

function MilestoneCard({ milestone, projectId, isProjectOwner, onComplete }) {
  const { 
    id, 
    title, 
    description, 
    amount, 
    dueDate, 
    status, 
    completedDate 
  } = milestone;
  
  const isCompleted = status === 'completed';
  const isPending = status === 'pending';
  const isOverdue = !isCompleted && new Date(dueDate) < new Date();
  
  let statusColor = 'blue';
  if (isCompleted) statusColor = 'green';
  if (isOverdue) statusColor = 'red';
  
  const { onOpen, isOpen, onClose } = useDisclosure();
  
  return (
    <>
      <Card>
        <CardBody>
          <VStack align="stretch" spacing={4}>
            <Flex 
              justify="space-between"
              align="center"
              wrap="wrap"
              gap={2}
            >
              <Box>
                <HStack mb={1}>
                  <Badge colorScheme={statusColor} px={2} py={1}>
                    {isCompleted ? 'Completed' : isOverdue ? 'Overdue' : 'Pending'}
                  </Badge>
                </HStack>
                <Heading size="md">{title}</Heading>
              </Box>
              
              <HStack>
                <Flex align="center" gap={1}>
                  <Icon as={FiDollarSign} />
                  <Text fontWeight="bold">${amount}</Text>
                </Flex>
                <Flex align="center" gap={1}>
                  <Icon as={isCompleted ? FiCheckCircle : FiClock} />
                  <Text>
                    {isCompleted 
                      ? `Completed on ${new Date(completedDate).toLocaleDateString()}` 
                      : `Due ${new Date(dueDate).toLocaleDateString()}`}
                  </Text>
                </Flex>
              </HStack>
            </Flex>
            
            <Divider />
            
            <Text>{description}</Text>
            
            {isProjectOwner && isPending && (
              <Flex justify="flex-end">
                <Button
                  colorScheme="green"
                  size="sm"
                  leftIcon={<FiCheckCircle />}
                  onClick={() => onComplete(id)}
                >
                  Mark as Completed
                </Button>
              </Flex>
            )}
          </VStack>
        </CardBody>
      </Card>
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Milestone</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MilestoneForm
              projectId={projectId}
              initialData={milestone}
              onClose={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function MilestoneList({ projectId, isProjectOwner }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  
  // Query for fetching milestones
  const {
    data: milestones,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['project-milestones', projectId],
    queryFn: () => apiService.milestones.getByProject(projectId),
    // Mock data for development
    initialData: [
      {
        id: 1,
        title: 'Initial Design and Wireframes',
        description: 'Create initial mockups and wireframes for all key pages. Deliverables include Figma files with responsive designs for desktop and mobile.',
        amount: 800,
        dueDate: new Date(2025, 5, 15),
        status: 'completed',
        completedDate: new Date(2025, 5, 12),
      },
      {
        id: 2,
        title: 'Frontend Implementation',
        description: 'Implement the frontend user interface according to approved designs. Includes responsive layouts, navigation, and form components.',
        amount: 1000,
        dueDate: new Date(2025, 6, 10),
        status: 'pending',
      },
      {
        id: 3,
        title: 'Backend Development',
        description: 'Develop the backend API and database structure. Implement user authentication, product management, and cart functionality.',
        amount: 700,
        dueDate: new Date(2025, 6, 30),
        status: 'pending',
      },
    ],
  });
  
  // Mutation for completing milestones
  const completeMilestoneMutation = useMutation({
    mutationFn: (milestoneId) => apiService.milestones.complete(projectId, milestoneId),
    onSuccess: () => {
      toast({
        title: 'Milestone completed',
        description: 'The milestone has been marked as completed',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries(['project-milestones', projectId]);
    },
    onError: (error) => {
      toast({
        title: 'Failed to complete milestone',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
  
  if (isLoading) {
    return (
      <Flex justify="center" py={10}>
        <Spinner />
      </Flex>
    );
  }
  
  if (error) {
    return (
      <Text color="red.500">
        Error loading milestones: {error.message}
      </Text>
    );
  }
  
  // Calculate project progress
  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const progressPercentage = totalMilestones ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
  
  return (
    <Box>
      <Card mb={6}>
        <CardBody>
          <VStack align="stretch" spacing={4}>
            <Flex 
              justify="space-between" 
              align="center"
            >
              <Heading size="sm">Project Progress</Heading>
              <Text fontWeight="bold">{progressPercentage}%</Text>
            </Flex>
            <Progress 
              value={progressPercentage} 
              size="sm" 
              colorScheme="blue" 
              rounded="full" 
            />
            <Text fontSize="sm" color="gray.500">
              {completedMilestones} of {totalMilestones} milestones completed
            </Text>
          </VStack>
        </CardBody>
      </Card>
      
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">Milestones</Heading>
        {isProjectOwner && (
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={onOpen}
          >
            Add Milestone
          </Button>
        )}
      </Flex>
      
      <VStack spacing={4} align="stretch">
        {milestones.length === 0 ? (
          <Text color="gray.500" textAlign="center" py={8}>
            No milestones defined yet
          </Text>
        ) : (
          milestones.map((milestone) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              projectId={projectId}
              isProjectOwner={isProjectOwner}
              onComplete={(milestoneId) => completeMilestoneMutation.mutate(milestoneId)}
            />
          ))
        )}
      </VStack>
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Milestone</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MilestoneForm projectId={projectId} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default MilestoneList; 