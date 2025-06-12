import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.106:4000/api'; // <--- CAMBIAR ESTO

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [status, setStatus] = useState('checking');
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const cargarEstadoAuth = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUserId = await AsyncStorage.getItem('userId');
            if (storedToken && storedUserId) {
                setToken(storedToken);
                setUserId(storedUserId);
                setStatus('authenticated');
            } else {
                setStatus('unauthenticated');
            }
        };
        cargarEstadoAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const respuesta = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                alert(data.msg || 'Error en el login');
                return;
            }

            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('userId', data.userId);
            setToken(data.token);
            setUserId(data.userId);
            setStatus('authenticated');
        } catch (error) {
            console.error('Error de red en login:', error);
            alert('Error de conexión al intentar iniciar sesión.');
        }
    };

    const register = async (username, email, password) => {
        try {
            const respuesta = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await respuesta.json();
            if (!respuesta.ok) {
                alert(data.msg || 'Error en el registro');
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error('Error de red en registro:', error);
            alert('Error de conexión al registrarse.');
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userId');
        setToken(null);
        setUserId(null);
        setStatus('unauthenticated');
    };
   
    return (
        <AuthContext.Provider value={{ token, userId, status, login, register, logout }}>
            { children }
        </AuthContext.Provider>
    );
};