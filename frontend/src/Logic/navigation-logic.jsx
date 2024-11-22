import axios from 'axios'
import { AuthContext } from '../Utils/auth-context'
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationLogic } from '../Logic/navigation-logic'

export const NavigationLogic = () => {
    const {user, logoutUser} = useContext(AuthContext)
    const navigate = useNavigate()
}

export default NavigationLogic

// const {
// } = NavigationLogic()