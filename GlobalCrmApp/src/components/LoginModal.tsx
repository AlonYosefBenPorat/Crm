import React, { useState, useContext, useEffect } from 'react';
import '../css/loginModal.scss';
import { auth } from '../services/auth-service';
import { showErrorDialog, showSuccessDialog } from '../dialogs/dialogs';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isModalOpen, closeModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    if (isModalOpen) {
      const savedEmail = localStorage.getItem('email');
      const savedPassword = localStorage.getItem('password');
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      } else {
        setEmail('');
        setPassword('');
        setRememberMe(false);
      }
      setError('');
      setShowPassword(false);
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await auth.login(email, password);
      const token = response.token;
      const user = response.user;
      await login(token);
      if (rememberMe) {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
      } else {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      }
      closeModal();
      showSuccessDialog('Login Successful');
      navigate('/Home'); 
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
      showErrorDialog('Login Failed');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div id="authentication-modal" tabIndex={-1} aria-hidden="true">
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-header">
            <h3 >CRM Platform</h3>
            <button type="button" className="close-btn" onClick={closeModal}>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6" />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="modal-body">
            <form action="#" onSubmit={handleSubmit} autoComplete="on">
              {error && <div className="text-red-500">{error}</div>}
              <div>
                <label htmlFor="email">Your username</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div>
                <label htmlFor="password">Your password</label>
                <div className="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <span onClick={toggleShowPassword} className="eye-icon">
                    {showPassword ? <IoEyeOff /> : <IoEye />}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="remember-me">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    autoComplete="off"
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                </div>
              <button type="submit" className="submit-btn">Login to your account</button>
              <div className="modal-footer">
                <p>
                  troubleshoot to sign in? <a href="mailto:alon.benporat@gmail.com" className="contact-link">Contact Administrator</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;