import { Link } from 'react-router-dom';
import styles from './Catalog.module.css';

const Catalog = () => {
  // This is a placeholder for your campers data
  const campers = [
    { id: 1, name: 'Camper 1' },
    { id: 2, name: 'Camper 2' },
    { id: 3, name: 'Camper 3' },
  ];

  return (
    <div className={styles.catalog}>
      <h1>Our Campers</h1>
      <div className={styles.grid}>
        {campers.map((camper) => (
          <Link 
            to={`/catalog/${camper.id}`} 
            key={camper.id}
            className={styles.camperCard}
          >
            <h3>{camper.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
