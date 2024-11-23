import axios from 'axios'
import { AuthContext } from '../utils/auth-context'
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export const NavigationLogic = () => {
    const {user, logoutUser} = useContext(AuthContext)
    const navigate = useNavigate()
}

export default NavigationLogic

// const {
// } = NavigationLogic()