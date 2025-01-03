import axios from "axios"
import { json } from "react-router-dom";

//add EnvFile to store the base url
// write to the cheaker to see the configuration on the envfile  add to git the ENV FILE .
const LoginbaseUrl = 'https://localhost:7003/api/Auth'
const RegisterbaseUrl = 'https://localhost:7003/api/User'

const register = (firstName: string, lastName: string, email: string,
    password: string, dateOfBirth: Date, jobTitle: string, phoneNumber: string,
    role:string, profileAlt: string, profileSrc: string) =>
    axios.post(RegisterbaseUrl, { firstName, lastName, email, password, dateOfBirth, jobTitle, phoneNumber, role, profileAlt, profileSrc })

    //agter seucessfull registration the the server return token we store the toke to local storage
const login =  (email:string, password:string) =>
    axios.post(`${LoginbaseUrl}/login`, { username: email, password })
         .then(response => {
            if (response.data.token) {
                console.log(response.data);
                localStorage.setItem('JwtToken', JSON.stringify(response.data));
            }
            return response;
        });


export { register, login };
export const auth = { register, login };

   