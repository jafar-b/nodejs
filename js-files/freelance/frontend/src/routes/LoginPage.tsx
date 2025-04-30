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
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import useAuth from '@/hooks/useAuth';
import AuthForm from "@components/auth/AuthForm";

interface LoginFormData {
  email: string;
  password: string;
}

function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (data: LoginFormData) => {
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        toast({
          title: 'Welcome back!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        // Add a small delay to ensure state is updated
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      } else {
        toast({
          title: 'Login failed', 
          description: result.message || 'Invalid email or password',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={{ base: 8, md: 16 }}>
      <Stack
        direction={{ base: "column", lg: "row" }}
        spacing={{ base: 8, lg: 16 }}
        align="center"
        justify="center"
      >
        <Box flex={1} display={{ base: "none", lg: "block" }}>
          <Image
            src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
            alt="Freelance work"
            borderRadius="xl"
            objectFit="cover"
            height="600px"
          />
        </Box>

        <VStack
          spacing={8}
          align="flex-start"
          flex={1}
          maxW={{ base: "full", lg: "500px" }}
        >
          <Box>
            <Heading size="xl" mb={2}>
              Welcome Back
            </Heading>
            <Text color="gray.600">Sign in to access your account</Text>
          </Box>

          <Card w="full" variant="outline">
            <CardBody>
              <AuthForm
                type="login"
                onSubmit={handleLogin}
                isLoading={isLoading}
              />
            </CardBody>
          </Card>

          <Text>
            Don't have an account?{" "}
            <Link
              as={RouterLink}
              to="/register"
              color="brand.500"
              fontWeight="semibold"
            >
              Sign up
            </Link>
          </Text>
        </VStack>
      </Stack>
    </Container>
  );
}

export default LoginPage;
