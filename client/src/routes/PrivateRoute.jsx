import { Navigate, Outlet } from "react-router-dom";
import {useSelector} from 'react-redux'

export const PrivateRoute = () => {
    const {user} = useSelector((state)=>state.auth)
    return user ? <Outlet/> : <Navigate to="/login" />
}