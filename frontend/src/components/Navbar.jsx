import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/features/auth/authSlice';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon"><img 
  src="/lo.png" 
  className="logo-img" 
  alt="CosmicWatch Logo" 
/></span>
          <span className="logo-text">CosmicWatch</span>
        </Link>

        <div className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <li>
            <NavLink to="/" className="navbar-link" onClick={() => setIsOpen(false)}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/explore" className="navbar-link" onClick={() => setIsOpen(false)}>Explorer</NavLink>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/dashboard" className="navbar-link" onClick={() => setIsOpen(false)}>Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/profile" className="navbar-link profile-link" onClick={() => setIsOpen(false)}>
                  👋 {user?.name || 'Profile'}
                </NavLink>
              </li>
              <li>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="navbar-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/auth" className="navbar-cta" onClick={() => setIsOpen(false)}>
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
