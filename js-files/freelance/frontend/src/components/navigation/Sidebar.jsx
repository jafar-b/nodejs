import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
  Flex,
  Divider,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUser, 
  FiBriefcase, 
  FiFileText,
  FiMessageSquare,
  FiSearch,
  FiPlus,
  FiCheckSquare
} from 'react-icons/fi';

function NavItem({ icon, children, to, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <Box
      as={RouterLink}
      to={to}
      w="full"
      onClick={onClick}
    >
      <HStack
        align="center"
        px="4"
        py="3"
        borderRadius="md"
        transition="all 0.3s"
        bg={isActive ? 'brand.50' : 'transparent'}
        color={isActive ? 'brand.500' : 'gray.700'}
        fontWeight={isActive ? 'semibold' : 'medium'}
        _hover={{
          bg: isActive ? 'brand.50' : 'gray.100',
        }}
      >
        <Icon as={icon} boxSize="5" />
        <Text>{children}</Text>
      </HStack>
    </Box>
  );
}

function Sidebar({ userRole, onClick }) {
  const isClient = userRole === 'client';
  
  return (
    <Box as="nav">
      <VStack spacing={1} align="stretch">
        <NavItem to="/dashboard" icon={FiHome} onClick={onClick}>
          Dashboard
        </NavItem>
        <NavItem to="/dashboard/profile" icon={FiUser} onClick={onClick}>
          My Profile
        </NavItem>
        
        <Divider my={3} />
        
        {isClient ? (
          <>
            <Text px={4} fontSize="xs" fontWeight="bold" color="gray.500" mb={2}>
              CLIENT
            </Text>
            <NavItem to="/dashboard/projects" icon={FiBriefcase} onClick={onClick}>
              My Projects
            </NavItem>
            <NavItem to="/dashboard/projects/create" icon={FiPlus} onClick={onClick}>
              Post New Project
            </NavItem>
          </>
        ) : (
          <>
            <Text px={4} fontSize="xs" fontWeight="bold" color="gray.500" mb={2}>
              FREELANCER
            </Text>
            <NavItem to="/dashboard/browse-projects" icon={FiSearch} onClick={onClick}>
              Browse Projects
            </NavItem>
            <NavItem to="/dashboard/my-work" icon={FiBriefcase} onClick={onClick}>
              My Work
            </NavItem>
          </>
        )}
        
        <Divider my={3} />
        
        <Text px={4} fontSize="xs" fontWeight="bold" color="gray.500" mb={2}>
          SHARED
        </Text>
        <NavItem to="/dashboard/messages" icon={FiMessageSquare} onClick={onClick}>
          Messages
        </NavItem>
        <NavItem to="/dashboard/milestones" icon={FiCheckSquare} onClick={onClick}>
          Milestones
        </NavItem>
        <NavItem to="/dashboard/invoices" icon={FiFileText} onClick={onClick}>
          Invoices
        </NavItem>
      </VStack>
    </Box>
  );
}

export default Sidebar; 