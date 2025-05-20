import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * The header component that contain the title of the website and the Project link
 * @param {string} brandText - The name of the link shown on the navbar
 * @param {string} navLinks - The path to go to the specific page
 * @returns Header component
 */
function Header({brandText, navLinks}) {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg border-bottom border-body">
      <div className="container">
        <Link to="/" className="navbar-brand text-info">{brandText}</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav  ms-auto">
            {navLinks.map((link, index) => (
              <li className="nav-item" key={index}>
                <Link 
                  to={link.path} 
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;