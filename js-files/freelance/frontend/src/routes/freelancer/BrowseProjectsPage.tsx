import React, { useState } from 'react';
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
import { FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';
import ProjectCard from '@/components/projects/ProjectCard';
import { useQuery } from '@tanstack/react-query';
import apiService from '@/api/ApiConfig';
import { ProjectStatus } from '@/AllEnums';

type SortOption = 'newest' | 'oldest' | 'budget-high' | 'budget-low' | 'deadline';
type ExperienceLevel = 'all' | 'entry' | 'intermediate' | 'expert';

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

type CategoryName = typeof CATEGORIES[number];

interface CategoryObject {
  id: number;
  name: string;
}

interface Project {
  id: string | number;
  title: string;
  description: string;
  category: CategoryObject | CategoryName; 
  budget: number | string;
  experienceLevel?: ExperienceLevel;
  createdAt: string;
  deadline: string;
  bidsCount: number;
  status: ProjectStatus;
  client?: {
    id: number;
    firstName?: string;
    lastName?: string;
    name?: string;
  };
}

function BrowseProjectsPage() {
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<CategoryName[]>([]);
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 200000]); // Increased max to 200,000 to show higher budget projects
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  // Responsive drawer for filters on mobile
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Fetch available projects - simplified query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['availableProjects'],
    queryFn: () => apiService.projects.getAll({ status: ProjectStatus.OPEN }),
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });
  
  console.log('API Response:', data);
  
  // Process the API response
  let projects: Project[] = [];
  if (data) {
    if (Array.isArray(data)) {
      projects = data;
    } else if (data.data && Array.isArray(data.data)) {
      projects = data.data;
    }
  }
  
  console.log('Projects:', projects);

  // Restore proper filtering for projects
  const filteredProjects = projects.filter(project => {
    if (!project || !project.title || !project.description) return false;
    
    // Match search term against title and description
    const matchesSearch = searchTerm.trim() === '' || 
                         project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Get category name
    const getCategoryName = (cat: any): string => {
      if (typeof cat === 'string') return cat;
      if (cat && cat.name) return cat.name;
      return 'Unknown';
    };
    
    // Match selected categories
    const categoryName = getCategoryName(project.category);
    const matchesCategory = selectedCategories.length === 0 || 
                          selectedCategories.some(c => categoryName.includes(c));
    
    // Parse budget for comparison
    const projectBudget = typeof project.budget === 'string' ? parseFloat(project.budget) : project.budget;
    const matchesBudget = projectBudget >= budgetRange[0] && projectBudget <= budgetRange[1];
    
    return matchesSearch && matchesCategory && matchesBudget;
  });

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
              isChecked={selectedCategories.includes(category as CategoryName)}
              onChange={() => handleCategoryChange(category as CategoryName)}
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
          {/* Increased max to match the default range maximum */}
          <RangeSlider
            min={0}
            max={200000}
            step={1000}
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

  const handleCategoryChange = (category: CategoryName) => {
    setSelectedCategories((prev) => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Simple debug component for development
  const DebugProjects = () => (
    <Box mt={6} p={4} bg="gray.50" borderRadius="md">
      <Heading size="sm" mb={2}>Debug Projects Data</Heading>
      <Text>Total projects: {projects.length}</Text>
      <Text>Filtered projects: {filteredProjects.length}</Text>
      {filteredProjects.map(project => (
        <Box key={project.id} p={2} my={2} bg="white" borderRadius="md" boxShadow="sm">
          <Text fontWeight="bold">{project.title}</Text>
          <Text>ID: {project.id}</Text>
          <Text>Category: {typeof project.category === 'string' ? project.category : project.category.name}</Text>
          <Text>Budget: ${typeof project.budget === 'string' ? project.budget : project.budget.toFixed(2)}</Text>
        </Box>
      ))}
    </Box>
  );
  
  return (
    <Box>
      <Stack spacing={6}>
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg">Browse Projects</Heading>
            <Text color="gray.600">Find projects that match your skills</Text>
          </Box>
          
          <HStack spacing={2}>
            <Button
              leftIcon={<FiRefreshCw />}
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              isLoading={isLoading}
            >
              Refresh
            </Button>
            
            {isMobile && (
              <Button
                leftIcon={<FiFilter />}
                onClick={onOpen}
                variant="outline"
                size="sm"
              >
                Filters
              </Button>
            )}
          </HStack>
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
                Error loading projects: {error instanceof Error ? error.message : 'Unknown error'}
              </Alert>
            ) : filteredProjects.length === 0 ? (
              <Text textAlign="center" py={10} color="gray.500">
                No projects found matching your criteria.
              </Text>
            ) : (
              <>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {filteredProjects.map((project) => {
                    console.log('Rendering project:', project);
                    
                    const formattedProject = {
                      ...project,
                      // Convert id to string to match ProjectCard's expected type
                      id: String(project.id),
                      // Convert budget to number to match ProjectCard's expected type
                      budget: typeof project.budget === 'string' ? parseFloat(project.budget) : project.budget,
                      // Handle category format
                      category: typeof project.category === 'string' 
                        ? { id: 0, name: project.category } 
                        : project.category,
                      // Ensure client has proper format  
                      client: project.client ? {
                        ...project.client,
                        name: project.client.name || 
                              `${project.client.firstName || ''} ${project.client.lastName || ''}`.trim()
                      } : undefined
                    };
                    
                    return <ProjectCard key={project.id} project={formattedProject} />;
                  })}
                </SimpleGrid>
                
                {/* <DebugProjects /> */}
              </>
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