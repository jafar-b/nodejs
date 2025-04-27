import {
  Box,
  Container,
  Heading,
  Text,
  Link,
  VStack,
  Card,
  CardBody,
  Image,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import AuthForm from '@components/auth/AuthForm';

function RegisterPage() {
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = async (data) => {
    const result = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });
    
    if (result.success) {
      toast({
        title: 'Account created successfully!',
        description: 'Please sign in with your new account',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
    } else {
      toast({
        title: 'Registration failed',
        description: result.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw new Error(result.message);
    }
  };

  return (
    <Container maxW="container.xl" py={{ base: 8, md: 16 }}>
      <Stack
        direction={{ base: 'column', lg: 'row' }}
        spacing={{ base: 8, lg: 16 }}
        align="center"
        justify="center"
      >
        <Box flex={1} display={{ base: 'none', lg: 'block' }}>
          <Image 
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
            alt="Collaboration" 
            borderRadius="xl"
            objectFit="cover"
            height="600px"
          />
        </Box>

        <VStack 
          spacing={8} 
          align="flex-start" 
          flex={1} 
          maxW={{ base: 'full', lg: '500px' }}
        >
          <Box>
            <Heading size="xl" mb={2}>Create Your Account</Heading>
            <Text color="gray.600">
              Sign up to start your freelance journey
            </Text>
          </Box>

          <Card w="full" variant="outline">
            <CardBody>
              <AuthForm 
                type="register" 
                onSubmit={handleRegister} 
                isLoading={isLoading} 
              />
            </CardBody>
          </Card>

          <Text>
            Already have an account?{' '}
            <Link as={RouterLink} to="/login" color="brand.500" fontWeight="semibold">
              Sign in
            </Link>
          </Text>
        </VStack>
      </Stack>
    </Container>
  );
}

export default RegisterPage; 