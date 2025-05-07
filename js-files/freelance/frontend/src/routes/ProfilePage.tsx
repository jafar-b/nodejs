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
  Spinner,
  Text,
} from '@chakra-ui/react';
import { FiEdit, FiCamera } from 'react-icons/fi';
import { useState, useRef, ChangeEvent, useEffect } from 'react';
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
  const [profileData, setProfileData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  
  // Fetch the full profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.users.getProfile();
        console.log('Profile data fetched:', response.data);
        
        // Check for the profile image URL in various possible locations
        const profileImageUrl = response.data?.profileImage || 
                               response.data?.profile?.profileImage || 
                               response.data?.avatar || 
                               response.data?.avatarUrl ||
                               response.data?.profile?.avatar;
        
        console.log('Profile image URL found:', profileImageUrl || 'No image URL found');
        
        // If we have a relative URL, make it absolute with the API base URL
        if (profileImageUrl && profileImageUrl.startsWith('/')) {
          const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
          const fullImageUrl = `${baseUrl}${profileImageUrl}`;
          console.log('Converted to full URL:', fullImageUrl);
          
          // Create a modified response data with the full URL
          const modifiedData = {
            ...response.data,
            profileImage: fullImageUrl,
          };
          
          // Update local state with the modified data
          setProfileData(modifiedData);
          
          // Also update the user context
          updateUser(modifiedData);
        } else {
          // Update local state with the fetched profile data
          setProfileData(response.data);
          
          // Also update the user context
          updateUser(response.data);
        }
      } catch (error: any) {
        console.error('Error fetching profile data:', error);
        toast({
          title: 'Failed to load profile data',
          description: error.response?.data?.message || 'An error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [updateUser, toast]);

  const {
    handleSubmit,
    register,
    reset,
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
  
  // Update form values when profileData changes
  useEffect(() => {
    if (profileData) {
      reset({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        phoneNumber: profileData.phoneNumber || '',
        bio: profileData.profile?.bio || '',
        title: profileData.profile?.title || '', 
        location: profileData.profile?.location || '',
        website: profileData.profile?.website || '',
        hourlyRate: profileData.profile?.hourlyRate || 0,
      });
    }
  }, [profileData, reset]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use the original file directly
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('Uploading file:', file.name, 'Type:', file.type);

    setIsLoading(true);
    try {
      // Upload the avatar image
      const uploadResponse = await apiService.users.uploadAvatar(formData);
      console.log('Upload response:', uploadResponse.data);
      
      // Check for the image URL in the upload response
      let directImageUrl = uploadResponse.data?.profileImage || 
                          uploadResponse.data?.avatarUrl || 
                          uploadResponse.data?.imageUrl;
                          
      if (directImageUrl) {
        console.log('Direct image URL from upload:', directImageUrl);
        
        // If we have a relative URL, make it absolute
        if (directImageUrl.startsWith('/')) {
          const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
          directImageUrl = `${baseUrl}${directImageUrl}`;
          console.log('Converted to full URL:', directImageUrl);
        }
        
        // Create modified data with the new image URL
        const updatedData = {
          ...profileData,
          profileImage: directImageUrl
        };
        
        // Update the state and context
        setProfileData(updatedData);
        updateUser(updatedData);
      } else {
        // Small delay to ensure the server has processed the image
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Refresh user data to get the new avatar URL
        const userResponse = await apiService.users.getProfile();
        console.log('User data after upload:', userResponse.data);
        
        // Check for the image URL in the profile response
        const profileImageUrl = userResponse.data?.profileImage || 
                              userResponse.data?.profile?.profileImage || 
                              userResponse.data?.avatar || 
                              userResponse.data?.avatarUrl ||
                              userResponse.data?.profile?.avatar;
                              
        if (profileImageUrl && profileImageUrl.startsWith('/')) {
          const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
          const fullImageUrl = `${baseUrl}${profileImageUrl}`;
          console.log('Converted profile URL to full URL:', fullImageUrl);
          
          const modifiedData = {
            ...userResponse.data,
            profileImage: fullImageUrl,
          };
          
          updateUser(modifiedData);
          setProfileData(modifiedData);
        } else {
          // Update user in context
          updateUser(userResponse.data);
          setProfileData(userResponse.data);
        }
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
      // Send updated profile data
      const response = await apiService.users.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        bio: data.bio,
        title: data.title,
        location: data.location,
        website: data.website,
        hourlyRate: Number(data.hourlyRate),
      });
      
      // Update local state with the returned data
      setProfileData(response.data);
      
      // Also update the user context
      updateUser(response.data);
      
      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsEditing(false);
    } catch (error: any) {
      console.error('Profile update error:', error);
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
      
      {isLoading && (
        <Box textAlign="center" py={10}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="brand.500"
            size="xl"
          />
          <Text mt={4}>Loading profile data...</Text>
        </Box>
      )}

      {!isLoading && (
        <Stack spacing={8} direction={{ base: 'column', lg: 'row' }}>
          <VStack
            spacing={6}
            align="center"
            minW={{ base: 'full', lg: '300px' }}
          >
            <Avatar
              size="2xl"
              name={`${profileData?.firstName || user?.firstName} ${profileData?.lastName || user?.lastName}`}
              src={profileData?.profileImage || profileData?.profile?.profileImage || profileData?.avatar || user?.profileImage || user?.profile?.profileImage || user?.avatar}
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

                  {user?.role === 'FREELANCER' && (
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
                          colorScheme="blue"
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
      )}
    </Box>
  );
}

export default ProfilePage;
