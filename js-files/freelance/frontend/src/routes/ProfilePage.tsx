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
  Avatar,
  AvatarBadge,
  IconButton,
  Textarea,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FiEdit, FiCamera } from 'react-icons/fi';
import { useState, useRef, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '@/hooks/useAuth';
import apiService from '@/api/ApiConfig';


interface ProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bio: string;
  title: string;
  location: string;
  website: string;
  hourlyRate: number;
}

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
      bio: user?.profile?.bio || '',
      title: user?.profile?.title || '',
      location: user?.profile?.location || '',
      website: user?.profile?.website || '',
      hourlyRate: user?.profile?.hourlyRate || 0,
    },
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);
    try {
      
      // Refresh user data to get the new avatar URL
      const userResponse = await apiService.users.getProfile();
      // Update user in context
      if (userResponse.data) {
        updateUser(userResponse.data);
      }
      
      toast({
        title: 'Profile picture updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Avatar upload error:', error);
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

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await apiService.users.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        bio: data.bio,
        title: data.title,
        location: data.location,
        website: data.website,
        hourlyRate: Number(data.hourlyRate),
      });
      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsEditing(false);
    } catch (error: any) {
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
          <Avatar
            size="2xl"
            name={`${user?.firstName} ${user?.lastName}`}
            src={user?.profile?.profileImage}
          >
            <AvatarBadge
              as={IconButton}
              size="sm"
              rounded="full"
              top="-10px"
              colorScheme="brand"
              aria-label="Change profile picture"
              icon={<FiCamera />}
              onClick={() => fileInputRef.current?.click()}
            />
          </Avatar>
          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </VStack>

        <Card flex={1}>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <HStack w="full" spacing={4}>
                  <FormControl isInvalid={!!errors.firstName}>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      {...register('firstName', { required: 'First name is required' })}
                      isDisabled={!isEditing}
                    />
                    <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.lastName}>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      {...register('lastName', { required: 'Last name is required' })}
                      isDisabled={!isEditing}
                    />
                    <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
                  </FormControl>
                </HStack>

                <FormControl isInvalid={!!errors.phoneNumber}>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    {...register('phoneNumber')}
                    isDisabled={!isEditing}
                  />
                  <FormErrorMessage>{errors.phoneNumber?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.title}>
                  <FormLabel>Title</FormLabel>
                  <Input
                    {...register('title')}
                    isDisabled={!isEditing}
                  />
                  <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.bio}>
                  <FormLabel>Bio</FormLabel>
                  <Textarea
                    {...register('bio')}
                    isDisabled={!isEditing}
                    rows={4}
                  />
                  <FormErrorMessage>{errors.bio?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.location}>
                  <FormLabel>Location</FormLabel>
                  <Input
                    {...register('location')}
                    isDisabled={!isEditing}
                  />
                  <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.website}>
                  <FormLabel>Website</FormLabel>
                  <Input
                    {...register('website')}
                    isDisabled={!isEditing}
                  />
                  <FormErrorMessage>{errors.website?.message}</FormErrorMessage>
                </FormControl>

                {user?.role === 'freelancer' && (
                  <FormControl isInvalid={!!errors.hourlyRate}>
                    <FormLabel>Hourly Rate ($)</FormLabel>
                    <Input
                      type="number"
                      {...register('hourlyRate', { valueAsNumber: true })}
                      isDisabled={!isEditing}
                    />
                    <FormErrorMessage>{errors.hourlyRate?.message}</FormErrorMessage>
                  </FormControl>
                )}

                <HStack w="full" justify="flex-end" pt={4}>
                  {isEditing ? (
                    <>
                      <Button
                        variant="ghost"
                        onClick={handleEditToggle}
                        isDisabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        colorScheme="brand"
                        isLoading={isLoading}
                      >
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button
                      leftIcon={<FiEdit />}
                      onClick={handleEditToggle}
                    >
                      Edit Profile
                    </Button>
                  )}
                </HStack>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </Stack>
    </Box>
  );
}

export default ProfilePage; 