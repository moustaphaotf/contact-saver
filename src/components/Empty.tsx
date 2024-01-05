import { IonImg } from '@ionic/react';
import './Empty.css';

interface ContainerProps{
  message?: string;
}

const Empty: React.FC<ContainerProps> = ({ message }) => {
  return (
    <div>
      <div className="container">
        <h2>{ message || "OUPS" }</h2>
        <IonImg className='empty-image' src='/empty.png'></IonImg>
      </div>
    </div>
  );
};

export default Empty;
