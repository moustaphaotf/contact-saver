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