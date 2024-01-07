import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { addCircleOutline, people } from 'ionicons/icons';
import AddGroup from './pages/AddGroup';
import ListGroups from './pages/ListGroups';
import UpdateGroup from './pages/UpdateGroup';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/new">
            <AddGroup />
          </Route>
          <Route exact path="/groups">
            <ListGroups />
          </Route>
          <Route path="/groups/:groupId">
            <UpdateGroup />
          </Route>
          <Route exact path="/">
            <Redirect to="/new" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="AddGroup" href="/new">
            <IonIcon aria-hidden="true" icon={addCircleOutline} />
            <IonLabel>Nouveau Groupe</IonLabel>
          </IonTabButton>
          <IonTabButton tab="ListGroups" href="/groups">
            <IonIcon aria-hidden="true" icon={people} />
            <IonLabel>Liste des Contacts</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
