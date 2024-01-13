import React from 'react';
import { Box, Text, Heading } from '@chakra-ui/react';
import { HotelCardProps, HotelChainCardProps } from '../constants/interfaces';


const HotelChainCard: React.FC<HotelChainCardProps> = ({ hotelchain, onClick }) => {
    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={4}
            onClick={onClick}
            cursor="pointer"
        >
            <Heading size="md">{hotelchain.name}</Heading>
            <Text>{hotelchain?.hotels?.length} Hotels</Text>
        </Box>
    );
};

export default HotelChainCard;