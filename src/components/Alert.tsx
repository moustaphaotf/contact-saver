import { IonAlert } from "@ionic/react";
import '../data/types';

interface ContainerProps {
    params: AlertInfos,
    setParams: React.Dispatch<React.SetStateAction<AlertInfos>>;
}

const Alert: React.FC<ContainerProps> = ({params, setParams}) => {    
    return (
        <IonAlert 
            {...params}
            onDidDismiss={() => setParams({...params, isOpen: false})}
        ></IonAlert>
    );
}

export default Alert;