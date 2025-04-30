import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputLeftAddon,
  Box,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '@/api/ApiConfig';

interface BidFormProps {
  projectId: string | number;
}

interface BidFormData {
  amount: number | string;
  deliveryTime: string;
  message: string;
}

function BidForm({ projectId }: BidFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<BidFormData>({
    defaultValues: {
      amount: '',
      deliveryTime: '',
      message: '',
    },
  });

  const bidMutation = useMutation({
    mutationFn: (bidData: BidFormData) => apiService.bids.create(String(projectId), bidData),
    onSuccess: () => {
      toast({
        title: 'Bid submitted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      reset();
      queryClient.invalidateQueries(['project', projectId]);
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to submit bid',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: BidFormData) => {
    setIsSubmitting(true);
    bidMutation.mutate({
      amount: parseFloat(data.amount as string),
      deliveryTime: data.deliveryTime,
      message: data.message,
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6}>
        <HStack spacing={6} align="flex-start">
          <FormControl isInvalid={!!errors.amount} flex={1}>
            <FormLabel>Bid Amount ($)</FormLabel>
            <Controller
              name="amount"
              control={control}
              rules={{
                required: 'Amount is required',
                min: {
                  value: 1,
                  message: 'Minimum bid amount is $1',
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

          <FormControl isInvalid={!!errors.deliveryTime} flex={1}>
            <FormLabel>Delivery Time</FormLabel>
            <InputGroup>
              <Input
                {...register('deliveryTime', {
                  required: 'Delivery time is required',
                })}
                placeholder="e.g., 7 days, 2 weeks"
              />
            </InputGroup>
            <FormErrorMessage>
              {errors.deliveryTime && errors.deliveryTime.message}
            </FormErrorMessage>
          </FormControl>
        </HStack>

        <FormControl isInvalid={!!errors.message}>
          <FormLabel>Cover Letter</FormLabel>
          <Textarea
            {...register('message', {
              required: 'Message is required',
              minLength: {
                value: 50,
                message: 'Please write at least 50 characters',
              },
            })}
            placeholder="Tell the client why you're the best fit for this project"
            minH="150px"
          />
          <FormErrorMessage>
            {errors.message && errors.message.message}
          </FormErrorMessage>
        </FormControl>

        <Button
          mt={4}
          colorScheme="blue"
          isLoading={isSubmitting}
          type="submit"
        >
          Submit Bid
        </Button>
      </Stack>
    </Box>
  );
}

export default BidForm;
