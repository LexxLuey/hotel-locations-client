// pages/Home.tsx
import React, { useState } from 'react';
import {
    Box,
    Grid,
    GridItem,
    Input,
    Select,
    Heading,
    HStack,
    Spinner,
    Flex,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import HotelCard from '../components/HotelCard';
import { getHotelChains, getHotels } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { HotelChain } from '../constants/interfaces';
import HotelChainCard from '../components/HotelChainCard';



const HomeChain: React.FC = () => {
    const navigate = useNavigate();

    const { data: hotels, isLoading } = useQuery<HotelChain[]>('hotels', getHotelChains);

    const [selectedChains, setSelectedChains] = useState<string[]>([]);

    const filteredHotels = hotels?.filter((hotel: HotelChain) => {
        if (selectedChains.length === 0) return true;
        console.log(selectedChains.length);

        return hotel.name && selectedChains.includes(hotel?.name);
    });


    return (
        <Box p={4}>
            <HStack spacing={4} align="flex-start" pb={8}>
                <Input
                    placeholder="Search by chain. Press Esc to cancel"
                    onChange={(e) => setSelectedChains(e.target.value.split(','))}
                    onKeyDown={(e) => e.key === 'Escape' ? setSelectedChains([]) : {}}
                />
            </HStack>

            {isLoading ? (
                <Flex
                    align="center"
                    justify="center"
                    height="40vh" // Use the full height of the viewport
                >
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
                </Flex>
            ) : (
                <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={4}>
                    {filteredHotels?.map((hotel) => (
                        <HotelChainCard
                            key={hotel.id}
                            hotelchain={hotel}
                            onClick={() => handleHotelClick(hotel.id)}
                        />
                    ))}
                </Grid>
            )}
        </Box>
    );

    function handleHotelClick(hotelId: number) {
        // Implement navigation to hotel detail page
        console.log(`Clicked on hotel with ID ${hotelId}`);

        // Navigate to the individual hotel page
        navigate(`/chain/${hotelId}`);
    }
};

export default HomeChain;
