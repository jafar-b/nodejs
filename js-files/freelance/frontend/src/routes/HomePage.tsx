import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Icon,
  HStack,
  VStack,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  Avatar,
  Wrap,
  WrapItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaCheck, FaCode, FaHandshake, FaMoneyBillWave } from 'react-icons/fa';
import React from 'react';

interface FeatureProps {
  title: string;
  text: string;
  icon: React.ElementType;
}

const Feature: React.FC<FeatureProps> = ({ title, text, icon }) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'brand.500'}
        mb={4}
      >
        <Icon as={icon} w={8} h={8} />
      </Flex>
      <Heading fontSize={'xl'}>{title}</Heading>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  );
};

interface TestimonialProps {
  content: string;
  name: string;
  role: string;
  avatar: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ content, name, role, avatar }) => {
  return (
    <Card maxW='md' variant='outline'>
      <CardBody>
        <Text mb={4}>{content}</Text>
        <HStack spacing={4}>
          <Avatar src={avatar} />
          <Box>
            <Text fontWeight='bold'>{name}</Text>
            <Text color='gray.600' fontSize='sm'>{role}</Text>
          </Box>
        </HStack>
      </CardBody>
    </Card>
  );
};

function HomePage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW={'container.xl'} py={{ base: 10, md: 20 }}>
          <Stack direction={{ base: 'column', lg: 'row' }} spacing={{ base: 8, md: 20 }} align='center'>
            <VStack spacing={6} align='flex-start' flex={1}>
              <Heading
                fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                lineHeight={1.2}
                fontWeight="bold"
              >
                Connect with the perfect <Text as='span' color={'brand.500'}>freelancers</Text> for your projects
              </Heading>
              <Text fontSize={'xl'} color={'gray.600'}>
                SkillSync makes it easy to find, hire, and collaborate with top talent from around the world.
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                <Button
                  as={RouterLink}
                  to="/register"
                  colorScheme='brand'
                  size='lg'
                  rounded='md'
                  px={6}
                >
                  Get Started
                </Button>
                <Button
                  as={RouterLink}
                  to="/browse-projects"
                  variant='outline'
                  colorScheme='brand'
                  size='lg'
                  rounded='md'
                  px={6}
                >
                  Browse Projects
                </Button>
              </Stack>
            </VStack>
            <Flex flex={1} justify='center'>
              <Image
                alt={'Hero Image'}
                src="https://images.unsplash.com/photo-1531973576160-7125cd663d86"
                objectFit={'cover'}
                borderRadius='xl'
                shadow='xl'
              />
            </Flex>
          </Stack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxW={'container.xl'} py={16}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 8, lg: 16 }}>
          <Stat p={4} shadow='md' border='1px' borderColor='gray.200' rounded='md'>
            <StatLabel color='gray.500' fontSize='lg'>Skilled Freelancers</StatLabel>
            <StatNumber fontSize='4xl' fontWeight='bold' color='brand.500'>10,000+</StatNumber>
          </Stat>
          <Stat p={4} shadow='md' border='1px' borderColor='gray.200' rounded='md'>
            <StatLabel color='gray.500' fontSize='lg'>Projects Completed</StatLabel>
            <StatNumber fontSize='4xl' fontWeight='bold' color='brand.500'>25,000+</StatNumber>
          </Stat>
          <Stat p={4} shadow='md' border='1px' borderColor='gray.200' rounded='md'>
            <StatLabel color='gray.500' fontSize='lg'>Client Satisfaction</StatLabel>
            <StatNumber fontSize='4xl' fontWeight='bold' color='brand.500'>97%</StatNumber>
          </Stat>
        </SimpleGrid>
      </Container>

      {/* Features Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW={'container.xl'} py={16}>
          <VStack spacing={12}>
            <Box textAlign="center">
              <Heading mb={4} size='xl'>How SkillSync Works</Heading>
              <Text fontSize={'lg'} color={'gray.600'} maxW={'3xl'}>
                Our platform connects clients with skilled freelancers, making remote collaboration seamless and productive.
              </Text>
            </Box>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
              <Feature
                icon={FaCode}
                title={'Post a Project'}
                text={'Describe your project, set your budget, and specify your requirements.'}
              />
              <Feature
                icon={FaHandshake}
                title={'Get Proposals'}
                text={'Receive detailed proposals from qualified freelancers eager to work on your project.'}
              />
              <Feature
                icon={FaCheck}
                title={'Hire the Best'}
                text={'Review profiles, portfolios, and ratings to select the perfect match for your needs.'}
              />
              <Feature
                icon={FaMoneyBillWave}
                title={'Pay Securely'}
                text={'Our milestone payment system ensures you only pay for approved work.'}
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxW={'container.xl'} py={16}>
        <VStack spacing={12}>
          <Box textAlign="center">
            <Heading mb={4} size='xl'>What Our Clients Say</Heading>
            <Text fontSize={'lg'} color={'gray.600'} maxW={'3xl'}>
              Hear from the businesses and freelancers who've experienced success with our platform.
            </Text>
          </Box>
          <Wrap spacing={8} justify='center'>
            <WrapItem>
              <Testimonial
                content="SkillSync made it incredibly easy to find a skilled developer for our web application. The quality of work exceeded our expectations."
                name="Sarah Johnson"
                role="Marketing Director"
                avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80"
              />
            </WrapItem>
            <WrapItem>
              <Testimonial
                content="As a freelancer, I've been able to grow my client base significantly through SkillSync. The platform is intuitive and payment protection gives me peace of mind."
                name="Michael Chen"
                role="Freelance Developer"
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80"
              />
            </WrapItem>
            <WrapItem>
              <Testimonial
                content="We've completed over 50 projects through SkillSync. The milestone payment system and clear communication tools make it our go-to platform."
                name="David Rodriguez"
                role="Product Manager"
                avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80"
              />
            </WrapItem>
          </Wrap>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Box bg='brand.500'>
        <Container maxW={'container.xl'} py={16}>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={8} align='center' justify='space-between'>
            <Box color='white' maxW='2xl'>
              <Heading mb={4} size='xl'>Ready to start your next project?</Heading>
              <Text fontSize='lg'>
                Join thousands of clients and freelancers who are already experiencing the benefits of our platform.
              </Text>
            </Box>
            <Button
              as={RouterLink}
              to="/register"
              bg='white'
              color='brand'
              size='lg'
              rounded='md'
              px={8}
              _hover={{
                bg: 'gray.100',
              }}
            >
              Sign Up Today
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage; 