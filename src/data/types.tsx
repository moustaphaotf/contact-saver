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

interface AlertButton {
    text: string;
    role?: string;
    handler?: () => void;
  }

interface AlertInfos{
    isOpen: boolean;
    header: string;
    subHeader: string;
    message: string;
    buttons: string[] | AlertButton[]
}