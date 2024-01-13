import React from 'react';
import { Box, Text, Heading } from '@chakra-ui/react';
import { HotelCardProps } from '../constants/interfaces';


const HotelCard: React.FC<HotelCardProps> = ({ hotel, onClick }) => {
    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={4}
            onClick={onClick}
            cursor="pointer"
        >
            <Heading size="md">{hotel.name}</Heading>
            <Text>{hotel.city}, {hotel.country}</Text>
            <Text>{hotel.address}</Text>
            <Text>Chain: {hotel?.chain?.name}</Text>
        </Box>
    );
};

export default HotelCard;