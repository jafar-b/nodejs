import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Button,
  Divider,
  Flex,
  Card,
  CardBody,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiClock, FiDollarSign, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function BidItem({ bid, isProjectOwner, onAcceptBid, isAccepted = false }) {
  const {
    id,
    freelancer,
    amount,
    deliveryTime,
    message,
    createdAt,
  } = bid;

  const cardBg = useColorModeValue(
    isAccepted ? 'green.50' : 'white',
    isAccepted ? 'green.900' : 'gray.700'
  );
  const borderColor = useColorModeValue(
    isAccepted ? 'green.200' : 'gray.200',
    isAccepted ? 'green.700' : 'gray.600'
  );

  return (
    <Card 
      borderWidth="1px" 
      borderColor={borderColor}
      bg={cardBg}
    >
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
            <HStack>
              <Avatar size="md" name={freelancer.name} src={freelancer.avatar} />
              <Box>
                <Text fontWeight="bold">{freelancer.name}</Text>
                <HStack>
                  <Icon as={FiStar} color="yellow.400" />
                  <Text fontSize="sm">{freelancer.rating} / 5</Text>
                </HStack>
              </Box>
            </HStack>
            
            <HStack spacing={4}>
              <Flex align="center" gap={1}>
                <Icon as={FiDollarSign} />
                <Text fontWeight="bold">${amount}</Text>
              </Flex>
              <Flex align="center" gap={1}>
                <Icon as={FiClock} />
                <Text>{deliveryTime}</Text>
              </Flex>
            </HStack>
          </Flex>
          
          <Divider />
          
          <Box>
            <Text fontSize="sm" mb={1} color="gray.500">
              Cover Letter:
            </Text>
            <Text>{message}</Text>
          </Box>
          
          <Flex 
            justify="space-between" 
            align="center" 
            pt={2}
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 3, sm: 0 }}
          >
            <Text fontSize="sm" color="gray.500">
              Submitted on {new Date(createdAt).toLocaleDateString()}
            </Text>
            
            {isProjectOwner && !isAccepted && (
              <HStack spacing={2}>
                <Button 
                  as={Link} 
                  to={`/freelancers/${freelancer.id}`}
                  variant="outline" 
                  colorScheme="blue" 
                  size="sm"
                >
                  View Profile
                </Button>
                <Button 
                  colorScheme="green" 
                  size="sm"
                  onClick={() => onAcceptBid(id)}
                >
                  Accept Bid
                </Button>
              </HStack>
            )}
            
            {isAccepted && (
              <Badge colorScheme="green" py={1} px={2}>
                Accepted
              </Badge>
            )}
          </Flex>
        </VStack>
      </CardBody>
    </Card>
  );
}

function BidList({ bids, isProjectOwner, onAcceptBid, acceptedBidId = null }) {
  // Sort bids by creation date (newest first)
  const sortedBids = [...bids].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <VStack spacing={6} align="stretch">
      {sortedBids.map((bid) => (
        <BidItem
          key={bid.id}
          bid={bid}
          isProjectOwner={isProjectOwner}
          onAcceptBid={onAcceptBid}
          isAccepted={bid.id === acceptedBidId}
        />
      ))}
    </VStack>
  );
}

export default BidList; 