import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import './UpdateGroup.css';
import '../data/types';
import GroupManager from '../components/GroupManager';
import { useParams } from 'react-router';
import { DefaultGroup } from '../data/samples';
import { useEffect, useState } from 'react';
import { getGroup } from '../data';

const UpdateGroup: React.FC = () => {
  const {groupId} = useParams<{groupId: string}>();
  const router = useIonRouter();
  const [group, setGroup] = useState<Group>(DefaultGroup);
  
  useEffect(() => {
    (async () => {
      const id = Number(groupId);
      const _group = await getGroup(id)
    
      if(_group === undefined) {
        router.push('/groups');
        return;
      }
      setGroup(_group as Group);
    })();
  }, []);
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{group.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{group.name}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <GroupManager group={group}/>
      </IonContent>
    </IonPage>
  );
};

export default UpdateGroup;
