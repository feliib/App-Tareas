import React, { createContext, useContext } from 'react';
import { AuthContext } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Asegúrate que esta URL sea la misma que en AuthContext
const API_URL = 'http://192.168.0.106:4000/api'; // <--- CAMBIAR ESTO

export const TareasContext = createContext();

// Helper para crear peticiones autenticadas
const fetchConToken = async (endpoint, method = 'GET', body = null) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('No hay token de autenticación');

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }
    
    const respuesta = await fetch(`${API_URL}${endpoint}`, options);
    return respuesta.json();
};

export const TareaProvider = ({ children }) => {
    const { userId } = useContext(AuthContext);

    const devolverTareas = async () => {
        if (!userId) return [];
        try {
            return await fetchConToken('/tareas');
        } catch (error) {
            console.error('Error al obtener tareas:', error);
            return [];
        }
    };

    const agregarTarea1 = async (nuevaTarea) => {
        try {
            return await fetchConToken('/tareas', 'POST', nuevaTarea);
        } catch (error) {
            console.error('Error al agregar tarea:', error);
        }
    };

    const completarTarea = async (tareaId) => {
        try {
            return await fetchConToken(`/tareas/${tareaId}`, 'PUT', { estaActiva: false });
        } catch (error) {
            console.error('Error al completar tarea:', error);
        }
    };
    
    const editarTarea = async (tareaId, datos) => {
         try {
            return await fetchConToken(`/tareas/${tareaId}`, 'PUT', datos);
        } catch (error) {
            console.error('Error al editar tarea:', error);
        }
    };

    const borrarTarea = async (tareaId) => {
        try {
            return await fetchConToken(`/tareas/${tareaId}`, 'DELETE');
        } catch (error) {
            console.error('Error al borrar tarea:', error);
        }
    };

    return (
        <TareasContext.Provider value={{
            devolverTareas,
            agregarTarea1,
            completarTarea,
            editarTarea, // <--- Nueva función para centralizar la edición
            borrarTarea
        }}>
            {children}
        </TareasContext.Provider>
    );
};