import React, { useContext, useEffect, useState } from 'react';
import { ImageBackground, Image, View, Text, Button, StyleSheet, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from '../context/AuthContext';

export default function RegisterLoginScreen() {
  const image = require('../assets/graphic-2d-colorful-wallpaper-with-grainy-gradients.jpg'); 
  const { status, login } = useContext(AuthContext);

  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loginError, setLoginError] = useState('');

  const navigation = useNavigation();

  const handleSubmit = async () => {
    const loginResult = await login(username, password);
    if (!loginResult) {
      setLoginError('Usuario o contraseña incorrectos');
    } else {
      setLoginError('');
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      navigation.navigate('Home');
    }
  }, [status, navigation]);

  return (
    <View style={styles.container1}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.container2}>
          <Image
            source={require('../assets/logo2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.container}>
          <TextInput
            style={[styles.input, { backgroundColor: 'rgba(255, 255, 255, 0.50)' }]}
            placeholder='Ingrese su Username'
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={[styles.input, { backgroundColor: 'rgba(255, 255, 255, 0.50)' }]}
            placeholder='Ingrese su Password'
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title={'Iniciar sesion'} onPress={handleSubmit} />
          {loginError ? (
            <Text style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>
              {loginError}
            </Text>
          ) : null}
          <View style={{ height: 5 }} />
          <Text style={styles.text1}> ¿Olvidaste tu contraseña? </Text>
          <View style={{ height: 20 }} />
          <View>
            <Button title='Crear cuenta' onPress={() => navigation.navigate('SoloRegister')} color="#28a745" />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    marginTop: -115,
  },
  input: {
    backgroundColor: 'white',
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  register: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 5,
  },
  text1: {
    textAlign: "center",
    color: "white"
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  }
});