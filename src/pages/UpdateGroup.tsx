import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import './UpdateGroup.css';
import '../data/types';
import GroupManager from '../components/GroupManager';
import { useHistory, useParams } from 'react-router';
import { DefaultGroup, FakeGroups} from '../data/samples';
import { useEffect, useState } from 'react';

const UpdateGroup: React.FC = (props) => {
  const {groupId} = useParams<{groupId: string}>();
  const history = useHistory();
  const [group, setGroup] = useState<Group>(DefaultGroup);
  
  useEffect(() => {
    const id = Number(groupId);
    const groupsFound = FakeGroups.filter(group => group.id === id);
  
    if(groupsFound.length === 0) {
      history.replace('/groups');
      return;
    }
    setGroup(groupsFound[0]);
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
