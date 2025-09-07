import { Link, useLocation } from 'react-router-dom';
import Title from "../components/Title";
import '../styles/navigation.css';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-links">
        <Link
          to="/"
          className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
        >
          🏠 Home
        </Link>
        <Link
          to="/notes"
          className={location.pathname === '/notes' ? 'nav-link active' : 'nav-link'}
        >
          📝 Notes
        </Link>
        <Link
          to="/movies"
          className={location.pathname === '/movies' ? 'nav-link active' : 'nav-link'}
        >
          🎬 Movies
        </Link>
        <Link
          to="/about"
          className={location.pathname === '/about' ? 'nav-link active' : 'nav-link'}
        >
          ℹ️ About
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;
