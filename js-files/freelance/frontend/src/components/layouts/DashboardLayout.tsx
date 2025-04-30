import { Outlet } from 'react-router-dom';
import { 
  Box, 
  Flex, 
  Container, 
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useBreakpointValue
} from '@chakra-ui/react';
import Sidebar from '@components/navigation/Sidebar';
import Header from '@components/navigation/Header';
import useAuth from '@/hooks/useAuth';

function DashboardLayout() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  return (
    <Flex minH="100vh" direction="column">
      <Header onMenuOpen={onOpen} />
      <Flex flex={1}>
        {isDesktop ? (
          <Box
            w="250px"
            minW="250px"
            bg="white"
            py={5}
            px={3}
            boxShadow="sm"
            display={{ base: 'none', lg: 'block' }}
          >
            <Sidebar userRole={user?.role?.toString()} />
          </Box>
        ) : (
          <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader borderBottomWidth="1px">SkillSync</DrawerHeader>
              <DrawerBody p={0}>
                <Sidebar userRole={user?.role?.toString()} onClick={onClose} />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )}
        <Box 
          flex={1} 
          py={6}
          px={{ base: 4, md: 6 }}
          bg="gray.50"
          minH="calc(100vh - 64px)"
        >
          <Container maxW="container.xl">
            <Outlet />
          </Container>
        </Box>
      </Flex>
    </Flex>
  );
}

export default DashboardLayout;
