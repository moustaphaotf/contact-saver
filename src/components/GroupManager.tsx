import { IonButton, IonButtons, IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, useIonRouter, IonCard, IonCardHeader,IonCardSubtitle, useIonLoading, useIonViewDidEnter } from '@ionic/react';
import { addCircle, close, pencil, person, save, trash, reload} from 'ionicons/icons';
import '../data/types';
import { DefaultContact } from '../data/samples';
import { useEffect, useState, useRef } from 'react';
import { DefaultGroup } from '../data/samples';
import Empty from './Empty';
import { ContactsAPI, saveGroup } from '../data';
import { Dialog } from '@capacitor/dialog';
import { Contacts } from '@capacitor-community/contacts';
import { Toast } from '@capacitor/toast';

interface ContainerProps {
  group?: Group
}

const GroupManager: React.FC<ContainerProps> = ({ group: _group = DefaultGroup }) => {
  const router = useIonRouter();
  const [group, setGroup] = useState<Group>(DefaultGroup);
  const [contact, setContact] = useState<Contact>(DefaultContact);
  
  // To present the loading activity component
  const [present, dismiss] = useIonLoading();

  // To hold telInput field
  const telInput = useRef<HTMLIonInputElement>(null);
  
  useIonViewDidEnter(() => {
    telInput.current?.setFocus();
  });

  useEffect(() => {
      setGroup(_group);
  }, [_group]);

  const handleContactUpsert = async () => {
    // Get the timestamp as the ID
    const id = new Date().getTime();

    // Copy the contact state variable
    let _contact = contact;

    // Check if the contact already exists
    const _contacts = [...group.contacts];
    if(contact.id === DefaultContact.id && _contacts.some(c => c.phone == _contact.phone)) {
      // If so, drop
      setContact(DefaultContact);
      
      await await Dialog.alert({
        title: "Alerte doublons",
        message: "Ce contact est déjà ajouté!"
      });
      return;
    }


    _contact = {...contact};
    if(_contact.id === DefaultContact.id) {
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

  const isDataValid = async () => {
    if(group.name === "") {
      // Abort the process if the name is not submitted
      await Dialog.alert({
        title: "Informations manquantes",
        message: "Saisissez le nom du groupe!"
      });
      return false;
    }

    if(group.contacts.length === 0 && group.id === DefaultGroup.id) {
      await Dialog.alert({
        title: "Informations manquantes",
        message: "Ajoutez au moins un contact!"
      });
      return false;
    }

    return true;
  }

  const handleSaveGroup = async () => {
    if(!(await isDataValid())) {
      return;
    }

    // Set the group to prevent multiple saves !
    const _group = { ...group, id: group.id === DefaultGroup.id ? new Date().getTime() : group.id };
    setGroup(_group);

    try {
      // Check for the permissions
      let permission = await Contacts.checkPermissions();
      
      if(permission.contacts !== "granted") {
        await Dialog.alert({
          title: "Permissions requises",
          message: "Veuillez autoriser l'application à accéder aux contacts du téléphone !\n\nApps -> Contact Saver -> Permissions"
        });
    
        return;
      }

      // Show a loader
      present( {
        message: 'Enregistrement en cours ...',
      } );

      // Save the group first to the system
      // That way the contacts will get updated with their _id if they get saved
      const { count, status } = await ContactsAPI.save(group);
      const total = _group.contacts.length;
      const suffix = total > 1 ? 's' : '';
      const message = `${count} contact${suffix} enregistré${suffix} sur ${total}`;

      if(status) {
        await Toast.show({ text: message, position: 'bottom', duration: 'long' });
      } else {
        await Toast.show({text: "Erreur d'enregistrement !", position: 'bottom', duration: 'long'});
      }

    } catch(error: any) {
      console.error(error.message);
    } finally {
      saveGroup(_group);
      setContact(DefaultContact);
      router.push('/groups');
      dismiss();
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
          <IonCard style={ { marginTop: "1rem" } }>
            {/* The group name */}
            <IonItem>
              <IonInput 
                value={group.name}
                onIonInput={event => setGroup({ ...group, name: event.target.value as string})}
                autofocus={true} 
                type='text' 
                labelPlacement="stacked" 
                label='Nom du groupe' 
                placeholder='Dev 2.0'
              ></IonInput>
            </IonItem>
          </IonCard>

          <IonCard  style={ { marginTop: "1rem" } }>
            <IonCardHeader>
            <IonCardSubtitle>Informations du Contact</IonCardSubtitle>
            </IonCardHeader>
            {/* Form to add contacts to the list*/}
            <IonItem>
              <IonInput 
                onIonInput={event => setContact({ ...contact, phone: event.target.value as string})} 
                value={contact.phone} 
                type='tel' 
                ref={telInput}
                labelPlacement="stacked" 
                label={contact.id === DefaultContact.id ? 'Numéro': 'Nouveau numéro'} 
                placeholder='611 000 000'>
              </IonInput>
            </IonItem>

            <IonItem>
              <IonInput 
                onIonInput={event => setContact({ ...contact, fullname: event.target.value as string})} 
                value={contact.fullname} 
                labelPlacement="stacked" 
                label={contact.id === DefaultContact.id ? 'Nom complet': 'Nouveau nom'} 
                placeholder='Mamadou Diallo'>
              </IonInput>
            </IonItem>
            <IonItem>
              <IonButtons slot='end'>
                {contact.id !== 0 && <IonButton 
                  disabled={contact.phone === ""} 
                  fill='clear'
                  onClick={() => setContact(DefaultContact)}
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
                  <IonIcon icon={contact.id === DefaultContact.id ? addCircle : pencil}></IonIcon>
                </IonButton>
              </IonButtons>
            </IonItem>

          </IonCard>

          {/* Show an Empty component when there is no contact in the list ! */}
          {group.contacts.length === 0 && <Empty message='Ajoutez des contacts !' />}
          
          {/* List of the contacts added  */}
          {group.contacts.length > 0 && <IonList inset={true}>
            <IonListHeader lines={"full"} style={{ marginBottom: "1rem"}}>
              <IonLabel>Contacts ajoutés</IonLabel>
              <IonButtons>
                <IonButton 
                  onClick={async() => {
                    const { value } = await Dialog.confirm({
                      message: "Voulez-vous annuler les changements ?",
                      title: "Annuler les modifications"
                    });

                    if(value) {
                      // If the group was imported set DefaultGroup otherwise set _group
                      setGroup(group.id === DefaultGroup.id ? DefaultGroup : _group);
                      setContact(DefaultContact);
                    }
                  }} 
                  color={'success'} 
                  size={'large'}
                >  
                  <IonIcon icon={reload}></IonIcon>
                </IonButton>
              </IonButtons>
            </IonListHeader>
            {group.contacts.map(_contact => (
              <IonItem 
                button key={_contact.id}
                onClick={() => {
                  telInput.current?.setFocus();
                  setContact(_contact);
                }}
              >
                <IonIcon color="primary" slot="start" icon={person} size="large"></IonIcon>
                <IonLabel>
                  <p>{_contact.phone}</p>
                  <p>{ _contact.fullname === "" ? "N/A" : _contact.fullname}</p>
                </IonLabel>
                <IonButtons>
                  <IonButton 
                    fill='clear' 
                    color="secondary" 
                    size='default'
                    onClick={(event) => {
                      event.stopPropagation();
                      if(contact.id !== 0 && contact.id === _contact.id) {
                        setContact(DefaultContact);
                      }
                      else {
                        setContact(_contact);
                        telInput.current?.setFocus();
                      }
                    }}
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
            <IonItem></IonItem>
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
