import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="brand">
        <Link to="/" className="brand-link">Product Store</Link>
      </div>
      <nav>
        <ul className="nav-list">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/cart" className="nav-link">Cart</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
