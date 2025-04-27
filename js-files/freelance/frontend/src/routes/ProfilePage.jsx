import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  VStack,
  HStack,
  Text,
  Avatar,
  AvatarBadge,
  IconButton,
  Divider,
  Textarea,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FiEdit, FiCamera } from 'react-icons/fi';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@hooks/useAuth';
import apiService from '@api';

function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      skills: user?.skills?.join(', ') || '',
    },
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setIsLoading(true);
    try {
      await apiService.users.uploadAvatar(formData);
      toast({
        title: 'Profile picture updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to update profile picture',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await apiService.users.updateProfile(data);
      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Failed to update profile',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>My Profile</Heading>

      <Stack spacing={8} direction={{ base: 'column', lg: 'row' }}>
        <VStack
          spacing={6}
          align="center"
          minW={{ base: 'full', lg: '300px' }}
        >
          <Card w="full">
            <CardBody display="flex" flexDir="column" alignItems="center" p={6}>
              <Box position="relative" mb={6}>
                <Avatar
                  size="2xl"
                  name={user?.name}
                  src={user?.avatar}
                  border="4px solid white"
                  shadow="lg"
                >
                  <AvatarBadge
                    as={IconButton}
                    size="sm"
                    rounded="full"
                    top="auto"
                    bottom="5%"
                    colorScheme="blue"
                    aria-label="Upload photo"
                    icon={<FiCamera />}
                    onClick={() => fileInputRef.current.click()}
                  />
                </Avatar>
                <Input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                />
              </Box>

              <VStack spacing={1} textAlign="center">
                <Heading as="h3" size="md">
                  {user?.name}
                </Heading>
                <Text color="gray.500">{user?.role === 'client' ? 'Client' : 'Freelancer'}</Text>
              </VStack>

              <Divider my={6} />

              <VStack spacing={3} align="start" w="full">
                <HStack justify="space-between" w="full">
                  <Text fontWeight="medium">Email</Text>
                  <Text>{user?.email}</Text>
                </HStack>
                <HStack justify="space-between" w="full">
                  <Text fontWeight="medium">Member Since</Text>
                  <Text>
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>

        <Card flex={1}>
          <CardBody p={6}>
            <HStack justify="space-between" mb={6}>
              <Heading size="md">Profile Information</Heading>
              <Button
                leftIcon={<FiEdit />}
                variant="outline"
                onClick={handleEditToggle}
                size="sm"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </HStack>

            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={6} divider={<Divider />}>
                <FormControl isInvalid={errors.name}>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    {...register('name', {
                      required: 'Name is required',
                    })}
                    readOnly={!isEditing}
                    bg={isEditing ? 'white' : 'gray.50'}
                  />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    readOnly={true}
                    bg="gray.50"
                  />
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.phone}>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    {...register('phone')}
                    readOnly={!isEditing}
                    bg={isEditing ? 'white' : 'gray.50'}
                  />
                  <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.bio}>
                  <FormLabel>Bio</FormLabel>
                  <Textarea
                    {...register('bio')}
                    readOnly={!isEditing}
                    bg={isEditing ? 'white' : 'gray.50'}
                    rows={6}
                  />
                  <FormErrorMessage>{errors.bio?.message}</FormErrorMessage>
                </FormControl>

                {user?.role === 'freelancer' && (
                  <FormControl isInvalid={errors.skills}>
                    <FormLabel>Skills (comma separated)</FormLabel>
                    <Input
                      {...register('skills')}
                      readOnly={!isEditing}
                      bg={isEditing ? 'white' : 'gray.50'}
                    />
                    <FormErrorMessage>{errors.skills?.message}</FormErrorMessage>
                  </FormControl>
                )}

                {isEditing && (
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isLoading}
                    alignSelf="end"
                  >
                    Save Changes
                  </Button>
                )}
              </Stack>
            </Box>
          </CardBody>
        </Card>
      </Stack>
    </Box>
  );
}

export default ProfilePage; 