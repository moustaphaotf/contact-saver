import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './AddGroup.css';
import '../data/types';
import GroupManager from '../components/GroupManager';

const AddGroup: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nouveau Lot</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Nouveau Lot</IonTitle>
          </IonToolbar>
        </IonHeader>

        <GroupManager />
      </IonContent>
    </IonPage>
  );
};

export default AddGroup;
