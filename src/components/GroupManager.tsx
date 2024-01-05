import { IonButton, IonButtons, IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader } from '@ionic/react';
import { addCircle, pencil, person, save, trash } from 'ionicons/icons';
import '../data/types';
import { useEffect, useState } from 'react';
import { DefaultGroup } from '../data/samples';
import Empty from './Empty';

interface ContainerProps {
  group: Group
}

const GroupManager: React.FC<ContainerProps> = ({ group: _group = DefaultGroup }) => {
  const [group, setGroup] = useState<Group>(DefaultGroup);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    // Load group infos from props when it's in update mode
    const _isNew = _group === undefined;
    setIsNew(_isNew);
    if(!isNew) {
      setGroup(_group);
    }

  }, [_group]);

  return (
    <>
        <div>
          <IonList inset={true}>
            {/* The group name */}
            <IonItem>
              <IonInput value={group.name} autofocus={true} type='text' labelPlacement="stacked" label='Nom du groupe' placeholder='mes amis de classe'></IonInput>
            </IonItem>
          </IonList>

          <IonList inset={true}>
            {/* Form to add contacts to the list*/}
            <IonItem>
                <IonInput type='tel' labelPlacement="stacked" label='Numéro à ajouter' placeholder='611 000 000'></IonInput>
                  <IonButton size='large' slot='end' fill='clear'>
                    <IonIcon icon={addCircle}></IonIcon>
                  </IonButton>
            </IonItem>

          </IonList>

          {/* Show an Empty component when there is no contact in the list ! */}
          {group.contacts.length === 0 && <Empty />}
          
          {/* List of the contacts added  */}
          {group.contacts.length > 1 && <IonList inset={true}>
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

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton>
            <IonIcon icon={save}></IonIcon>
          </IonFabButton>
        </IonFab>
    </>
  );
};

export default GroupManager;
