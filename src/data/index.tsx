import { Preferences } from "@capacitor/preferences";
import './types'

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
            return groups.find(group => group.id === id);
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

    // Then save !
    await saveGroups(groups);
}
