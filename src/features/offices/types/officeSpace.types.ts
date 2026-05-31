export type OfficeSpace = {
    id: number;
    title: string;
    slug: string;
    price: number;
    duration: string;
    address: string; 
    about: string;
    location: string;
    rating: number;
    tags: string[];
    image: string;
    images: string[];
    features: string[];
    salesContacts: salesContact[];
    isFullyBooked: boolean;
    providerId?: number;
};

export type salesContact = {
    name: string;
    role: string;
    photo: string;
    email: string;
    phone: string;
};

export type Contact = {
    name: string;
    role: string;
    photo: string;
    email: string;
    phone: string;
}