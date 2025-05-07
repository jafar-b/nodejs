import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon, 
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUser, 

  FiFileText,
  FiMessageSquare,
  FiSearch,
  FiPlus
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { userRole } from '@/AllEnums';

interface NavItemProps {
  icon: IconType;
  children: React.ReactNode;
  to: string;
  onClick?: () => void;
}

function NavItem({ icon, children, to, onClick }: NavItemProps) {
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

interface SidebarProps {
  onClick?: () => void;
  userRole?: keyof typeof userRole;
}

function Sidebar({  userRole }: SidebarProps) {

  const isClient = userRole === 'CLIENT';
  const isFreelancer = userRole === 'FREELANCER';
  
  return (
    <Box
      as="nav"
      pos="fixed" 
      left="0"
      w="64"
      h="full"
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      py="5"
      overflowY="auto"
    >
      <VStack spacing={1} align="stretch">
        <NavItem icon={FiHome} to="/dashboard">
          Dashboard
        </NavItem>
        <NavItem icon={FiUser} to="/dashboard/profile">
          Profile
        </NavItem>
       
        
        {isClient && (
          <>
            <NavItem icon={FiPlus} to="/dashboard/projects/create">
              Create Project
            </NavItem>
            <NavItem icon={FiFileText} to="/dashboard/projects">
              My Projects
            </NavItem>
          </>
        )}
        
        {isFreelancer && (
          <>
            <NavItem icon={FiSearch} to="/dashboard/browse-projects">
              Browse Projects
            </NavItem>
            <NavItem icon={FiFileText} to="/dashboard/milestones">
              My Milestones
            </NavItem>
          </>
        )}
        
        <NavItem icon={FiMessageSquare} to="/dashboard/messages">
          Messages
        </NavItem>
        <NavItem icon={FiUser} to="/dashboard/about-us">
          About Us
        </NavItem>
      </VStack>
    </Box>
  );
}

export default Sidebar;
