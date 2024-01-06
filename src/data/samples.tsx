import './types'

export const FakeGroups:Group[] = [
    {
        id: 1,
        name: "Mes amis de classe",
        contacts: [
            {
                id: 1,
                phone: "625126103"
            },
            {
                id: 2,
                phone: "628557075"
            }
        ]
    },
    {
        id: 2,
        name: "Formation Design",
        contacts: [
            {
                id: 1,
                phone: "613494730",
                fullname: "Moustapha",
            },
            {
                id: 2,
                phone: "657975945",
            }
        ]
    }
]

// Default values for a group
export const DefaultGroup: Group = {
    id: 0,
    name: "",
    contacts: []
}

// Default values for a contact
export const DefaultContact: Contact = {
    id: 0,
    phone: "",
    fullname: ""
}

// Default values for a modal
export const DefaultAlertInfos: AlertInfos = {
    message: "",
    isOpen: false,
    header: "",
    subHeader: "",
    buttons: ["OK"],
}