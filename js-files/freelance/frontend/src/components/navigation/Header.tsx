import { 
  Box, 
  Flex, 
  HStack, 
  IconButton, 
  Container,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Button,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  HamburgerIcon, 
  BellIcon, 
  ChevronDownIcon 
} from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

interface HeaderProps {
  onMenuOpen: () => void;
}

function Header({ onMenuOpen }: HeaderProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box 
      as="header" 
      bg={useColorModeValue('white', 'gray.800')} 
      borderBottomWidth="1px" 
      shadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Container maxW="container.xl" py={3}>
        <Flex justify="space-between" align="center">
          <HStack spacing={4}>
            {isAuthenticated && (
              <IconButton
                display={{ base: 'flex', lg: 'none' }}
                onClick={onMenuOpen}
                icon={<HamburgerIcon />}
                variant="ghost"
                aria-label="Open Menu"
                size="md"
              />
            )}
            
            <Box as={RouterLink} to="/" fontSize="xl" fontWeight="bold">
              <Text color="brand.500">SkillSync - Jafar</Text>
            </Box>
          </HStack>

          <HStack spacing={4}>
            {isAuthenticated ? (
              <>
                <IconButton
                  aria-label="Notifications"
                  icon={<BellIcon />}
                  variant="ghost"
                  fontSize="xl"
                />
                
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="ghost"
                    rightIcon={<ChevronDownIcon />}
                    px={2}
                  >
                    <HStack>
                      <Avatar 
                        size="sm" 
                        name={`${user?.firstName || ''} ${user?.lastName || ''}`}
                        src={user?.profileImage || user?.profile?.profileImage || user?.avatar || user?.avatarUrl || user?.profile?.avatar}
                      />
                      <Text 
                        display={{ base: 'none', md: 'block' }}
                      >
                        {`${user?.firstName || ''} ${user?.lastName || ''}`}
                      </Text>
                    </HStack>
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={RouterLink} to="/dashboard/profile">
                      My Profile
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <>
                <Button 
                  as={RouterLink} 
                  to="/login" 
                  variant="ghost"
                >
                  Login
                </Button>
                <Button 
                  as={RouterLink} 
                  to="/register" 
                  colorScheme="blue"
                >
                  Register
                </Button>
              </>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}

export default Header;
