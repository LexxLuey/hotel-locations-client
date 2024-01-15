import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    Spinner,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { fetchHotelDetail, updateChain } from '../services/api';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { EditHotelChain } from '../constants/interfaces';


const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
});


const HotelChainEdit: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const toast = useToast();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<EditHotelChain>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {

        async function fetchHotelData() {
            if (id) {
                try {
                    const data = await fetchHotelDetail(id);
                    setValue('name', data.name);
                } catch (error) {
                    console.error('Error fetching hotel details:', error);
                }
            }
        }

        fetchHotelData();
    }, [id, setValue]);

    const onSubmit = async (data: EditHotelChain) => {
        try {
            // Ensure that id is defined before calling updateHotel
            if (id) {
                await updateChain(id, data);
                await queryClient.invalidateQueries('hotels-chain');
                toast({
                    title: 'Hotel Chain updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                navigate(`/chain/${id}`);
            } else {
                console.error('Hotel ID is undefined');
            }
        } catch (error) {
            console.error('Error updating hotel chain:', error);
            toast({
                title: 'Error updating hotel chain',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };


    if (!id) {
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
            <Heading>Edit Hotel Chain</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl mt={4}>
                    <FormLabel>Name</FormLabel>
                    <Input {...register('name')} />
                    <span>{errors.name?.message}</span>
                </FormControl>


                <Button type="submit" mt={4} colorScheme="blue">
                    Update Hotel
                </Button>
            </form>
        </Box>
    );
};

export default HotelChainEdit;
