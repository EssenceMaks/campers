import { useParams } from 'react-router-dom';
import styles from './CamperDetail.module.css';

const CamperDetail = () => {
  const { id } = useParams();

  return (
    <div className={styles.camperDetail}>
      <h1>Camper Details</h1>
      <p>Viewing camper with ID: {id}</p>
    </div>
  );
};

export default CamperDetail;
