import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Textarea,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';

const CATEGORIES = [
  'Web Development',
  'Mobile App Development',
  'UI/UX Design',
  'Graphic Design',
  'Content Writing',
  'Marketing',
  'Data Entry',
  'Virtual Assistant',
  'Customer Service',
  'Other',
];

function ProjectForm({ onSubmit, initialData = {}, isEdit = false, isLoading = false }) {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData.title || '',
      description: initialData.description || '',
      category: initialData.category || '',
      budget: initialData.budget || 100,
      deadline: initialData.deadline 
        ? new Date(initialData.deadline).toISOString().split('T')[0]
        : '',
    },
  });

  // Calculate the minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  const processSubmit = (data) => {
    // Convert deadline string to Date object
    const formData = {
      ...data,
      deadline: new Date(data.deadline),
      budget: Number(data.budget),
    };
    
    onSubmit(formData);
  };

  return (
    <Box as="form" onSubmit={handleSubmit(processSubmit)}>
      <Stack spacing={6}>
        <FormControl isInvalid={errors.title}>
          <FormLabel>Project Title</FormLabel>
          <Input
            {...register('title', {
              required: 'Title is required',
              minLength: {
                value: 5,
                message: 'Title should be at least 5 characters',
              },
              maxLength: {
                value: 100,
                message: 'Title should not exceed 100 characters',
              },
            })}
            placeholder="Enter a descriptive title"
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
              minLength: {
                value: 30,
                message: 'Description should be at least 30 characters',
              },
            })}
            placeholder="Provide detailed information about your project"
            minH="150px"
          />
          <FormErrorMessage>
            {errors.description && errors.description.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.category}>
          <FormLabel>Category</FormLabel>
          <Select
            {...register('category', {
              required: 'Please select a category',
            })}
            placeholder="Select category"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <FormErrorMessage>
            {errors.category && errors.category.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.budget}>
          <FormLabel>Budget (USD)</FormLabel>
          <Controller
            name="budget"
            control={control}
            rules={{
              required: 'Budget is required',
              min: {
                value: 10,
                message: 'Minimum budget is $10',
              },
            }}
            render={({ field }) => (
              <NumberInput
                min={10}
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
            {errors.budget && errors.budget.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.deadline}>
          <FormLabel>Deadline</FormLabel>
          <Input
            type="date"
            {...register('deadline', {
              required: 'Deadline is required',
              validate: (value) => 
                new Date(value) >= new Date(today) || 'Deadline must be in the future',
            })}
            min={today}
          />
          <FormErrorMessage>
            {errors.deadline && errors.deadline.message}
          </FormErrorMessage>
        </FormControl>

        <Button
          mt={4}
          colorScheme="blue"
          isLoading={isLoading}
          type="submit"
          size="lg"
        >
          {isEdit ? 'Update Project' : 'Create Project'}
        </Button>
      </Stack>
    </Box>
  );
}

export default ProjectForm; 