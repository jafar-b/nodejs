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
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { userRole } from '@/AllEnums';

function RegisterPage() {
  

  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username:'',
    email: '',
    passwordHash: '',
    role: userRole.CLIENT,
  });
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e:any) => {
    e.preventDefault();

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      email: formData.email,
      role:formData.role,
      passwordHash: formData.passwordHash,
    };

    const result = await registerUser(userData, formData.role);

    if (result.success) {
      console.log(formData);      
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
            <CardBody as="form" onSubmit={handleRegister}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input 
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input 
                    type="password"
                    name="passwordHash"
                    value={formData.passwordHash}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Role</FormLabel>
                  <Select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="CLIENT">Client</option>
                    <option value="FREELANCER">Freelancer</option>
                    {/* <option value="ADMIN">Admin</option> */}
                  </Select>
                </FormControl>

                <Button 
                  type="submit" 
                  colorScheme="blue" 
                  isLoading={isLoading} 
                  width="full"
                >
                  Register
                </Button>
              </VStack>
            </CardBody>
          </Card>

          <Text>
            Already have an account?{' '}
            <Link as={RouterLink} to="/login" color="blue.500" fontWeight="semibold">
              Sign in
            </Link>
          </Text>
        </VStack>
      </Stack>
    </Container>
  );
}

export default RegisterPage;
