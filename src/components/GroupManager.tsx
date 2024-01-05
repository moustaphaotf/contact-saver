import { IonButton, IonButtons, IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader } from '@ionic/react';
import { addCircle, pencil, person, save, trash } from 'ionicons/icons';
import '../data/types';

interface ContainerProps {
  group?: Group
}

const GroupManager: React.FC<ContainerProps> = ({ group }) => {
  const isNew = group === undefined;
  return (
    <>
        <div>
          <IonList inset={true}>
            {/* The group name */}
            <IonItem>
              <IonInput autofocus={true} type='text' labelPlacement="stacked" label='Nom du groupe' placeholder='mes amis de classe'></IonInput>
            </IonItem>
          </IonList>

          <IonList inset={true}>
            {/* Form to add contacts to the list*/}
            <IonItem>
                <IonInput type='tel' labelPlacement="stacked" label='Numéro à ajouter' placeholder='611 000 000'>
                </IonInput>
                  <IonButton size='large' slot='end' fill='clear'>
                    <IonIcon icon={addCircle}></IonIcon>
                  </IonButton>
            </IonItem>

          </IonList>

          {/* List of the contacts added  */}
          <IonList inset={true}>
            <IonListHeader>
              <IonLabel>Contacts ajoutés</IonLabel>
              <IonButton size='small'>
                <IonLabel>Supprimer tout</IonLabel>
              </IonButton>
            </IonListHeader>
            <IonItem >
              <IonIcon color="primary" slot="start" icon={person} size="large"></IonIcon>
              <IonLabel>+224 625 126 703</IonLabel>

              <IonButtons>
                <IonButton fill='clear' color="secondary" size='default'>
                  <IonIcon icon={pencil}></IonIcon>
                </IonButton>
                
                <IonButton fill="clear" color="danger" size='default'>
                  <IonIcon icon={trash}></IonIcon>
                </IonButton>
              </IonButtons>
            </IonItem>
          </IonList>
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
