import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import '../../styles/colors.css';

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.heroContent}>
        <div className={styles.heroTitle}>Campers of your dreams</div>
        <div className={styles.heroText}>You can find everything you want in our catalog</div>
        <Link to="/catalog" className={styles.viewNowButton}>
          View Now
        </Link>
      </div>
    </div>
  );
};

export default Home;
