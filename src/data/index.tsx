import { Preferences } from "@capacitor/preferences";
import './types'
import { Contacts, NameInput, PhoneType } from "@capacitor-community/contacts";

const GROUP_KEY = "BCS_SAVED_GROUPS"

export async function getGroups(): Promise<Group[]> {
    try {
        const { value: _groupsBase64 } = await Preferences.get({ key: GROUP_KEY});
        if(_groupsBase64 === null) {
            return [];
        } else {
            const json = atob(_groupsBase64);
            const groups:Group[] = JSON.parse(json);

            return groups;
        }
    } catch (error:any) {
        console.error(error.message);
        return [];
    }
}

export async function getGroup(id: number) : Promise<Group | undefined> {
    try {
        const { value: _groupsBase64 } = await Preferences.get({ key: GROUP_KEY});
        if(_groupsBase64 === null) {
            return undefined;
        } else {
            const json = atob(_groupsBase64);
            const groups:Group[] = JSON.parse(json);
            const group = groups.find(group => group.id === id);
            
            group?.contacts.forEach(async (contact) => {
                try {
                    await Contacts.getContact({ contactId: contact._id as string, projection: { name: true }});
                } catch(error:any) {
                    console.error("Oh oh ... could not get this contact", contact)
                    console.error(error.message);
                    contact._id = undefined;
                }
            })
            return group;
        }
    } catch (error:any) {
        console.error(error.message);
        return undefined;
    }
}

export async function saveGroups(groups: Group[]) {
    Preferences.set({ key: GROUP_KEY, value: btoa(JSON.stringify(groups)) });
}

export async function saveGroup(group:Group){
    const groups = await getGroups();

    // If the group exist
    const index = groups.findIndex(_group => _group.id === group.id);
    if(index === -1) {
        // The group does not exist then add it !
        groups.unshift(group);
    } else {
        // The group exist, then update !
        const index = groups.findIndex(_group => group.id === _group.id);
        groups[index] = group;
    }

    // Then save to the local db !
    await saveGroups(groups);
}


export class ContactsAPI {
    // For permissions maybe ?
    static async save(group: Group) {
        let error = false; // Flag to check for a potential error !

        // Save the contats
        for(let contact of group.contacts) {
            // Before creating the contact, let's check if it may exist
            if(contact._id !== undefined) {
                try {     
                    // The contact may exist delete it first    
                    console.log("The contact", contact, "exists.\nDeleting...")
                    await Contacts.deleteContact({contactId: contact._id as string});
                } catch (error) {
                    console.error("Unable to delete contact !", contact);
                }
            }
    
            // Then create it (or recreate)
            try{
                const fullnameGiven = contact.fullname !== "";

                const res = await Contacts.createContact({
                    contact: {
                        name: {
                            given: fullnameGiven ? contact.fullname : group.name,
                            suffix: fullnameGiven ? group.name : "",
                        },
                        phones: [
                            {
                                type: PhoneType.Mobile,
                                label: "mobile",
                                number: contact.phone
                            }
                        ]
                    }
                });
    
                // Affect the contactId for future retrieval
                contact._id = res.contactId;
                console.log("Contact", contact, "saved with id", contact._id);
            } catch (err: any) {
                error = true;
                console.error("Unable to create the contact !", contact);
            }
        }

        return !error;
    }

    static remove(group: Group) {
        group.contacts.forEach(async (contact) => {
            try {
                await Contacts.deleteContact({ contactId: contact._id as string });
                console.log("Contact", contact, "has been deleted !");
            } catch(error:any) {
                console.error("Oh oh ... The user has deleted this contact by herself !", contact)
                contact._id = undefined;
            }
        })
    }
}