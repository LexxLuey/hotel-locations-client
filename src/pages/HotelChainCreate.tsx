import React from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { createChain } from '../services/api';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { CreateHotelChain, HotelChainDetails } from '../constants/interfaces';
import { useNavigate } from 'react-router-dom';

// Define validation schema using Yup
const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
});


const HotelChainCreate: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<CreateHotelChain>({
        resolver: yupResolver(schema),
    });
    const queryClient = useQueryClient();
    const toast = useToast();
    const navigate = useNavigate();


    const onSubmit = async (data: CreateHotelChain) => {
        try {
            // Call the API to create a hotel
            const chain: HotelChainDetails = await createChain(data);

            // Invalidate and refetch the hotels query to update the list
            await queryClient.invalidateQueries('hotel-chain');

            setValue('name', '');

            // Show success toast
            toast({
                title: 'Hotel chain created successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            navigate(`/chain/${chain.id}`);
        } catch (error) {
            // Handle error and show error toast
            console.error('Error creating hotel chain:', error);
            toast({
                title: 'Error creating hotel chain',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <>
            <Box p={4}>
                <Heading>Create Hotel Chain</Heading>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl mt={4}>
                        <FormLabel>Name</FormLabel>
                        <Input {...register('name')} />
                        <span>{errors.name?.message}</span>
                    </FormControl>

                    <Button type="submit" mt={4} colorScheme="blue">
                        Create Chain
                    </Button>
                </form>
            </Box>
        </>

    );
};

export default HotelChainCreate;
