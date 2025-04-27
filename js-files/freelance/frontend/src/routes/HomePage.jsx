import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  SimpleGrid,
  Icon,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiBriefcase, FiUser, FiDollarSign, FiMessageSquare } from 'react-icons/fi';
import Header from '@components/navigation/Header';

function Feature({ icon, title, text }) {
  return (
    <Box
      p={5}
      rounded="lg"
      shadow="md"
      borderWidth="1px"
      bg={useColorModeValue('white', 'gray.700')}
      transition="transform 0.3s"
      _hover={{ transform: 'translateY(-5px)' }}
    >
      <Flex
        w={12}
        h={12}
        align="center"
        justify="center"
        rounded="full"
        bg="brand.50"
        color="brand.500"
        mb={4}
      >
        <Icon as={icon} boxSize={6} />
      </Flex>
      <Heading as="h3" size="md" mb={2} fontWeight="semibold">
        {title}
      </Heading>
      <Text color={useColorModeValue('gray.600', 'gray.300')}>{text}</Text>
    </Box>
  );
}

function HomePage() {
  return (
    <Box>
      <Header />
      
      {/* Hero Section */}
      <Box bg="gray.50" py={{ base: 10, md: 20 }}>
        <Container maxW="container.xl">
          <Stack
            direction={{ base: 'column', md: 'row' }}
            align="center"
            spacing={{ base: 8, md: 10 }}
            py={{ base: 8, md: 16 }}
          >
            <Stack flex={1} spacing={{ base: 5, md: 8 }}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: '3xl', sm: '4xl', lg: '5xl' }}
              >
                <Text as="span" color="brand.500">
                  SkillSync
                </Text>
                <br />
                <Text as="span">
                  Where Talent Meets Opportunity
                </Text>
              </Heading>
              <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }}>
                Connect with skilled freelancers or find your next project. 
                SkillSync makes collaboration seamless with powerful tools for 
                project management, secure messaging, and milestone tracking.
              </Text>
              <Stack
                spacing={{ base: 4, sm: 6 }}
                direction={{ base: 'column', sm: 'row' }}
              >
                <Button
                  as={RouterLink}
                  to="/register"
                  colorScheme="blue"
                  bg="brand.500"
                  _hover={{ bg: 'brand.600' }}
                  px={6}
                  py={6}
                  size="lg"
                >
                  Get Started
                </Button>
                <Button
                  as={RouterLink}
                  to="/login"
                  size="lg"
                  px={6}
                  py={6}
                  variant="outline"
                  colorScheme="blue"
                >
                  Sign In
                </Button>
              </Stack>
            </Stack>
            <Flex
              flex={1}
              justify="center"
              align="center"
              position="relative"
              w="full"
            >
              <Box
                position="relative"
                rounded="2xl"
                overflow="hidden"
                boxShadow="2xl"
              >
                <Image
                  alt="Hero Image"
                  fit="cover"
                  align="center"
                  w="100%"
                  h={{ base: '100%', sm: '400px', lg: '500px' }}
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                />
              </Box>
            </Flex>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={{ base: 10, md: 20 }}>
        <Container maxW="container.xl">
          <VStack spacing={8} mb={12}>
            <Heading
              textAlign="center"
              fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
            >
              Why Choose SkillSync?
            </Heading>
            <Text
              textAlign="center"
              color="gray.600"
              maxW="2xl"
              fontSize={{ base: 'md', md: 'lg' }}
            >
              Our comprehensive platform provides all the tools you need for successful
              freelance collaborations
            </Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            <Feature
              icon={FiBriefcase}
              title="Project Management"
              text="Easily post projects, manage bids, and track progress with our intuitive interface."
            />
            <Feature
              icon={FiUser}
              title="Skilled Freelancers"
              text="Access a diverse pool of pre-vetted professionals for any project needs."
            />
            <Feature
              icon={FiDollarSign}
              title="Secure Payments"
              text="Milestone-based payment system ensures fair transactions for all parties."
            />
            <Feature
              icon={FiMessageSquare}
              title="Communication Tools"
              text="Built-in messaging and file sharing for seamless collaboration."
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bg="brand.500" py={{ base: 12, md: 16 }}>
        <Container maxW="container.xl">
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={8}
            align={{ base: 'center', md: 'center' }}
            justify="space-between"
          >
            <Stack spacing={4} textAlign={{ base: 'center', md: 'left' }} maxW="2xl">
              <Heading color="white" size="xl">
                Ready to Start Your Project?
              </Heading>
              <Text color="white" opacity={0.8} fontSize="lg">
                Join thousands of clients and freelancers who trust SkillSync for their
                collaborative needs.
              </Text>
            </Stack>
            <HStack spacing={4}>
              <Button
                as={RouterLink}
                to="/register"
                bg="white"
                color="brand.500"
                size="lg"
                _hover={{ bg: 'gray.100' }}
              >
                Sign Up Now
              </Button>
            </HStack>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="gray.50" py={10}>
        <Container maxW="container.xl">
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'center', md: 'center' }}
            spacing={4}
          >
            <Text color="gray.500" fontSize="sm">
              © {new Date().getFullYear()} SkillSync. All rights reserved.
            </Text>
            <HStack spacing={6}>
              <Text as="a" href="#" color="gray.500" fontSize="sm">
                Terms of Service
              </Text>
              <Text as="a" href="#" color="gray.500" fontSize="sm">
                Privacy Policy
              </Text>
              <Text as="a" href="#" color="gray.500" fontSize="sm">
                Contact Us
              </Text>
            </HStack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;