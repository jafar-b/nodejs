import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Icon,
  Progress,
  useToast,
  Flex,
  Input,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';
import { useState, useRef, ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '@/api/ApiConfig';

interface FileUploaderProps {
  projectId: string | number;
}

function FileUploader({ projectId }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      setUploading(true);
      // Simulate upload progress
      const progressPromise = new Promise<void>((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            resolve();
          }
        }, 300);
      });

      // Wait for progress animation
      await progressPromise;

      // Create project data with files
      const projectData = {
        attachments: files
      };

      // Actual API call
      const response = await apiService.projects.update(projectId.toString(), projectData);
      return response.data;
    },
    onSuccess: () => {
      setFiles([]);
      setUploading(false);
      setUploadProgress(0);
      toast({
        title: 'Upload complete',
        description: `${files.length} file(s) uploaded successfully`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['project-files', projectId] });
    },
    onError: (error: Error) => {
      setUploading(false);
      setUploadProgress(0);
      toast({
        title: 'Upload failed',
        description: error.message || 'An error occurred during upload',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  const removeFile = (index: number) => {
    setFiles([...files.slice(0, index), ...files.slice(index + 1)]);
  };

  const handleUpload = () => {
    if (files.length === 0) {
      toast({
        title: 'No files selected',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    uploadMutation.mutate(formData);
  };

  return (
    <VStack spacing={4} align="stretch">
      <Flex
        p={5}
        borderWidth={2}
        borderRadius="md"
        borderStyle="dashed"
        borderColor="gray.300"
        bg={useColorModeValue('gray.50', 'gray.700')}
        justify="center"
        align="center"
        direction="column"
        cursor="pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Input
          type="file"
          multiple
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={uploading}
        />
        <Icon as={FiUpload} boxSize={8} color="gray.400" mb={2} />
        <Text fontWeight="medium">Click to select files</Text>
        <Text fontSize="sm" color="gray.500">
          or drag and drop files here
        </Text>
      </Flex>
      {files.length > 0 && (
        <Box>
          <Text fontWeight="medium" mb={2}>
            {files.length} file(s) selected
          </Text>
          <VStack align="stretch" spacing={2} maxH="200px" overflowY="auto">
            {files.map((file, index) => (
              <HStack 
                key={index} 
                p={2} 
                bg={useColorModeValue('white', 'gray.600')} 
                borderRadius="md"
                borderWidth="1px"
              >
                <Icon as={FiFile} />
                <Text flex={1} fontSize="sm" noOfLines={1}>
                  {file.name}
                </Text>
                <Text fontSize="xs" color="gray.500" whiteSpace="nowrap">
                  {(file.size / 1024).toFixed(0)} KB
                </Text>
                {!uploading && (
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => removeFile(index)}
                  >
                    <Icon as={FiX} />
                  </Button>
                )}
              </HStack>
            ))}
          </VStack>
        </Box>
      )}
      {uploading && (
        <Box>
          <Text mb={1} fontSize="sm">
            Uploading... {uploadProgress}%
          </Text>
          <Progress value={uploadProgress} size="sm" colorScheme="blue" />
        </Box>
      )}
      <Button
        leftIcon={<FiUpload />}
        colorScheme="blue"
        onClick={handleUpload}
        isLoading={uploading}
        loadingText="Uploading..."
        isDisabled={files.length === 0 || uploading}
      >
        Upload Files
      </Button>
    </VStack>
  );
}

export default FileUploader;
