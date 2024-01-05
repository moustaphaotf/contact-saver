import { IonButton, IonButtons, IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader } from '@ionic/react';
import { addCircle, pencil, person, save, trash } from 'ionicons/icons';
import '../data/types';
import { DefaultContact } from '../data/samples';
import { useEffect, useState } from 'react';
import { DefaultGroup } from '../data/samples';
import Empty from './Empty';
import { saveGroup, saveGroups } from '../data';
import { useHistory } from 'react-router';

interface ContainerProps {
  group: Group
}

const GroupManager: React.FC<ContainerProps> = ({ group: _group = DefaultGroup }) => {
  const history = useHistory();
  const [group, setGroup] = useState<Group>(DefaultGroup);
  const [isNew, setIsNew] = useState(false);
  const [contact, setContact] = useState<Contact>(DefaultContact);

  useEffect(() => {
    // Load group infos from props when it's in update mode
    const _isNew = _group === undefined;
    setIsNew(_isNew);
    if(!isNew) {
      setGroup(_group);
    }

  }, [_group]);

  const handleAddContact = () => {
    // Get the timestamp as the ID
    const id = new Date().getTime();

    // Copy the contact state variable
    let _contact = contact;

    // Check if the contact already exists
    const _contacts = [...group.contacts];
    if(_contacts.some(c => c.phone == _contact.phone)) {
      // If so, drop
      setContact(DefaultContact);
      return;
    }


    // Set the ID
    _contact = {...contact, id};

    // New group contacts
    _contacts.unshift(_contact);
    
    // Update the group
    setGroup({ ...group, contacts: _contacts});

    // Clean up
    setContact(DefaultContact);
  }

  const handleSaveGroup = async () => {
    await saveGroup(group);
    history.replace('/groups');
  }

  return (
    <>
        <div>
          <IonList inset={true}>
            {/* The group name */}
            <IonItem>
              <IonInput 
                value={group.name}
                onIonInput={event => setGroup({ ...group, name: event.target.value as string})}
                autofocus={true} 
                type='text' 
                labelPlacement="stacked" 
                label='Nom du groupe' 
                placeholder='mes amis de classe'
              ></IonInput>
            </IonItem>
          </IonList>

          <IonList inset={true}>
            {/* Form to add contacts to the list*/}
            <IonItem>
                <IonInput 
                  onIonInput={event => setContact({ ...contact, phone: event.target.value as string})} 
                  value={contact.phone} 
                  type='tel' 
                  labelPlacement="stacked" 
                  label='Numéro à ajouter' 
                  placeholder='611 000 000'>
                </IonInput>
                  <IonButton 
                    disabled={contact.phone === ""} 
                    size='large' 
                    slot='end' 
                    fill='clear'
                    onClick={handleAddContact}
                  >
                    <IonIcon icon={addCircle}></IonIcon>
                  </IonButton>
            </IonItem>

          </IonList>

          {/* Show an Empty component when there is no contact in the list ! */}
          {group.contacts.length === 0 && <Empty message='Ajoutez des contacts !' />}
          
          {/* List of the contacts added  */}
          {group.contacts.length > 0 && <IonList inset={true}>
            <IonListHeader>
              <IonLabel>Contacts ajoutés</IonLabel>
              <IonButton size='small'>
                <IonLabel>Supprimer tout</IonLabel>
              </IonButton>
            </IonListHeader>
            {group.contacts.map(contact => (
              <IonItem key={contact.id}>
                <IonIcon color="primary" slot="start" icon={person} size="large"></IonIcon>
                <IonLabel>{contact.phone}</IonLabel>

                <IonButtons>
                  <IonButton fill='clear' color="secondary" size='default'>
                    <IonIcon icon={pencil}></IonIcon>
                  </IonButton>
                  
                  <IonButton fill="clear" color="danger" size='default'>
                    <IonIcon icon={trash}></IonIcon>
                  </IonButton>
                </IonButtons>
              </IonItem>
            ))}
          </IonList>}
        </div>

        <IonFab 
          slot="fixed" 
          vertical="bottom" 
          horizontal="end"
          onClick={handleSaveGroup}
        >
          <IonFabButton>
            <IonIcon icon={save}></IonIcon>
          </IonFabButton>
        </IonFab>
    </>
  );
};

export default GroupManager;
