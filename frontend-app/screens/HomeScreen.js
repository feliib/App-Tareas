import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, SectionList, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { TareasContext } from '../context/TareasContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { agregarTarea1, completarTarea, devolverTareasActivas, resetearTodasLasTareas, borrarTarea, editarTarea } = useContext(TareasContext);
  const { status, logout, userId, userRol } = useContext(AuthContext);
  const [tareas, setTareas] = useState([]);
  const [nombreTarea, setNombreTarea] = useState("");
  const [categoria, setCategoria] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [tareaAEditar, setTareaAEditar] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      if (status === 'unauthenticated') {
        navigation.navigate('Login');
      } else {
        const fetchTareas = async () => {
          const tareasActivas = await devolverTareasActivas();
          const tareasConId = tareasActivas.map(t => ({
            ...t,
            id: t._id || t.id
          }));
          setTareas(tareasConId);
        };
        fetchTareas();
      }
    }, [status, userId, navigation])
  );

  const handleLogout = () => {
    logout();
  };

  const abrirModalEditar = (tarea) => {
    setTareaAEditar(tarea);
    setNuevoNombre(tarea.nombre);
    setNuevaCategoria(tarea.categoria || "");
    setModalVisible(true);
  };

  const guardarEdicion = async () => {
    if (nuevoNombre.trim() !== "") {
      try {
        await editarTarea(tareaAEditar.id, {
          nombre: nuevoNombre,
          categoria: nuevaCategoria
        });
        const tareasActualizadas = await devolverTareasActivas();
        const tareasConId = tareasActualizadas
          .filter(t => t && (t._id || t.id))
          .map(t => ({
            ...t,
            id: t._id || t.id
          }));
        setTareas(tareasConId);
        setModalVisible(false);
        setTareaAEditar(null);
        setNuevoNombre("");
        setNuevaCategoria("");
      } catch {
        alert('Error al editar la tarea');
      }
    } else {
      alert('El nombre no puede estar vacío');
    }
  };

  const eliminarTarea = async (tareaId) => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que quieres completar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí', onPress: async () => {
            await completarTarea(tareaId);
            const tareasActualizadas = await devolverTareasActivas();
            const tareasConId = tareasActualizadas
              .filter(t => t && (t._id || t.id))
              .map(t => ({
                ...t,
                id: t._id || t.id
              }));
            setTareas(tareasConId);
          }
        },
      ],
      { cancelable: true }
    );
  };

  const handleSubmit = async () => {
    if (!nombreTarea.trim() || !categoria.trim()) {
      alert('Ingrese nombre y categoría');
      return;
    }
    try {
      const nuevaTarea = {
        nombre: nombreTarea,
        categoria,
        estaActiva: true
      };
      await agregarTarea1(nuevaTarea);
      const tareasActualizadas = await devolverTareasActivas();
      const tareasConId = tareasActualizadas
        .filter(t => t && (t._id || t.id))
        .map(t => ({
          ...t,
          id: t._id || t.id
        }));
      setTareas(tareasConId);
      setNombreTarea("");
      setCategoria("");
    } catch {
      alert('Error al crear tarea');
    }
  };

  const categoriasExistentes = [...new Set(tareas.map(t => t.categoria).filter(Boolean))];
  const secciones = categoriasExistentes.map(cat => ({
    title: cat,
    data: tareas.filter(t => t.categoria === cat)
  }));

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.container}>
        <SectionList
          sections={secciones}
          keyExtractor={(item) => item.id.toString()}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.categoriaHeader}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.tareaContainer}>
              <Text style={styles.tareaText}>{item.nombre}</Text>
              <View style={styles.tareaButtonsRow}>
                <View style={styles.tareaButtonWrapper}>
                  <Button
                    title="✓"
                    onPress={() => eliminarTarea(item.id)}
                    color="#4CAF50"
                  />
                </View>
                <View style={styles.tareaButtonWrapper}>
                  <Button
                    title="✎"
                    onPress={() => abrirModalEditar(item)}
                    color="#FFA500"
                  />
                </View>
                <View style={styles.tareaButtonWrapper}>
                  <Button
                    title="❌"
                    onPress={() => {
                      Alert.alert(
                        'Eliminar tarea',
                        '¿Estás seguro de que quieres eliminar esta tarea?',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          { text: 'Eliminar', style: 'destructive', onPress: async () => {
                              await borrarTarea(item.id);
                              const tareasActualizadas = await devolverTareasActivas();
                              const tareasConId = tareasActualizadas
                                .filter(t => t && (t._id || t.id))
                                .map(t => ({
                                  ...t,
                                  id: t._id || t.id
                                }));
                              setTareas(tareasConId);
                            }
                          }
                        ]
                      );
                    }}
                    color="#D32F2F"
                  />
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={styles.scrollContainer}
        />
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Escriba su tarea"
            value={nombreTarea}
            onChangeText={setNombreTarea}
          />
          <TextInput
            style={styles.input}
            placeholder="Escriba la categoría"
            value={categoria}
            onChangeText={setCategoria}
          />
          <Button title="Agregar Tarea" onPress={handleSubmit} />
          <View style={{ height: 16 }} />
          <Button title="Ver Tareas Completadas" onPress={() => navigation.navigate('CompletedTasks')} />
          <View style={{ height: 16 }} />
          {userRol === 'admin' && (
            <Button
              title="Borrar todas las tareas"
              color="red"
              onPress={() => {
                Alert.alert(
                  'Confirmar',
                  '¿Seguro que quieres borrar todas las tareas?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Sí', style: 'destructive', onPress: async () => {
                        await resetearTodasLasTareas();
                        const tareasActualizadas = await devolverTareasActivas();
                        const tareasConId = tareasActualizadas
                          .filter(t => t && (t._id || t.id))
                          .map(t => ({
                            ...t,
                            id: t._id || t.id
                          }));
                        setTareas(tareasConId);
                      }
                    }
                  ]
                );
              }}
            />
          )}
          <View style={{ height: 16 }} />
          <Button title="Logout" onPress={handleLogout} color="red" />
        </View>
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)'
          }}>
            <View style={{
              backgroundColor: '#fff',
              padding: 24,
              borderRadius: 12,
              width: '80%',
              elevation: 4
            }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Editar tarea</Text>
              <TextInput
                style={styles.input}
                placeholder="Nuevo nombre"
                value={nuevoNombre}
                onChangeText={setNuevoNombre}
              />
              <TextInput
                style={styles.input}
                placeholder="Nueva categoría"
                value={nuevaCategoria}
                onChangeText={setNuevaCategoria}
              />
              <Button title="Guardar cambios" onPress={guardarEdicion} />
              <View style={{ height: 8 }} />
              <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  tareaContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginVertical: 6,
    marginHorizontal: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  tareaText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'left',
    flex: 1,           
    marginBottom: 0,   
  },
  tareaButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  tareaButtonWrapper: {
    marginHorizontal: 4,
    width: 40,
  },
  inputBox: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bdbdbd',
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  categoriaHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0',
    padding: 5,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    textAlign: 'center'
  },
});

export default HomeScreen;