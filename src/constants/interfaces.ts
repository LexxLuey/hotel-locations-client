export interface CreateHotelForm {
    name: string;
    city: string;
    country: string;
    address: string;
    chain_id?: number | undefined;
    lat?: number | undefined; 
    lng?: number | undefined; 
}

export interface Hotel {
    id: number;
    name: string;
    city: string;
    country: string;
    address: string;
    lat?: number;
    lng?: number;
    chain_id?: number | null;
    chain?: {
        name: string;
    };
}

export interface HotelChain {
    id: number;
    name: string;
    hotels?: [Hotel]
}

export interface OnClickMapEventProps {
    event: MouseEvent;
    latLng: [number, number];
    pixel: [number, number];
}

export interface HotelDetailProps {
    id: number;
    name: string;
    city: string;
    country: string;
    address: string;
    lat?: number;
    lng?: number;
    chain: {
        name: string;
    };
}

export interface EditHotelForm {
    name: string;
    city: string;
    country: string;
    address: string;
    chain_id: number;
    lat?: number;
    lng?: number;
}

export interface HotelCardProps {
    hotel: {
        id: number;
        name: string;
        city: string;
        country: string;
        address: string;
        chain_id?: number | null;
        chain?: {
            name: string;
        };
    };
    onClick: () => void;
}

export interface HotelChainCardProps {
    hotelchain: {
        id: number;
        name: string;
        hotels?: [Hotel]
    };
    onClick: () => void;
}

export interface HotelChainDetails {
    id: number;
    name: string;
    hotels?: [Hotel];
}

export interface EditHotelChain {
    name: string;
}

export interface CreateHotelChain {
    name: string;
}