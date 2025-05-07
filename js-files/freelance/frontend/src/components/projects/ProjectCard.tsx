import {
  Box,
  Badge,
  Heading,
  Text,
  Stack,
  HStack,
  VStack,
  Button,
  Avatar,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiDollarSign } from 'react-icons/fi';
import { ProjectStatus } from '@/AllEnums';

interface Client {
  name?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: {
    id: number;
    name: string;
  } | string;
  status: ProjectStatus;
  client?: Client;
  bidsCount: number;
  experienceLevel?: string;
  createdAt?: string;
}

interface ProjectCardProps {
  project: Project;
  viewType?: 'grid' | 'list';
  showActions?: boolean;
  showStatus?: boolean;
}

function ProjectCard({ 
  project, 
  viewType = 'grid', 
  showActions = true, 
  showStatus = true 
}: ProjectCardProps) {
  const {
    id,
    title,
    description,
    budget,
    deadline,
    category,
    status,
    client,
    bidsCount,
  } = project;

  const statusColors = {
    [ProjectStatus.OPEN]: 'green',
    [ProjectStatus.IN_PROGRESS]: 'blue',
    [ProjectStatus.COMPLETED]: 'gray',
    [ProjectStatus.CANCELLED]: 'red',
    [ProjectStatus.DRAFT]: 'blue',
    [ProjectStatus.ASSIGNED]: 'blue',
  } as const;

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.IN_PROGRESS:
        return 'In Progress';
      case ProjectStatus.OPEN:
        return 'Open';
      case ProjectStatus.COMPLETED:
        return 'Completed';
      case ProjectStatus.CANCELLED:
        return 'Cancelled';
      case ProjectStatus.DRAFT:
        return 'Draft';
      case ProjectStatus.ASSIGNED:
        return 'Assigned';
      default:
        return status;
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={5}
      bg={useColorModeValue('white', 'gray.700')}
      shadow="sm"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-2px)',
        shadow: 'md',
      }}
      display="flex"
      flexDirection={viewType === 'grid' ? 'column' : 'row'}
      gap={viewType === 'grid' ? 0 : 6}
    >
      <VStack
        align="start"
        spacing={4}
        flex={viewType === 'grid' ? 'auto' : 3}
      >
        <HStack spacing={2} width="100%" justify="space-between">
          <Heading as="h3" size="md" noOfLines={1} flex={1}>
            {title}
          </Heading>
          
          {showStatus && (
            <Badge colorScheme={statusColors[status] || 'gray'} py={1} px={2}>
              {getStatusText(status)}
            </Badge>
          )}
        </HStack>

        <Text noOfLines={3} color="gray.600">
          {description}
        </Text>

        <HStack spacing={4} width="100%">
          <HStack>
            <FiDollarSign />
            <Text fontWeight="medium">${typeof budget === 'string' ? parseFloat(budget).toLocaleString() : budget.toLocaleString()}</Text>
          </HStack>
          <HStack>
            <FiCalendar />
            <Text>{new Date(deadline).toLocaleDateString()}</Text>
          </HStack>
          <Badge colorScheme="blue" variant="subtle">
            {typeof category === 'string' ? category : category.name}
          </Badge>
        </HStack> 
        {client && (
          <Flex align="center">
            <Avatar 
              size="sm" 
              name={client.name || `${client.firstName || ''} ${client.lastName || ''}`} 
              src={client.avatar} 
              mr={2} 
            />
            <Text fontSize="sm" fontWeight="medium">
              {client.name || `${client.firstName || ''} ${client.lastName || ''}`.trim()}
            </Text>
          </Flex>
        )}
      </VStack>

      {showActions && (
        <Stack
          direction={viewType === 'grid' ? 'row' : 'column'}
          mt={viewType === 'grid' ? 4 : 0}
          spacing={3}
          justify={viewType === 'grid' ? 'flex-end' : 'center'}
          align={viewType === 'grid' ? 'center' : 'flex-start'}
          flex={viewType === 'grid' ? 'auto' : 1}
        >
          <Text fontSize="sm" color="gray.500">
            {bidsCount} {bidsCount === 1 ? 'bid' : 'bids'}
          </Text>
          <Button
            as={Link}
            to={`/dashboard/projects/${id}`}
            colorScheme="blue"
            variant="solid"
            size="sm"
          >
            View Details
          </Button>
        </Stack>
      )}
    </Box>
  );
}

export default ProjectCard; 