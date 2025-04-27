import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  HStack,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  VStack,
  Badge,
  Divider,
  Flex,
  Checkbox,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  InputRightAddon,
  Spinner,
  Card,
  CardBody,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch, FiFilter, FiChevronRight } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import apiService from '@api';
import ProjectCard from '@components/projects/ProjectCard';

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

function BrowseProjectsPage() {
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [budgetRange, setBudgetRange] = useState([0, 5000]);
  const [experienceLevel, setExperienceLevel] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Responsive drawer for filters on mobile
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Fetch available projects
  const { data: projects, isLoading } = useQuery({
    queryKey: ['availableProjects'],
    queryFn: () => apiService.projects.getAll({ status: 'open' }),
    // Mock data for development
    initialData: [
      {
        id: 1,
        title: 'E-commerce Website Development',
        description: 'Build a fully functional e-commerce website with product listings, user authentication, and payment processing.',
        budget: 2500,
        deadline: new Date(2025, 6, 30),
        category: 'Web Development',
        status: 'open',
        client: {
          id: 101,
          name: 'TechSolutions Inc.',
          avatar: null,
        },
        experienceLevel: 'intermediate',
        bidsCount: 7,
        createdAt: new Date(2025, 4, 15),
      },
      {
        id: 2,
        title: 'Logo Design for Tech Startup',
        description: 'Create a modern, professional logo for a new tech startup in the AI space.',
        budget: 350,
        deadline: new Date(2025, 5, 15),
        category: 'Graphic Design',
        status: 'open',
        client: {
          id: 102,
          name: 'AI Innovations',
          avatar: null,
        },
        experienceLevel: 'entry',
        bidsCount: 12,
        createdAt: new Date(2025, 4, 17),
      },
      {
        id: 3,
        title: 'Mobile App for Fitness Tracking',
        description: 'Develop a mobile application for tracking workouts, nutrition, and fitness progress.',
        budget: 3000,
        deadline: new Date(2025, 7, 20),
        category: 'Mobile App Development',
        status: 'open',
        client: {
          id: 103,
          name: 'FitLife Pro',
          avatar: null,
        },
        experienceLevel: 'expert',
        bidsCount: 5,
        createdAt: new Date(2025, 4, 10),
      },
      {
        id: 4,
        title: 'Content Writing for Blog',
        description: 'Write 10 SEO-optimized blog posts about artificial intelligence and machine learning.',
        budget: 500,
        deadline: new Date(2025, 5, 30),
        category: 'Content Writing',
        status: 'open',
        client: {
          id: 104,
          name: 'TechBlog Media',
          avatar: null,
        },
        experienceLevel: 'entry',
        bidsCount: 8,
        createdAt: new Date(2025, 4, 20),
      },
      {
        id: 5,
        title: 'Social Media Marketing Campaign',
        description: 'Create and execute a social media marketing campaign for a new line of organic skincare products.',
        budget: 1200,
        deadline: new Date(2025, 6, 15),
        category: 'Marketing',
        status: 'open',
        client: {
          id: 105,
          name: 'Pure Organics',
          avatar: null,
        },
        experienceLevel: 'intermediate',
        bidsCount: 3,
        createdAt: new Date(2025, 4, 18),
      },
    ],
  });
  
  // Filter projects based on search and filters
  const filteredProjects = projects?.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || 
                           selectedCategories.includes(project.category);
    
    const matchesBudget = project.budget >= budgetRange[0] && 
                         project.budget <= budgetRange[1];
    
    const matchesExperience = experienceLevel === 'all' || 
                            project.experienceLevel === experienceLevel;
    
    return matchesSearch && matchesCategory && matchesBudget && matchesExperience;
  }) || [];
  
  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'budget-high':
        return b.budget - a.budget;
      case 'budget-low':
        return a.budget - b.budget;
      case 'deadline':
        return new Date(a.deadline) - new Date(b.deadline);
      default:
        return 0;
    }
  });
  
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Filter components
  const FiltersContent = () => (
    <VStack align="start" spacing={6} w="full">
      <Box w="full">
        <Text fontWeight="medium" mb={2}>
          Categories
        </Text>
        <VStack align="start" spacing={2}>
          {CATEGORIES.map((category) => (
            <Checkbox
              key={category}
              isChecked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            >
              {category}
            </Checkbox>
          ))}
        </VStack>
      </Box>
      
      <Divider />
      
      <Box w="full">
        <Text fontWeight="medium" mb={2}>
          Budget Range
        </Text>
        <VStack spacing={4} w="full">
          <RangeSlider
            min={0}
            max={5000}
            step={100}
            value={budgetRange}
            onChange={setBudgetRange}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
          
          <HStack w="full" justify="space-between">
            <InputGroup size="sm">
              <Input value={budgetRange[0]} readOnly />
              <InputRightAddon children="$" />
            </InputGroup>
            <Text>to</Text>
            <InputGroup size="sm">
              <Input value={budgetRange[1]} readOnly />
              <InputRightAddon children="$" />
            </InputGroup>
          </HStack>
        </VStack>
      </Box>
      
      <Divider />
      
      <Box w="full">
        <Text fontWeight="medium" mb={2}>
          Experience Level
        </Text>
        <Select 
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
        >
          <option value="all">All Levels</option>
          <option value="entry">Entry Level</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </Select>
      </Box>
      
      {isMobile && (
        <Button colorScheme="blue" w="full" onClick={onClose}>
          Apply Filters
        </Button>
      )}
    </VStack>
  );
  
  if (isLoading) {
    return (
      <Flex justify="center" py={10}>
        <Spinner />
      </Flex>
    );
  }
  
  return (
    <Box>
      <Stack 
        direction={{ base: 'column', md: 'row' }} 
        justify="space-between" 
        align={{ base: 'flex-start', md: 'center' }}
        mb={6}
        spacing={4}
      >
        <Box>
          <Heading size="lg">Browse Projects</Heading>
          <Text color="gray.600">Find the perfect project for your skills</Text>
        </Box>
      </Stack>
      
      <HStack mb={6} spacing={4} wrap="wrap">
        <InputGroup flex={1}>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        
        <Select 
          w={{ base: 'full', md: '200px' }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="budget-high">Budget: High to Low</option>
          <option value="budget-low">Budget: Low to High</option>
          <option value="deadline">Deadline: Soonest</option>
        </Select>
        
        {isMobile && (
          <Button 
            leftIcon={<FiFilter />} 
            onClick={onOpen}
            w="full"
          >
            Filters
          </Button>
        )}
      </HStack>
      
      <Flex gap={6}>
        {!isMobile && (
          <Card w="250px" minW="250px" position="sticky" top="80px" alignSelf="flex-start">
            <CardBody>
              <FiltersContent />
            </CardBody>
          </Card>
        )}
        
        <Box flex={1}>
          {sortedProjects.length === 0 ? (
            <Text textAlign="center" py={10} color="gray.500">
              No projects found matching your search criteria.
            </Text>
          ) : (
            <VStack spacing={6} align="stretch">
              <Text color="gray.500">
                Showing {sortedProjects.length} projects
              </Text>
              
              <SimpleGrid columns={{ base: 1 }} spacing={6}>
                {sortedProjects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    viewType="list" 
                  />
                ))}
              </SimpleGrid>
            </VStack>
          )}
        </Box>
      </Flex>
      
      {/* Mobile Filters Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Filters</DrawerHeader>
          <DrawerBody py={4}>
            <FiltersContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default BrowseProjectsPage; 