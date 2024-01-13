// services/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const getHotels = async () => {
    const response = await axios.get(`${API_BASE_URL}/hotel`);
    return response.data;
};

export const fetchHotelDetail = async (id: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/hotel/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteHotel = async (id: string) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/hotel/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createHotel = async (hotelData: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/hotel`, hotelData);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const updateHotel = async (id: string, hotelData: any) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/hotel/${id}`, hotelData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getHotelChains = async () => {
    const response = await axios.get(`${API_BASE_URL}/hotel_chain`);
    return response.data;
};

export const fetchChainDetail = async (id: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/hotel_chain/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const deleteChain = async (id: string) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/hotel_chain/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createChain = async (chainData: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/hotel_chain`, chainData);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const updateChain = async (id: string, chainData: any) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/hotel_chain/${id}`, chainData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
