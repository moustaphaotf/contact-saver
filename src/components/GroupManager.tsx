import { IonButton, IonButtons, IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, useIonRouter } from '@ionic/react';
import { addCircle, close, pencil, person, save, trash } from 'ionicons/icons';
import '../data/types';
import { DefaultContact } from '../data/samples';
import { useEffect, useState } from 'react';
import { DefaultGroup } from '../data/samples';
import Empty from './Empty';
import { saveGroup } from '../data';
import { Dialog } from '@capacitor/dialog';
import { Contacts } from '@capacitor-community/contacts';

interface ContainerProps {
  group?: Group
}

const GroupManager: React.FC<ContainerProps> = ({ group: _group = DefaultGroup }) => {
  const router = useIonRouter();
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

  const handleContactUpsert = async () => {
    // Get the timestamp as the ID
    const id = new Date().getTime();

    // Copy the contact state variable
    let _contact = contact;

    // Check if the contact already exists
    const _contacts = [...group.contacts];
    if(_contacts.some(c => c.phone == _contact.phone)) {
      // If so, drop
      setContact(DefaultContact);
      
      await await Dialog.alert({
        title: "Alerte doublons",
        message: "Ce contact est déjà ajouté!"
      });
      return;
    }


    _contact = {...contact};
    if(_contact.id === 0) {
      // It's a new contact, add it !
      _contact.id = id;
      _contacts.unshift(_contact);
    } else {
      // It's an update !
      const index = _contacts.findIndex(c => c.id === _contact.id);
      _contacts[index] = _contact;
    }

    
    // Update the group
    setGroup({ ...group, contacts: _contacts});

    // Clean up
    setContact(DefaultContact);
  }

  const handleSaveGroup = async () => {
    if(group.name === "") {
      // Abort the process if the name is not submitted
      await Dialog.alert({
        title: "Informations manquantes",
        message: "Saisissez le nom du groupe!"
      });
      return;
    }

    if(group.contacts.length === 0 && group.id === 0) {
      await Dialog.alert({
        title: "Informations manquantes",
        message: "Ajoutez au moins un groupe!"
      });
      return;
    }

    // Set the group to prevent multiple saves !
    const _group = { ...group, id: group.id === 0 ? new Date().getTime() : group.id };
    setGroup(_group);

    // Check for the permissions
    let status = await Contacts.checkPermissions()
    if(status.contacts !== 'granted') {
      await Dialog.alert({
        title: "Permissions requises",
        message: "Veuillez autoriser l'application à accéder aux contacts du téléphone !\n\nApps -> Batch Contact Saver -> Permissions"
      });
    } else {
      const res = await saveGroup(_group);

      if(!res) {
        Dialog.alert({
          title: "Erreur interne",
          message: "Une erreur est survenue lors de l'enregistrement!"
        });
      } else {
        setGroup(DefaultGroup);
        router.push('/groups');
      }
    }
  }

  const handleRemoveContact = async (contactId:number) => {

    const { value } = await Dialog.confirm({
      title: "Suppression de contact",
      message: "Voulez-vous supprimer le contact ?",
    });

    if(value) {
      setContact(DefaultContact);
      setGroup({ ...group, contacts: group.contacts.filter(c => c.id !== contactId)});
    }
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
                  label={contact.id === 0 ? 'Numéro': 'Nouveau numéro'} 
                  placeholder='611 000 000'>
                </IonInput>
                  <IonButtons slot='end'>
                    {contact.id !== 0 && <IonButton 
                      disabled={contact.phone === ""} 
                      fill='clear'
                      onClick={handleContactUpsert}
                    >
                      <IonIcon icon={ close }></IonIcon>
                    </IonButton>}
                    <IonButton 
                      color="primary"
                      disabled={contact.phone === ""} 
                      size='large' 
                      fill='clear'
                      onClick={handleContactUpsert}
                    >
                      <IonIcon icon={contact.id === 0 ? addCircle : pencil}></IonIcon>
                    </IonButton>
                  </IonButtons>
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
            {group.contacts.map(_contact => (
              <IonItem 
                button key={_contact.id}
                onClick={() => setContact(_contact)}
              >
                <IonIcon color="primary" slot="start" icon={person} size="large"></IonIcon>
                <IonLabel>{_contact.phone}</IonLabel>

                <IonButtons>
                  <IonButton 
                    fill='clear' 
                    color="secondary" 
                    size='default'
                    onClick={() => setContact(_contact)}
                  >
                    <IonIcon icon={contact.id !== 0 && _contact.id === contact.id ? close : pencil}></IonIcon>
                  </IonButton>
                  
                  <IonButton 
                    fill="clear" 
                    color="danger" 
                    size='default'
                    onClick={ () => handleRemoveContact(_contact.id) }
                  >
                    <IonIcon icon={trash}></IonIcon>
                  </IonButton>
                </IonButtons>
              </IonItem>
            ))}
          </IonList>}
        </div>

        {/* The save group button */}
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
