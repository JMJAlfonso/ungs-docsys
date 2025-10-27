import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/media/logodocsys.jpg';
import './Header.css';

const Header = ({ user = { name: "Doe, John", role: "Reclutador" }, navItems = [] }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (item) => {
    switch (item) {
      case "Gestión de Postulaciones":
        navigate("/jobAppList");
        break;
      // Add other cases as needed
      default:
        break;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="header-top">
        <img
          src={logo}
          alt="docSYS Logo"
          className="logo"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/jobAppList')}
        />

        <div className="user-dropdown">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="user-button"
          >
            <FaUser className='user-icon' />
            <div className="user-info">
              <p className="user-name">{user.name}</p>
              <p className="user-role">{user.role}</p>
            </div>
            <span className={`chevron ${isDropdownOpen ? 'open' : ''}`}>▼</span>
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item">
                <FaCog />
                Config. usuario
              </button>
              <button className="dropdown-item logout" onClick={() => logout()}>
                <FaSignOutAlt />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;