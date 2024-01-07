import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonNote, IonPage, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import './ListGroups.css';
import { pencil, people, trash } from 'ionicons/icons';
import '../data/types';
import { ContactsAPI, getGroups, saveGroups } from '../data';
import { useEffect, useState } from 'react';
import Empty from '../components/Empty';
import { Dialog } from '@capacitor/dialog';

const ListGroups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const router = useIonRouter();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () =>  {
    const _groups = await getGroups();
    setGroups(_groups);
  }

  useIonViewWillEnter(() => {
    loadGroups();
  });

  const handleRemoveGroup = async (group: Group) => {
    const { value } = await Dialog.confirm({
      title: "Suppression de groupe",
      message: "Voulez-vous supprimer le groupe ?"
    });

    if(value) {
      // Remove from state
      const _groups = groups.filter(_group => _group.id !== group.id);
  
      // Remove from user's system
      ContactsAPI.remove(group);
  
      setGroups(_groups);
      await saveGroups(_groups)
    }
  }


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
            </IonListHeader>

            {groups.map(group => (
              <IonItem onClick={() => router.push(`/groups/${group.id}`)}  button detail key={group.id}>
                <IonIcon color="primary" slot="start" icon={people} size="large"></IonIcon>
                <IonLabel>{group.name}</IonLabel>
                
                <IonButtons>
                    <IonButton fill='clear' color="secondary" size='default'>
                      <IonIcon icon={pencil}></IonIcon>
                    </IonButton>
                  
                  <IonButton onClick={(event) => { event.stopPropagation(); handleRemoveGroup(group)}} fill="clear" color="danger" size='default'>
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
