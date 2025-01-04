import axios from "axios";
import eventBus from "./EventBus";

const LoginbaseUrl = 'https://localhost:7003/api/Auth';
const RegisterbaseUrl = 'https://localhost:7003/api/User';
const GetUserByIdUrl = 'https://localhost:7003/api/Users'; 

const register = (firstName: string, lastName: string, email: string,
    password: string, dateOfBirth: Date, jobTitle: string, phoneNumber: string,
    role: string, profileAlt: string, profileSrc: string) =>
    axios.post(RegisterbaseUrl, { firstName, lastName, email, password, dateOfBirth, jobTitle, phoneNumber, role, profileAlt, profileSrc });

const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${LoginbaseUrl}/login`, { username: email, password });
    if (response.data.token) {
      console.log("Login response:", response.data);
      localStorage.setItem('JwtToken', response.data.token);
      localStorage.setItem('UserId', response.data.userID);
      localStorage.setItem('UserProfileImageAlt', response.data.profileImage.alt);
      localStorage.setItem('UserProfileImageSrc', response.data.profileImage.src);
      localStorage.setItem('UserFirstName', response.data.firstName);
      localStorage.setItem('UserLastName', response.data.lastName);
      localStorage.setItem('UserEmail', response.data.email);
      // Dispatch the userLogin event
      eventBus.dispatch('userLogin', response.data);
    } else {
      console.error("Login failed: No token received");
    }
    return response.data; // Return the data property
  } catch (error) {
    console.error("Login error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

const logout = () => {
  
  localStorage.clear();


  eventBus.dispatch('userLogout');
};



const getUserById = async (userId: string) => {
  try {
     const tokenString = localStorage.getItem('JwtToken');
    
    if (!tokenString) {
      throw new Error("No authentication token found");
    }
    const tokenObject = JSON.parse(tokenString);
    const token = tokenObject.token;
    const url = `${GetUserByIdUrl}/${userId}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error("Get user by ID error:", error);
    throw error;
  }
};

const getTokenResetPassword = async (email: string, oldPassword: string) => {
  let data = JSON.stringify({ email, oldPassword });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://localhost:7003/api/Auth/request-password-reset',
    headers: { 
      'Content-Type': 'application/json'
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    const token = response.data.token;
    localStorage.setItem('resetToken', token);
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (email: string, newPassword: string) => {
  const token = localStorage.getItem('resetToken');
  if (!token) {
    throw new Error('No token found in local storage');
  }

  let data = JSON.stringify({
    email,
    token,
    newPassword
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://localhost:7003/api/Auth/user-password-reset',
    headers: { 
      'Content-Type': 'application/json'
    },
    data: data
  };

  try {
    const response = await axios.request(config);
  } catch (error) {
    throw error;
  }
};
export { getUserById, register, login, logout, getTokenResetPassword, resetPassword };
export const auth = { register, login, logout,  getUserById,getTokenResetPassword,resetPassword };