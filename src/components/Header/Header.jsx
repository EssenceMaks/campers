import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../../assets/images/logo/logo.svg';
import '../../styles/colors.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/"><img src={logo} alt="Logo" /></Link>
        </div>
        <nav className={styles.nav}>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/catalog" 
            end
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Catalog
          </NavLink>
          <NavLink 
            to="/favorits" 
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Favorits
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
