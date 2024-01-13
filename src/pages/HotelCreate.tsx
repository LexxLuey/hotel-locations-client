import React, { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, useToast, Select, Spinner } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
import { createHotel, getHotelChains } from '../services/api';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Map, Marker } from "pigeon-maps"
import { CreateHotelForm, Hotel, HotelChain, OnClickMapEventProps } from '../constants/interfaces';
import { useNavigate } from 'react-router-dom';

// Define validation schema using Yup
const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    city: Yup.string().required('City is required'),
    country: Yup.string().required('Country is required'),
    address: Yup.string().required('Address is required'),
});


const CreateHotel: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<CreateHotelForm>({
        resolver: yupResolver(schema),
    });
    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const toast = useToast();
    const { data: hotelChains, isLoading } = useQuery<HotelChain[]>('hotel_chain', getHotelChains);

    const [mapMarkerPosition, setMapMarkerPosition] = useState<{ lat: number; lng: number }>({ lat: 50.879, lng: 4.6997 });

    const handleMapClick = ({ latLng }: OnClickMapEventProps) => {
        setValue('lat', latLng[0]);
        setValue('lng', latLng[1]);
        setMapMarkerPosition({ lat: latLng[0], lng: latLng[1] });
    };

    const onSubmit = async (data: CreateHotelForm) => {
        try {
            // Call the API to create a hotel
            const response: Hotel = await createHotel(data);

            // Invalidate and refetch the hotels query to update the list
            await queryClient.invalidateQueries('hotels');

            setValue('name', '');
            setValue('city', '');
            setValue('country', '');
            setValue('address', '');
            setValue('chain_id', undefined);
            setValue('lat', undefined);
            setValue('lng', undefined);

            // Show success toast
            toast({
                title: 'Hotel created successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            navigate(`/hotel/${response.id}`);

        } catch (error) {
            // Handle error and show error toast
            console.error('Error creating hotel:', error);
            toast({
                title: 'Error creating hotel',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    if (isLoading) {
        return <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
        />
    }

    return (
        <>
            <Box p={4}>
                <Heading>Create Hotel</Heading>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl mt={4}>
                        <FormLabel>Name</FormLabel>
                        <Input {...register('name')} />
                        <span>{errors.name?.message}</span>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>City</FormLabel>
                        <Input {...register('city')} />
                        <span>{errors.city?.message}</span>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Country</FormLabel>
                        <Input {...register('country')} />
                        <span>{errors.country?.message}</span>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Address</FormLabel>
                        <Input {...register('address')} />
                        <span>{errors.address?.message}</span>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Hotel Chain</FormLabel>
                        <Select
                            placeholder="Select a hotel chain"
                            {...register('chain_id')}
                        >
                            {/* Map through your list of hotel chains to generate options */}
                            {hotelChains?.map((chain) => (
                                <option key={chain.id} value={chain.id}>
                                    {chain.name}
                                </option>
                            ))}
                        </Select>
                        <span>{errors.chain_id?.message}</span>
                    </FormControl>

                    <Box mt={4} height="100%">
                        <FormLabel>Location on Map</FormLabel>
                        <Box
                            width="100%"
                            height="400px" // Set a fixed height
                            position="relative"
                        >
                            <Map height={300} defaultCenter={[50.879, 4.6997]} defaultZoom={11} onClick={handleMapClick}>
                                <Marker
                                    width={50}
                                    anchor={[mapMarkerPosition.lat, mapMarkerPosition.lng]}
                                    onClick={() => console.log(mapMarkerPosition)}
                                />
                            </Map>
                        </Box>
                    </Box>

                    <Button type="submit" mt={4} colorScheme="blue">
                        Create Hotel
                    </Button>
                </form>
            </Box>
        </>

    );
};

export default CreateHotel;
