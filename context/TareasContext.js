import React, { createContext, useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TareasContext = createContext();

export const TareaProvider = ({ children }) => {
    const { userId } = useContext(AuthContext);
    const [tareas, setTareas] = useState([]);
    const [tareasActivas, setTareasActivas] = useState([]);
    const [tareasCompletadas, setTareasCompletadas] = useState([]);

    const fetchTareas = async () => {
        try {
            const respuesta = await fetch('https://6657b1355c361705264597cb.mockapi.io/Tarea');
            const data = await respuesta.json();
            console.log('Tareas obtenidas:', data);  // Debugging log
            const tareasFiltradas = data.filter(tarea => tarea.idUsuario === userId);
            setTareas(tareasFiltradas);
            setTareasActivas(tareasFiltradas.filter(tarea => tarea.estaActiva));
        } catch (error) {
            console.error('Error en el fetch de tareas: ', error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchTareas();
        }
    }, [userId]);

    const agregarTarea1 = async (nuevaTarea) => {
        try {
            const respuesta = await fetch('https://6657b1355c361705264597cb.mockapi.io/Tarea', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...nuevaTarea, idUsuario: userId })
            });
            if (respuesta.ok) {
                const tareaCreada = await respuesta.json();
                setTareas(prevTareas => [...prevTareas, tareaCreada]);
                if (tareaCreada.estaActiva) {
                    setTareasActivas(prevTareasActivas => [...prevTareasActivas, tareaCreada]);
                }
            } else {
                alert('Error al agregar la tarea');
            }
        } catch (error) {
            console.error('Error en la carga de la tarea: ', error);
        }
    };

    

    const devolverTareasActivas = async () => {
        try {
            const respuesta = await fetch('https://6657b1355c361705264597cb.mockapi.io/Tarea');
            if (!respuesta.ok) {
                throw new Error('Error al obtener las tareas');
            }
            const tareas = await respuesta.json();
            const tareasFiltradas = tareas.filter(item => item.idUsuario === userId && item.estaActiva);
            console.log('Tareas activas filtradas:', tareasFiltradas);  // Debugging log
            return tareasFiltradas;
        } catch (error) {
            console.error('Error al obtener las tareas: ', error);
            return [];
        }
    };

    const devolverTareasCompletadas = async () => {
    try {
        const respuesta = await fetch('https://6657b1355c361705264597cb.mockapi.io/Tarea');
        if (!respuesta.ok) {
            throw new Error('Error al obtener las tareas');
        }
        const tareas = await respuesta.json();
        const tareasFiltradas = tareas.filter(item => item.idUsuario === userId && !item.estaActiva);
        return tareasFiltradas;
    } catch (error) {
        console.error('Error al obtener las tareas completadas: ', error);
        return [];
    }
};

    const completarTarea = async (tareaId) => {
        try {
            const respuesta = await fetch(`https://6657b1355c361705264597cb.mockapi.io/Tarea/${tareaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estaActiva: false })
            });
            if (respuesta.ok) {
                setTareas(prevTareas => prevTareas.map(tarea => 
                    tarea.id === tareaId ? { ...tarea, estaActiva: false } : tarea
                ));
                setTareasActivas(prevTareasActivas => prevTareasActivas.filter(tarea => tarea.id !== tareaId));
            } else {
                alert('Error al completar la tarea');
            }
        } catch (error) {
            console.error('Error al completar la tarea: ', error);
        }
    };

    return (
        <TareasContext.Provider value={{ tareas, tareasActivas, devolverTareasActivas, agregarTarea1, completarTarea, fetchTareas }}>
            {children}
        </TareasContext.Provider>
    );
};
