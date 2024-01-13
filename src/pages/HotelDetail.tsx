import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Spinner, Flex, Stack, Button, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import { Map, Marker } from "pigeon-maps"
import { deleteHotel, fetchHotelDetail } from '../services/api';
import { HotelDetailProps } from '../constants/interfaces';

const HotelDetail: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef<HTMLButtonElement | null>(null);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [hotelDetail, setHotelDetail] = useState<HotelDetailProps | null>(null);
    const toast = useToast();

    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                if (id) {
                    const data = await fetchHotelDetail(id);
                    setHotelDetail(data);
                }
            } catch (error) {
                console.error('Error fetching hotel details:', error);
            }
        };

        fetchHotelData();
    }, [id]);

    const handleEditClick = () => {
        // Navigate to the edit hotel page with the hotel ID
        navigate(`/edit-hotel/${id}`);
    };

    const handleDeleteClick = async () => {
        try {
            if (id) {
                await deleteHotel(id);
                onClose();
                toast({
                    title: 'Hotel deleted successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                // Navigate to the edit hotel page with the hotel ID
                navigate(`/`);
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
                        <Text>{`City: ${hotelDetail.city}`}</Text>
                        <Text>{`Country: ${hotelDetail.country}`}</Text>
                        <Text>{`Address: ${hotelDetail.address}`}</Text>
                        <Text>{`Chain: ${hotelDetail?.chain && hotelDetail?.chain?.name ? hotelDetail?.chain?.name : 'None'}`}</Text>
                    </Box>

                    {hotelDetail.lat && hotelDetail.lng ? (
                        <Box width="100%" height="300px" textAlign="center">
                            <Map height={300} defaultCenter={[hotelDetail.lat, hotelDetail.lng]} defaultZoom={11} onClick={() => { console.log('map clicked') }}>
                                <Marker
                                    width={50}
                                    anchor={[hotelDetail.lat, hotelDetail.lng]}
                                    onClick={() => console.log(hotelDetail.address)}
                                />
                            </Map>
                        </Box>
                    ) : (
                        <Box width="100%" p={4} textAlign="center">
                            <Text>MAP CURRENTLY UNAVAILABLE</Text>
                        </Box>
                    )}

                    <Stack direction={['column', 'row']} spacing='24px' align="center" justify="center">
                        <Button onClick={handleEditClick} colorScheme="teal" variant="outline" mt={4}>
                            Edit Hotel
                        </Button>

                        <Button onClick={onOpen} colorScheme="red" variant="outline" mt={4}>
                            Delete Hotel
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
                            Delete Hotel
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

export default HotelDetail;
