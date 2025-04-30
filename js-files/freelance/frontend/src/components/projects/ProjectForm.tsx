import { PaymentType } from '@/AllEnums';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Button,
  VStack,
  FormErrorMessage,
  SimpleGrid,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  isLoading?: boolean;
  initialData?: ProjectFormData;
}

interface ProjectFormData {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  categoryId: number;
  paymentType:PaymentType;
}

const CATEGORIES = [
  { id: 1, name: 'Web Development' },
  { id: 2, name: 'Mobile App Development' },
  { id: 3, name: 'UI/UX Design' },
  { id: 4, name: 'Graphic Design' },
  { id: 5, name: 'Content Writing' },
  { id: 6, name: 'Marketing' },
  { id: 7, name: 'Data Entry' },
  { id: 8, name: 'Virtual Assistant' },
  { id: 9, name: 'Customer Service' },
  { id: 10, name: 'Other' },
] as const;

function ProjectForm({ onSubmit, isLoading = false, initialData }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>(initialData || {
    title: '',
    description: '',
    budget: 0,
    deadline: '',
    categoryId: 1,
    paymentType: PaymentType.FIXED,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.budget <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }
    
    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else if (new Date(formData.deadline) < new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ProjectFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleBudgetChange = (_: string, value: number) => {
    setFormData(prev => ({ ...prev, budget: value }));
    
    if (errors.budget) {
      setErrors(prev => ({ ...prev, budget: undefined }));
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={6}>
        <FormControl isInvalid={!!errors.title} isRequired>
          <FormLabel>Project Title</FormLabel>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter project title"
          />
          <FormErrorMessage>{errors.title}</FormErrorMessage>
        </FormControl>
        
        <FormControl isInvalid={!!errors.description} isRequired>
          <FormLabel>Project Description</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your project in detail"
            rows={6}
          />
          <FormErrorMessage>{errors.description}</FormErrorMessage>
        </FormControl>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
          <FormControl isInvalid={!!errors.budget} isRequired>
            <FormLabel>Budget ($)</FormLabel>
            <NumberInput
              min={0}
              value={formData.budget}
              onChange={handleBudgetChange}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.budget}</FormErrorMessage>
          </FormControl>
          
          <FormControl isInvalid={!!errors.deadline} isRequired>
            <FormLabel>Deadline</FormLabel>
            <Input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
            />
            <FormErrorMessage>{errors.deadline}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
          <FormControl isInvalid={!!errors.categoryId} isRequired>
            <FormLabel>Category</FormLabel>
            <Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
            >
              {CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.categoryId}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.paymentType} isRequired>
            <FormLabel>Payment Type</FormLabel>
            <Select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleInputChange}
            >
              <option value={PaymentType.FIXED}>Fixed Price</option>
              <option value={PaymentType.HOURLY}>Hourly Rate</option>
            </Select>
            <FormErrorMessage>{errors.paymentType}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <Box w="full" pt={4}>
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            width="full"
            isLoading={isLoading}
          >
            Submit 
          </Button>
        </Box>
      </VStack>
    </form>
  );
}

export default ProjectForm; 