import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    Select,
    Spinner,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
import { fetchHotelDetail, getHotelChains, updateHotel } from '../services/api';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Map, Marker } from "pigeon-maps"
import { HotelChain, EditHotelForm, OnClickMapEventProps } from '../constants/interfaces';


const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    city: Yup.string().required('City is required'),
    country: Yup.string().required('Country is required'),
    address: Yup.string().required('Address is required'),
    chain_id: Yup.number().required('Hotel Chain is required'),
});


const HotelEdit: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const toast = useToast();
    const { data: hotelChains, isLoading } = useQuery<HotelChain[]>('hotel_chain', getHotelChains);
    const [mapMarkerPosition, setMapMarkerPosition] = useState<{ lat: number; lng: number }>({ lat: 50.879, lng: 4.6997 });

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<EditHotelForm>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {

        async function fetchHotelData() {
            if (id) {
                try {
                    const data = await fetchHotelDetail(id);
                    setValue('name', data.name);
                    setValue('city', data.city);
                    setValue('country', data.country);
                    setValue('address', data.address);
                    setValue('chain_id', data.chain_id);
                    setValue('lat', data.lat);
                    setValue('lng', data.lng);
                } catch (error) {
                    console.error('Error fetching hotel details:', error);
                }

            }
        }

        fetchHotelData();
    }, [id, setValue]);

    const onSubmit = async (data: EditHotelForm) => {
        try {
            // Ensure that id is defined before calling updateHotel
            if (id) {
                await updateHotel(id, data);
                await queryClient.invalidateQueries('hotels');
                toast({
                    title: 'Hotel updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                navigate(`/hotel/${id}`);
            } else {
                console.error('Hotel ID is undefined');
            }
        } catch (error) {
            console.error('Error updating hotel:', error);
            toast({
                title: 'Error updating hotel',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleMapClick = ({ latLng }: OnClickMapEventProps) => {
        setValue('lat', latLng[0]);
        setValue('lng', latLng[1]);
        setMapMarkerPosition({ lat: latLng[0], lng: latLng[1] });
    };


    if (isLoading || !id) {
        return (
            <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
            />
        );
    }

    return (
        <Box p={4}>
            <Heading>Edit Hotel</Heading>
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
                    {/* Assuming you have a list of hotel chains available */}
                    <Select
                        placeholder="Select a hotel chain"
                        {...register('chain_id')}
                    >
                        {/** Map through your list of hotel chains to generate options */}
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
                            <Map height={300} defaultCenter={[mapMarkerPosition.lat, mapMarkerPosition.lng]} defaultZoom={11} onClick={handleMapClick}>
                                <Marker
                                    width={50}
                                    anchor={[mapMarkerPosition.lat, mapMarkerPosition.lng]}
                                    onClick={() => console.log(mapMarkerPosition)}
                                />
                            </Map>
                        </Box>
                    </Box>

                <Button type="submit" mt={4} colorScheme="blue">
                    Update Hotel
                </Button>
            </form>
        </Box>
    );
};

export default HotelEdit;
