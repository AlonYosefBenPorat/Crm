import { NavLink, useNavigate } from "react-router-dom";
import '../css/navbar.scss';
import { CgProfile } from "react-icons/cg";
import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../contexts/DarkModeContext";
import { CiDark } from "react-icons/ci";
import { MdOutlineLightMode } from "react-icons/md";
import eventBus from "../services/EventBus";
import { BsInfoCircle } from "react-icons/bs";
import { AuthContext } from "../contexts/AuthContext";

interface NavBarProps {
  openModal: () => void;
  openResetPasswordModal: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ openModal, openResetPasswordModal }) => {
  const { darkMode, toggle } = useContext(DarkModeContext);
  const { logout } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [userLastName, setUserLastName] = useState<string | null>(null);
  const [userProfileImageAlt, setUserProfileImageAlt] = useState<string | null>(null);
  const [userProfileImageSrc, setUserProfileImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const storedUserFirstName = localStorage.getItem('UserFirstName');
    const storedUserLastName = localStorage.getItem('UserLastName');
    const storedUserProfileImageAlt = localStorage.getItem('UserProfileImageAlt');
    const storedUserProfileImageSrc = localStorage.getItem('UserProfileImageSrc');

    if (storedUserFirstName && storedUserLastName && storedUserProfileImageAlt && storedUserProfileImageSrc) {
      setIsLoggedIn(true);
      setUserFirstName(storedUserFirstName);
      setUserLastName(storedUserLastName);
      setUserProfileImageAlt(storedUserProfileImageAlt);
      setUserProfileImageSrc(storedUserProfileImageSrc);
    }

    const handleUserLogin = (event: CustomEvent) => {
      const user = event.detail;
      setIsLoggedIn(true);
      setUserFirstName(user.firstName);
      setUserLastName(user.lastName);
      setUserProfileImageAlt(user.profileImage.alt);
      setUserProfileImageSrc(user.profileImage.src);
    };

    const handleUserLogout = () => {
      setIsLoggedIn(false);
      setUserFirstName(null);
      setUserLastName(null);
      setUserProfileImageAlt(null);
      setUserProfileImageSrc(null);
    };

    eventBus.on('userLogin', handleUserLogin);
    eventBus.on('userLogout', handleUserLogout);

    return () => {
      eventBus.remove('userLogin', handleUserLogin);
      eventBus.remove('userLogout', handleUserLogout);
    };
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUserFirstName(null);
    setUserLastName(null);
    setUserProfileImageAlt(null);
    setUserProfileImageSrc(null);
    navigate('/');
  };

  return (
    <nav id="app-nav" className="fixed-nav">
      <div className="nav-left">
        <NavLink to="/SystemInfo">
          <BsInfoCircle className="icon-button" />
        </NavLink>
        <img src="https://globalfrontendcrm.blob.core.windows.net/frontendcrm/CRM-Logo.png?sp=r&st=2025-01-03T16:14:44Z&se=2027-03-31T23:14:44Z&spr=https&sv=2022-11-02&sr=b&sig=Hg9tt9VgzQv9aYlK%2BIAbnVp4op6naXlEFXHGltHbv7k%3D" alt="AlonCRMLogo" className="logo" />
        {isLoggedIn && <h3>Welcome {userLastName} {userFirstName}</h3>}
      </div>
      <div className="nav-right">
        <div className="relative group">
          <div className="profile-container">
            {isLoggedIn && userProfileImageSrc ? (
              <img
                className="profile-image"
                src={userProfileImageSrc}
                alt={userProfileImageAlt}
                aria-description="profile"
                onClick={openModal}
              />
            ) : (
              <CgProfile className="icon-button" aria-description="profile" onClick={openModal} />
            )}
          </div>
          <div id="dropdown" className="dropdown-menu">
            <ul className="dropdown-list" aria-labelledby="dropdownDefaultButton">
              {!isLoggedIn ? (
                <li>
                  <a href="#" onClick={openModal} className="dropdown-item">Login</a>
                </li>
              ) : (
                <>
                  <li>
                    <a href="/" onClick={handleLogout} className="dropdown-item">Logout</a>
                  </li>
                  <li>
                    <a href="edit-profile" className="dropdown-item">Edit My Profile</a>
                  </li>
                  <li>
                    <a onClick={openResetPasswordModal} className="dropdown-item">Reset Password</a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        <button onClick={toggle} className="icon-button" aria-description="DarkMode">
          {darkMode ? <CiDark /> : <MdOutlineLightMode />}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;