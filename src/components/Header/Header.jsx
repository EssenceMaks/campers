import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">LOGO</Link>
        </div>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/catalog" className={styles.navLink}>Catalog</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
