import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './AddGroup.css';
import '../data/types';
import GroupManager from '../components/GroupManager';
import { download } from 'ionicons/icons';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Dialog } from '@capacitor/dialog';
import { useState } from 'react';
import { DefaultGroup } from '../data/samples';
import { parseCSV } from '../functions';

const AddGroup: React.FC = () => {
  const [group, setGroup] = useState(DefaultGroup);

  const pickFile = async () => {
    try {
      const result = await FilePicker.pickFiles({
        types: ['text/csv'],
        readData: true,
        
      });
  
      return result.files[0];
    } catch(error:any) {
      console.error('Error picking file:', error);
    }
  }

  const getContacts = (csv: string) => {
    const arr = parseCSV(csv);
    arr.splice(0, 1); // Remove the first row

    const contacts: Contact[] = [];

    arr.forEach(row => {
      if(row[1] === undefined || !/^\+?(\d| )*$/.test(row[1])) {
        return;
      }
      const c: Contact = {
        id: new Date().getTime() + Math.ceil(Math.random() * 10000),
        phone: row[1].trim().split(' ').join(''),
        fullname: row[0].trim() || "",
      }

      contacts.push(c);
    });

    return contacts;
  }

  const importContacts = async () => {
    const file = await pickFile();
    
    // Si un fichier a été chargé
    if(file === undefined) {
      await Dialog.alert( { message: "Aucun fichier n'a été sélectionné !"});
      return;
    }

    // Si il est du format CSV
    if(!(["text/csv", "text/comma-separated-values"].includes(file.mimeType) && file.data !== undefined)) {
      await Dialog.alert( { message: "Ce type de fichier n'est pas pris en compte !" } );
      return;
    }

    // Convertir les données en JSON
    const contacts = getContacts(atob(file.data as string));
    if(contacts.length === 0) {
      await Dialog.alert( { message: "Les données du fichier ne sont pas bien formatées !" } );
      return;
    }

    setGroup({ ...group, contacts });
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nouveau Groupe</IonTitle>
          <IonButton onClick={importContacts} size='large' slot='end' fill='clear'>
            <IonIcon icon={download}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Nouveau Groupe</IonTitle>
          </IonToolbar>
        </IonHeader>
        <GroupManager group={group}/>
      </IonContent>
    </IonPage>
  );
};

export default AddGroup;
