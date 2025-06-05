import React, { createContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [status, setStatus] = useState('checking');
    const [userId, setUserId] = useState(null);
    const [userRol, setUserRol] = useState(null); // NUEVO

useEffect(() => {
    const cargarEstadoAuth = async () => {
        const isAuthenticated = await AsyncStorage.getItem('isAuthenticated');
        if (isAuthenticated === 'true') {
            setStatus('authenticated');
            const storedUserId = await AsyncStorage.getItem('userId');
            const storedUserRol = await AsyncStorage.getItem('userRol');
            if (storedUserId) setUserId(storedUserId);
            if (storedUserRol) setUserRol(storedUserRol);
        } else {
            setStatus('unauthenticated');
        }
    };
    cargarEstadoAuth();
}, []);

    const esLogeable = async (username, password) => {
        try {
            const respuesta = await fetch('https://6840e302d48516d1d359aa21.mockapi.io/TareaApp/Usuario');
            const users = await respuesta.json();
            const user = users.find(element => element.username === username && element.password === password);
            return user ? user : undefined;
        } catch (error) {
            console.log(error);
        }
    };

const login = async (username, password) => {
    try {
        const user = await esLogeable(username, password);
        if (user) {
            await AsyncStorage.setItem('isAuthenticated', 'true');
            await AsyncStorage.setItem('userId', user.id);
            await AsyncStorage.setItem('userRol', user.rol || 'user');
            setStatus('authenticated');
            setUserId(user.id);
            setUserRol(user.rol || 'user');
            return true; // Login exitoso
        } else {
            setStatus('unauthenticated');
            return false; // Login fallido
        }
    } catch (error) {
        alert('Error en el login');
        return false;
    }
};
    
    

    const register = async (username, email, password) => {

        try {
            const esLogin = await esLogeable(username, email, password);
            if (!esLogin) {
                const respuesta = await fetch('https://6840e302d48516d1d359aa21.mockapi.io/TareaApp/Usuario', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password,
                    })
                });
                if (respuesta.ok) {
                    alert('Registro Exitoso');
                } else {
                    alert('Error en el registro');
                }
            } else {
                setStatus('unauthenticated');
                console.error('El usuario ya tiene una cuenta asociada');
            }
        } catch (error) {
            console.error('Fallo el registro: ', error);
            alert('Error al registrarse');
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('isAuthenticated');
        setStatus('unauthenticated')
    }
   
 return (
    <AuthContext.Provider value={{userId, status, userRol, login, register, logout}}>
        { children }
    </AuthContext.Provider>
 )
}

