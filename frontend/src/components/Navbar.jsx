import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUserTie, FaShoppingCart } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar floating-navbar">
      <div className="navbar-brand">
        <h1>TrackFlow</h1>
      </div>
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          <FaHome /> Dashboard
        </Link>
        <Link to="/leads" className={location.pathname.includes('/leads') ? 'active' : ''}>
          <FaUserTie /> Leads
        </Link>
        <Link to="/orders" className={location.pathname.includes('/orders') ? 'active' : ''}>
          <FaShoppingCart /> Orders
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;