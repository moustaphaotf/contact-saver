import { IonImg, IonLabel } from '@ionic/react';
import './Empty.css';

const Empty: React.FC = () => {
  return (
    <div>
      <div className="container">
        <h2>Ajoutez un contact !</h2>
        <IonImg className='empty-image' src='/empty.png'></IonImg>
      </div>
    </div>
  );
};

export default Empty;
