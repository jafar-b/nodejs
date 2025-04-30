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
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch, FiFilter, FiChevronRight } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import apiService from '@/api';
import ProjectCard from '@components/projects/ProjectCard';
import { ProjectStatus } from '@/AllEnums';

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
] as const;

type Category = typeof CATEGORIES[number];

interface Project {
  id: string;
  title: string;
  description: string;
  category: Category;
  budget: number;
  experienceLevel: ExperienceLevel;
  createdAt: string;
  deadline: string;
  bidsCount: number;
  status: ProjectStatus;
}

type SortOption = 'newest' | 'oldest' | 'budget-high' | 'budget-low' | 'deadline';
type ExperienceLevel = 'all' | 'entry' | 'intermediate' | 'expert';

function BrowseProjectsPage() {
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 5000]);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  // Responsive drawer for filters on mobile
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Fetch available projects
  const { data, isLoading, error } = useQuery<{ data: Project[] }, Error>({
    queryKey: ['availableProjects'],
    queryFn: () => apiService.projects.getAll({ status: 'open' }),
  });
  
  const projects = data?.data || [];
  
  // Filter projects based on search and filters
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || 
                           selectedCategories.includes(project.category);
    
    const matchesBudget = project.budget >= budgetRange[0] && 
                         project.budget <= budgetRange[1];
    
    const matchesExperience = experienceLevel === 'all' || 
                            project.experienceLevel === experienceLevel;
    
    return matchesSearch && matchesCategory && matchesBudget && matchesExperience;
  });
  
  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'budget-high':
        return b.budget - a.budget;
      case 'budget-low':
        return a.budget - b.budget;
      case 'deadline':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      default:
        return 0;
    }
  });
  
  const handleCategoryChange = (category: Category) => {
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
            onChange={(val) => setBudgetRange(val as [number, number])}
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
              <InputRightAddon>$</InputRightAddon>
            </InputGroup>
            <Text>to</Text>
            <InputGroup size="sm">
              <Input value={budgetRange[1]} readOnly />
              <InputRightAddon>$</InputRightAddon>
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
          onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
        >
          <option value="all">All Levels</option>
          <option value="entry">Entry Level</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </Select>
      </Box>
    </VStack>
  );
  
  if (isLoading) {
    return (
      <Flex justify="center" py={10}>
        <Spinner size="lg" color="blue.500" />
      </Flex>
    );
  }
  
  if (error) {
    return (
      <Alert status="error" mb={6}>
        <AlertIcon />
        Error loading projects: {error instanceof Error ? error.message : 'Unknown error'}
      </Alert>
    );
  }
  
  return (
    <Box>
      <Stack spacing={6}>
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg">Browse Projects</Heading>
            <Text color="gray.600">Find projects that match your skills</Text>
          </Box>
          
          {isMobile && (
            <Button
              leftIcon={<FiFilter />}
              onClick={onOpen}
              variant="outline"
            >
              Filters
            </Button>
          )}
        </Flex>

        <HStack spacing={4}>
          <InputGroup>
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
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            maxW="200px"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="budget-high">Highest Budget</option>
            <option value="budget-low">Lowest Budget</option>
            <option value="deadline">Closest Deadline</option>
          </Select>
        </HStack>

        <Flex gap={6}>
          {!isMobile && (
            <Box w="300px" display={{ base: 'none', md: 'block' }}>
              <Card>
                <CardBody>
                  <FiltersContent />
                </CardBody>
              </Card>
            </Box>
          )}

          <Box flex={1}>
            {isLoading ? (
              <Flex justify="center" py={10}>
                <Spinner size="lg" color="blue.500" />
              </Flex>
            ) : error ? (
              <Alert status="error">
                <AlertIcon />
                Error loading projects: {error ? error : 'Unknown error'}
              </Alert>
            ) : sortedProjects.length === 0 ? (
              <Text textAlign="center" py={10} color="gray.500">
                No projects found matching your criteria.
              </Text>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {sortedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </SimpleGrid>
            )}
          </Box>
        </Flex>
      </Stack>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Filters</DrawerHeader>
          <DrawerBody>
            <FiltersContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default BrowseProjectsPage; 