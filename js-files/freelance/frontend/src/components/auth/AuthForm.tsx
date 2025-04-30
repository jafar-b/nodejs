import { userRole } from '@/AllEnums';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  FormErrorMessage,
  Flex,
  Radio,
  RadioGroup,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface AuthFormProps {
  type?: 'login' | 'register';
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

interface FormData {
  name?: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

function AuthForm({ type = 'login', onSubmit, isLoading }: AuthFormProps) {
  const [role, setRole] = useState<string>(userRole.CLIENT);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const processSubmit = async (data: FormData) => {
    setError('');
    try {
      let submitData = { ...data };
      if (type === 'register') {
        submitData.role = role;
      }
      await onSubmit(submitData);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return false;
    }
  };

  const password = watch('password', '');

  return (
    <Box as="form" onSubmit={handleSubmit(processSubmit)}>
      <Stack spacing={4}>
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {type === 'register' && (
          <>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Full Name</FormLabel>
              <Input {...register('name', { required: 'Name is required' })} />
              <FormErrorMessage>
                {errors.name?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>I am a:</FormLabel>
              <RadioGroup value={role} onChange={setRole}>
                <Flex gap={4}>
                  <Radio value={userRole.CLIENT}>Client</Radio>
                  <Radio value={userRole.FREELANCER}>Freelancer</Radio>
                </Flex>
              </RadioGroup>
            </FormControl>
          </>
        )}

        <FormControl isInvalid={!!errors.email}>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          <FormErrorMessage>
            {errors.email?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          <FormErrorMessage>
            {errors.password?.message}
          </FormErrorMessage>
        </FormControl>

        {type === 'register' && (
          <FormControl isInvalid={!!errors.confirmPassword}>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />
            <FormErrorMessage>
              {errors.confirmPassword?.message}
            </FormErrorMessage>
          </FormControl>
        )}

        <Button
          type="submit"
          colorScheme="blue"
          size="md"
          fontSize="md"
          isLoading={isLoading}
        >
          {type === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </Stack>
    </Box>
  );
}

export default AuthForm;
