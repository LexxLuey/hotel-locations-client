import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Spinner, Flex, Stack, Button, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, useDisclosure, useToast, Grid } from '@chakra-ui/react';
import { Map, Marker } from "pigeon-maps"
import { deleteChain, deleteHotel, fetchChainDetail, fetchHotelDetail } from '../services/api';
import { HotelChainDetails, HotelDetailProps } from '../constants/interfaces';
import HotelCard from '../components/HotelCard';

const HotelChainDetail: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef<HTMLButtonElement | null>(null);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [hotelDetail, setHotelDetail] = useState<HotelChainDetails | null>(null);
    const toast = useToast();

    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                if (id) {
                    const data = await fetchChainDetail(id);
                    setHotelDetail(data);
                }
            } catch (error) {
                console.error('Error fetching hotel details:', error);
            }
        };

        fetchHotelData();
    }, [id]);

    function handleHotelClick(hotelId: number) {
        // Implement navigation to hotel detail page
        console.log(`Clicked on hotel with ID ${hotelId}`);

        // Navigate to the individual hotel page
        navigate(`/hotel/${hotelId}`);
    }

    const handleEditClick = () => {
        // Navigate to the edit hotel page with the hotel ID
        navigate(`/edit-chain/${id}`);
    };

    const handleDeleteClick = async () => {
        try {
            if (id) {
                await deleteChain(id);
                onClose();
                toast({
                    title: 'Hotel deleted successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                // Navigate to the edit hotel page with the hotel ID
                navigate(`/chain`);
            }
        } catch (error) {
            console.error('Error deleting hotel details:', error);
            toast({
                title: 'Error deleting hotel',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }

    };

    if (!hotelDetail) {
        return (
            <Flex
                align="center"
                justify="center"
                height="70vh"
            >
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />
            </Flex>
        );
    }

    return (
        <>
            <Flex
                align="center"
                justify="center"
                height="90vh"
            >
                <Stack direction={['column']} spacing='24px' width="90%">
                    <Box p={4} textAlign="center">
                        <Heading>{hotelDetail.name}</Heading>
                        {hotelDetail?.hotels && hotelDetail.hotels.length > 0 ? (
                            <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={4}>
                                {hotelDetail?.hotels?.map((hotel) => (
                                    <HotelCard
                                        key={hotel.id}
                                        hotel={hotel}
                                        onClick={() => handleHotelClick(hotel.id)}
                                    />
                                ))}
                            </Grid>
                        ) : (
                            <Box width="100%" p={4} textAlign="center">
                                <Text>HOTELS CURRENTLY UNAVAILABLE</Text>
                            </Box>
                        )}

                    </Box>



                    <Stack direction={['column', 'row']} spacing='24px' align="center" justify="center">
                        <Button onClick={handleEditClick} colorScheme="teal" variant="outline" mt={4}>
                            Edit Chain
                        </Button>

                        <Button onClick={onOpen} colorScheme="red" variant="outline" mt={4}>
                            Delete Chain
                        </Button>

                    </Stack>
                </Stack>
            </Flex>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete Hotel Chain
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={handleDeleteClick} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>


    );
};

export default HotelChainDetail;
