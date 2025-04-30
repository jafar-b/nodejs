import {
  Box,
  Text,
  HStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiFile,
  FiDownload,
  FiMoreVertical,
  FiTrash2,
  FiEye,
  FiImage,
  FiFileText,
  FiPackage,
} from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '@/api/ApiConfig';
import useAuth from '@/hooks/useAuth';

// Type definitions
interface FileType {
  id: number;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: {
    id: number;
    name: string;
  };
  createdAt: string | Date;
}

interface FileListProps {
  projectId: string | number;
}

// Helper function to get icon based on file type
function getFileIcon(fileType: string) {
  if (fileType.includes('image')) return FiImage;
  if (fileType.includes('pdf') || fileType.includes('text')) return FiFileText;
  return FiPackage;
}

// Helper function to format file size
function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileList({ projectId }: FileListProps) {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Query for fetching files
  const {
    data: files = [],
    isLoading,
    error,
  } = useQuery<FileType[]>({
    queryKey: ['project-files', projectId],
    queryFn: async () => {
      const response = await apiService.projects.getById(projectId.toString());
      return response.data.attachments || [];
    },
    // Mock data for development
    initialData: [
      {
        id: 1,
        name: 'project-brief.pdf',
        type: 'application/pdf',
        size: 1258000,
        url: '#',
        uploadedBy: {
          id: 101,
          name: 'TechSolutions Inc.',
        },
        createdAt: new Date(2025, 4, 15),
      },
      {
        id: 2,
        name: 'mockup-design.jpg',
        type: 'image/jpeg',
        size: 2450000,
        url: '#',
        uploadedBy: {
          id: 101,
          name: 'TechSolutions Inc.',
        },
        createdAt: new Date(2025, 4, 15),
      },
      {
        id: 3,
        name: 'portfolio.pdf',
        type: 'application/pdf',
        size: 3540000,
        url: '#',
        uploadedBy: {
          id: 201,
          name: 'John Smith',
        },
        createdAt: new Date(2025, 4, 18),
      },
    ],
  });

  // Mutation for deleting files
  const deleteFileMutation = useMutation({
    mutationFn: async (fileId: number) => {
      const response = await apiService.projects.update(projectId.toString(), {
        removeAttachment: fileId,
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'File deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Invalidate and refetch files
      queryClient.invalidateQueries({ queryKey: ['project-files', projectId] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error deleting file',
        description: error.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  if (isLoading) {
    return (
      <Flex justify="center" py={10}>
        <Spinner />
      </Flex>
    );
  }

  if (error) {
    return (
      <Text color="red.500">
        Error loading files: {(error as Error).message}
      </Text>
    );
  }

  if (files.length === 0) {
    return (
      <Box 
        textAlign="center" 
        py={10} 
        bg={useColorModeValue('gray.50', 'gray.700')}
        borderRadius="md"
      >
        <Icon as={FiFile} boxSize={10} color="gray.400" />
        <Text mt={4} color="gray.500">
          No files uploaded yet
        </Text>
      </Box>
    );
  }

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Size</Th>
            <Th>Uploaded By</Th>
            <Th>Date</Th>
            <Th width="120px">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {files.map((file) => (
            <Tr key={file.id}>
              <Td>
                <HStack>
                  <Icon as={getFileIcon(file.type)} />
                  <Text>{file.name}</Text>
                </HStack>
              </Td>
              <Td>{formatFileSize(file.size)}</Td>
              <Td>{file.uploadedBy.name}</Td>
              <Td>{new Date(file.createdAt).toLocaleDateString()}</Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    icon={<FiDownload />}
                    aria-label="Download file"
                    size="sm"
                    variant="ghost"
                    as="a"
                    href={file.url}
                    download
                  />
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      aria-label="More options"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem icon={<FiEye />}>
                        Preview
                      </MenuItem>
                      <MenuItem 
                        icon={<FiTrash2 />} 
                        color="red.500"
                        isDisabled={file.uploadedBy.id !== user?.id}
                        onClick={() => deleteFileMutation.mutate(file.id)}
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default FileList;
