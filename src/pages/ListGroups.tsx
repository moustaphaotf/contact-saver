import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonNote, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './ListGroups.css';
import { pencil, people, trash } from 'ionicons/icons';
import '../data/types';
import groups from '../data/samples';
import { Link } from 'react-router-dom';

const ListGroups: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Liste des Contacts</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Liste des Contacts</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div>
          {/* List of the contacts groups  */}
          <IonList inset={true}>
            <IonListHeader>
              <IonLabel>Groupes ajoutés</IonLabel>
              <IonButton size='small'>
                <IonLabel>Supprimer tout</IonLabel>
              </IonButton>
            </IonListHeader>

            {groups.map(group => (
              <IonItem href={`/update/${group.id}`} button detail key={group.id}>
                <IonIcon color="primary" slot="start" icon={people} size="large"></IonIcon>
                <IonLabel>{group.name}</IonLabel>
                
                <IonButtons>
                  <Link to={`/update/${group.id}`}>
                    <IonButton fill='clear' color="secondary" size='default'>
                      <IonIcon icon={pencil}></IonIcon>
                    </IonButton>
                  </Link>
                  
                  <IonButton fill="clear" color="danger" size='default'>
                    <IonIcon icon={trash}></IonIcon>
                  </IonButton>
                </IonButtons>
                <IonNote slot='end'>15</IonNote>
              </IonItem>
            ))}
          </IonList>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default ListGroups;
