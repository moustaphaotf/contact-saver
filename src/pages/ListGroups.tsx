import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonNote, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './ListGroups.css';
import { pencil, people, trash } from 'ionicons/icons';
import '../data/types';
import { getGroups } from '../data';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Empty from '../components/Empty';

const ListGroups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  useState(() => {
    (async () =>  {
      const _groups = await getGroups();
      setGroups(_groups);
    })();
  });


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
          { groups.length === 0 && (
            <div className="empty-box"><Empty message="Ajoutez des groupes !" /></div>
          )}

          {/* List of the contacts groups  */}
          { groups.length > 0 && <IonList inset={true}>
            <IonListHeader>
              <IonLabel>Groupes ajoutés</IonLabel>
              <IonButton size='small'>
                <IonLabel>Supprimer tout</IonLabel>
              </IonButton>
            </IonListHeader>

            {groups.map(group => (
              <IonItem href={`/groups/${group.id}`} button detail key={group.id}>
                <IonIcon color="primary" slot="start" icon={people} size="large"></IonIcon>
                <IonLabel>{group.name}</IonLabel>
                
                <IonButtons>
                  <Link to={`/groups/${group.id}`}>
                    <IonButton fill='clear' color="secondary" size='default'>
                      <IonIcon icon={pencil}></IonIcon>
                    </IonButton>
                  </Link>
                  
                  <IonButton fill="clear" color="danger" size='default'>
                    <IonIcon icon={trash}></IonIcon>
                  </IonButton>
                </IonButtons>
                <IonNote slot='end'>{group.contacts.length}</IonNote>
              </IonItem>
            ))}
          </IonList>}

        </div>
      </IonContent>
    </IonPage>
  );
};

export default ListGroups;
