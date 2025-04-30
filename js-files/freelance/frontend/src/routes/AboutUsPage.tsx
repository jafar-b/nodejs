import React from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  List,
  ListItem,
  ListIcon,
  Container,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const AboutUsPage: React.FC = () => {
  return (
    <Container maxW="7xl" py={10}>
      <Stack spacing={8}>
        <Box>
          <Heading as="h1" size="2xl" mb={4}>
            About Us
          </Heading>
          <Text fontSize="lg">
            Welcome to our Freelance Project Management Platform! This application is designed to streamline collaboration between freelancers and clients, offering a centralized space to manage projects, communicate effectively, and track progress seamlessly.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="xl" mb={4}>
            Our Mission
          </Heading>
          <Text fontSize="lg">
            To empower freelancers and clients by providing a user-friendly platform that simplifies project management, enhances communication, and fosters successful collaborations.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="xl" mb={4}>
            Key Features
          </Heading>
          <List spacing={3} pl={5}>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <strong>Project Management:</strong> Create, assign, and monitor projects with ease.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <strong>Messaging System:</strong> Real-time communication between freelancers and clients to ensure clarity and prompt feedback.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <strong>User Authentication:</strong> Secure login and registration system to protect user data.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <strong>Responsive Design:</strong> Accessible on various devices, ensuring flexibility and convenience.
            </ListItem>
          </List>
        </Box>

        <Box>
          <Heading as="h2" size="xl" mb={4}>
            Technologies Used
          </Heading>
          <List spacing={3} pl={5}>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="blue.500" />
              <strong>Frontend:</strong> HTML, CSS, JavaScript
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="blue.500" />
              <strong>Backend:</strong> Node.js
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="blue.500" />
              <strong>Database:</strong> PostgreSQL
            </ListItem>
          </List>
        </Box>

        <Box>
          <Heading as="h2" size="xl" mb={4}>
            About the Developer
          </Heading>
          <Text fontSize="lg">
            I'm <strong>Jafar Beldar</strong>, a passionate developer currently pursuing a Bachelor's degree in Information Technology. With a keen interest in building efficient web applications, this project reflects my dedication to creating solutions that address real-world challenges in the freelance industry.
          </Text>
          <Text fontSize="lg" mt={4}>
            Feel free to explore the project and contribute to its growth!
          </Text>
        </Box>
      </Stack>
    </Container>
  );
};

export default AboutUsPage;
