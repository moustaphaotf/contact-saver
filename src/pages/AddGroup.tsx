import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './AddGroup.css';
import '../data/types';
import GroupManager from '../components/GroupManager';
import { download } from 'ionicons/icons';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Dialog } from '@capacitor/dialog';

const AddGroup: React.FC = () => {
  const pickFile = async () => {
    try {
      const result = await FilePicker.pickFiles({
        types: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        readData: true,
      });
  
      return result.files[0];
    } catch(error:any) {
      console.error('Error picking file:', error);
      Dialog.alert( { message: "Erreur de lors de l'accès au fichier."})
    }
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nouveau Groupe</IonTitle>
          <IonButton onClick={pickFile} size='large' slot='end' fill='clear'>
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
        <GroupManager />
      </IonContent>
    </IonPage>
  );
};

export default AddGroup;
