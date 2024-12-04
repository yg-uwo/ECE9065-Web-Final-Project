import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from '../redux/auth_slice';
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
       
        dispatch(logout());
        navigate("/");
    }, [dispatch, navigate]);

};

export default Logout;
