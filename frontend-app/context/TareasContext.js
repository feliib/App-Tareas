import React, { createContext, useContext } from 'react';
import { AuthContext } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.106:4000/api';

export const TareasContext = createContext();

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
            const res = await fetchConToken('/tareas');
            if (!Array.isArray(res)) return [];
            return res;
        } catch {
            return [];
        }
    };

    const agregarTarea1 = async (nuevaTarea) => {
        try {
            return await fetchConToken('/tareas', 'POST', nuevaTarea);
        } catch {}
    };

    const completarTarea = async (tareaId) => {
        try {
            return await fetchConToken(`/tareas/${tareaId}`, 'PUT', { estaActiva: false });
        } catch {}
    };

    const editarTarea = async (tareaId, datos) => {
        try {
            return await fetchConToken(`/tareas/${tareaId}`, 'PUT', datos);
        } catch {}
    };

    const borrarTarea = async (tareaId) => {
        try {
            return await fetchConToken(`/tareas/${tareaId}`, 'DELETE');
        } catch {}
    };

    const devolverTareasActivas = async () => {
        try {
            const todas = await devolverTareas();
            return todas.filter(t => t.estaActiva);
        } catch {
            return [];
        }
    };

    const devolverTareasCompletadas = async () => {
        try {
            const todas = await devolverTareas();
            return todas
                .filter(t => t && (t.estaActiva === false || t.estaActiva === 0))
                .map(t => ({
                    ...t,
                    id: t._id || t.id
                }));
        } catch {
            return [];
        }
    };

    const resetearTodasLasTareas = async () => {
        try {
            return await fetchConToken('/tareas/all', 'DELETE');
        } catch {}
    };

    return (
        <TareasContext.Provider value={{
            devolverTareas,
            agregarTarea1,
            completarTarea,
            editarTarea,
            borrarTarea,
            devolverTareasActivas,
            devolverTareasCompletadas,
            resetearTodasLasTareas
        }}>
            {children}
        </TareasContext.Provider>
    );
};