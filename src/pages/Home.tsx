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
import { getHotels } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Hotel } from '../constants/interfaces';



const Home: React.FC = () => {
    const navigate = useNavigate();

    const { data: hotels, isLoading } = useQuery<Hotel[]>('hotels', getHotels);

    const [selectedChains, setSelectedChains] = useState<string[]>([]);
    const [groupByChain, setGroupByChain] = useState<boolean>(false);

    const filteredHotels = hotels?.filter((hotel: Hotel) => {
        if (selectedChains.length === 0) return true;
        console.log(selectedChains.length);

        return hotel.chain && selectedChains.includes(hotel?.chain?.name);
    });


    const groupedHotels: Record<string, Hotel[]> | undefined = groupByChain
        ? hotels?.reduce((acc: Record<string, Hotel[]>, hotel: Hotel) => {
            const chainName = hotel.chain?.name || 'Unknown'; // Provide a default value if chain is undefined
            acc[chainName] = [...(acc[chainName] || []), hotel];
            return acc;
        }, {} as Record<string, Hotel[]>)
        : undefined;


    return (
        <Box p={4}>
            <HStack spacing={4} align="flex-start" pb={8}>
                <Input
                    placeholder="Search by chain. Press Esc to cancel"
                    onChange={(e) => setSelectedChains(e.target.value.split(','))}
                    onKeyDown={(e) => e.key === 'Escape' ? setSelectedChains([]) : {}}
                />
                <Select
                    placeholder="Group by chain"
                    onChange={(e) => setGroupByChain(Boolean(e.target.value))}
                >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </Select>
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
                    {groupByChain
                        ? Object.entries(groupedHotels || {}).map(
                            ([chain, hotels]: [string, Hotel[]]) => (
                                <GridItem key={chain} colSpan={3}>
                                    <Heading size="lg">{chain}</Heading>
                                    {hotels.map((hotel) => (
                                        <HotelCard
                                            key={hotel.id}
                                            hotel={hotel}
                                            onClick={() => handleHotelClick(hotel.id)}
                                        />
                                    ))}
                                </GridItem>
                            )
                        )
                        : filteredHotels?.map((hotel) => (
                            <HotelCard
                                key={hotel.id}
                                hotel={hotel}
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
        navigate(`/hotel/${hotelId}`);
    }
};

export default Home;
