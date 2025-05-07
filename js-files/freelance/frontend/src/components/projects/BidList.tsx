import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Button,
  Divider,
  Flex,
  Card,
  CardBody,
  Icon,
  useColorModeValue,
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { FiClock, FiDollarSign, FiStar, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import useAuth from '@/hooks/useAuth';
import apiService from '@/api/ApiConfig';
import { format } from 'date-fns';
import { BidStatus, userRole } from '@/AllEnums';

interface Freelancer {
  id: number;
  name: string;
  avatar?: string;
  rating: number;
}

interface BidFormData {
  amount: number;
  estimated_days: number;
  proposal: string;
}

interface Bid {
  id: string;
  amount: number;
  estimated_days: number;
  proposal: string;
  status: string;
  createdAt: string;
  freelancer?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface BidListProps {
  projectId: string;
  isProjectOwner: boolean;
}

function BidList({ projectId, isProjectOwner }: BidListProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const toast = useToast();
  const isFreelancer = user?.role === userRole.FREELANCER;

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<BidFormData>();

  const fetchBids = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.bids.getByProject(projectId);
      console.log('Bids response:', response.data); // Debug log
      setBids(response.data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load bids',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: BidFormData) => {
    try {
      setIsSubmitting(true);
      await apiService.bids.create(projectId, {
        amount: Number(data.amount),
        estimated_days: Number(data.estimated_days),
        proposal: data.proposal,
        project_id: Number(projectId),
        freelancer_id: Number(user?.id)
      });
      toast({
        title: 'Proposal submitted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      reset();
      fetchBids();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit proposal',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    try {
      await apiService.bids.accept(projectId, bidId);
      toast({
        title: 'Proposal accepted successfully',
        description: 'The freelancer has been assigned to this project',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setBids(prevBids => 
        prevBids.map(bid => 
          bid.id === bidId 
            ? { ...bid, status: BidStatus.ACCEPTED }
            : bid
        )
      );
      fetchBids();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to accept proposal',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchBids();
  }, [projectId]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="200px">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  return (
    <Box>
      {isFreelancer && !isProjectOwner && (
        <Button
          colorScheme="blue"
          mb={6}
          onClick={onOpen}
        >
          Submit Proposal
        </Button>
      )}

      <VStack spacing={4} align="stretch">
        {bids.length === 0 ? (
          <Card>
            <CardBody textAlign="center" py={10}>
              <Text color="gray.500">
                {isFreelancer 
                  ? "No proposals have been submitted yet."
                  : "No proposals have been received yet."}
              </Text>
            </CardBody>
          </Card>
        ) : (
          bids.map((bid) => (
            <Card key={bid.id} borderWidth="1px" borderColor={bid.status === 'accepted' ? 'green.200' : 'gray.200'}>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <HStack>
                      <Avatar
                        size="sm"
                        name={bid.freelancer?.name}
                        src={bid.freelancer?.avatar}
                      />
                      <Box>
                        <Text fontWeight="medium">
                          {bid.freelancer?.name}
                        </Text>
                        <HStack>
                          <Icon as={FiStar} color="yellow.400" />
                          <Text fontSize="sm">4.5 / 5</Text>
                        </HStack>
                      </Box>
                    </HStack>
                    <Badge colorScheme={bid.status === BidStatus.ACCEPTED ? 'green' : 'gray'}>
                      {bid.status.toUpperCase()}
                    </Badge>
                  </HStack>

                  <HStack spacing={4}>
                    <HStack>
                      <Icon as={FiDollarSign} />
                      <Text fontWeight="bold">${bid.amount.toLocaleString()}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiClock} />
                      <Text>{bid.estimated_days} days</Text>
                    </HStack>
                  </HStack>

                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={1}>
                      Proposal:
                    </Text>
                    <Text whiteSpace="pre-wrap">{bid.proposal}</Text>
                  </Box>

                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.500">
                      Submitted {format(new Date(bid.createdAt), 'MMM dd, yyyy')}
                    </Text>
                    {isProjectOwner && (
                      <HStack>
                        {bid.freelancer && (
                          <Button
                            as={Link}
                            to={`/freelancers/${bid.freelancer.id}`}
                            size="sm"
                            variant="outline"
                            colorScheme="blue"
                          >
                            View Profile
                          </Button>
                        )}
                        {bid.status !== BidStatus.ACCEPTED && (
                          <Button
                            size="sm"
                            colorScheme="green"
                            onClick={() => handleAcceptBid(bid.id)}
                            leftIcon={<Icon as={FiCheck} />}
                          >
                            Approve & Assign
                          </Button>
                        )}
                      </HStack>
                    )}
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit Proposal</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.amount}>
                  <FormLabel>Bid Amount ($)</FormLabel>
                  <Controller
                    name="amount"
                    control={control}
                    rules={{
                      required: 'Amount is required',
                      min: {
                        value: 1,
                        message: 'Amount must be greater than 0',
                      },
                    }}
                    render={({ field }) => (
                      <NumberInput
                        {...field}
                        min={1}
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

                <FormControl isInvalid={!!errors.estimated_days}>
                  <FormLabel>Estimated Days</FormLabel>
                  <Controller
                    name="estimated_days"
                    control={control}
                    rules={{
                      required: 'Estimated days is required',
                      min: {
                        value: 1,
                        message: 'Estimated days must be at least 1 day',
                      },
                    }}
                    render={({ field }) => (
                      <NumberInput
                        {...field}
                        min={1}
                        onChange={(value) => field.onChange(value)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />
                  <FormErrorMessage>{errors.estimated_days?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.proposal}>
                  <FormLabel>Proposal</FormLabel>
                  <Textarea
                    {...register('proposal', {
                      required: 'Proposal is required',
                      minLength: {
                        value: 50,
                        message: 'Proposal must be at least 50 characters',
                      },
                    })}
                    rows={4}
                    placeholder="Describe your approach, experience, and why you're the best fit for this project..."
                  />
                  <FormErrorMessage>{errors.proposal?.message}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  isLoading={isSubmitting}
                >
                  Submit Proposal
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default BidList;
