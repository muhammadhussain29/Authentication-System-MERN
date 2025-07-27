// DataContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context
const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const serverURL = import.meta.env.VITE_SERVER_URL;

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState({})


    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/user/get-user');
            if (response.data.success) {
                setUserData(response.data.userData)
            }
            else {
                console.log(response.data.msg);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const value = { isLoggedIn, setIsLoggedIn, userData, fetchData, serverURL }


    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
