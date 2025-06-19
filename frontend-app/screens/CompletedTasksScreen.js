import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { TareasContext } from '../context/TareasContext';

export default function CompletedTasksScreen() {
    const { devolverTareasCompletadas, borrarTarea, editarTarea } = useContext(TareasContext);
    const [tareasCompletadas, setTareasCompletadas] = useState([]);

    useEffect(() => {
        fetchCompletadas();
    }, []);

    const fetchCompletadas = async () => {
        const completadas = await devolverTareasCompletadas();
        setTareasCompletadas(completadas);
    };

    const handleRestaurar = async (id) => {
        await editarTarea(id, { estaActiva: true });
        fetchCompletadas();
    };

    const handleBorrar = (id) => {
        Alert.alert(
            'Borrar tarea',
            '¿Estás seguro de que quieres borrar esta tarea completada?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Borrar', style: 'destructive', onPress: async () => {
                    await borrarTarea(id);
                    fetchCompletadas();
                }}
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tareas Completadas</Text>
            <FlatList
                data={tareasCompletadas}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.tareaContainer}>
                        <Text style={styles.tareaText}>{item.nombre}</Text>
                        <View style={styles.buttonRow}>
                            <View style={styles.buttonWrapper}>
                                <Button title="Restaurar" color="#4CAF50" onPress={() => handleRestaurar(item.id)} />
                            </View>
                            <View style={styles.buttonWrapper}>
                                <Button title="Borrar" color="#D32F2F" onPress={() => handleBorrar(item.id)} />
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    tareaContainer: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    tareaText: { fontSize: 18, fontWeight: 'bold' },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    buttonWrapper: {
        marginLeft: 8,
        flex: 1,
    },
});