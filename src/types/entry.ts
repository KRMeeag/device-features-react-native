export interface Address {
    name: string;
    city: string;
    region: string;
    country: string;
}

export interface TravelEntry extends Address {
    id: string;
    photo: string;
    date: string;
}