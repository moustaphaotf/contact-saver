interface Contact{
    id: number;
    phone: string;
    fullname?: string;
}

interface Group{
    id: number;
    name: string;
    contacts: Contact[];
}