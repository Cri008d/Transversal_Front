import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        const tokenData = localStorage.getItem('token'); 

        if (userData && tokenData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const login = (responseData) => {
        if (responseData.token) {
            localStorage.setItem('token', responseData.token);
        }

        const userToStore = responseData.user || responseData;
    
        delete userToStore.token; 
        
        localStorage.setItem('user', JSON.stringify(userToStore));
        setUser(userToStore);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token'); 
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
export {AuthContext};