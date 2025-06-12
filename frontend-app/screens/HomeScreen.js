import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, FlatList, Modal, Picker, SectionList,  KeyboardAvoidingView, Platform  } from 'react-native';
import { AuthContext } from '../frontend-app/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { TareasContext } from '../frontend-app/context/TareasContext';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { agregarTarea1, completarTarea, devolverTareasActivas } = useContext(TareasContext);
  const { status, logout, userId } = useContext(AuthContext);

  const [tareas, setTareas] = useState([]);
  const [nombreTarea, setNombreTarea] = useState("");
  const [categoria, setCategoria] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [tareaAEditar, setTareaAEditar] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  useEffect(() => {
    if (status === 'unauthenticated') {
      navigation.navigate('Login');
    } else {
      const fetchTareas = async () => {
        const tareasActivas = await devolverTareasActivas();
        setTareas(tareasActivas);
      };
      fetchTareas();
    }
  }, [status, userId, navigation]);

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
      await fetch(`https://6657b1355c361705264597cb.mockapi.io/Tarea/${tareaAEditar.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoNombre, categoria: nuevaCategoria }),
      });
      const tareasActualizadas = await devolverTareasActivas();
      setTareas(tareasActualizadas);
      setModalVisible(false);
      setTareaAEditar(null);
      setNuevoNombre("");
      setNuevaCategoria("");
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
            setTareas(tareasActualizadas);
            setNombreTarea("");
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
    const nuevaTarea = {
      nombre: nombreTarea,
      idUsuario: userId,
      estaActiva: true,
      categoria
    };
    await agregarTarea1(nuevaTarea);
    const tareasActualizadas = await devolverTareasActivas();
    setTareas(tareasActualizadas);
    setNombreTarea("");
    setCategoria("");
  };

  // Agrupa tareas por categoría existente
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
          <Button title="Logout" onPress={handleLogout} color="red" />
        </View>
        {/* Quitamos los botones de afuera del inputBox */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          {/* ...modal code... */}
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
    flexDirection: 'row', // <--- Cambia a row
    alignItems: 'center',  // <--- Centra verticalmente
    justifyContent: 'space-between', // <--- Espacia nombre y botones
  },
  tareaText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'left', // <--- Alinea a la izquierda
    flex: 1,           // <--- Ocupa el espacio disponible
    marginBottom: 0,   // <--- Elimina el margen inferior
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
  inputContainer: {
    display: 'none', // Ocultamos el viejo inputContainer
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