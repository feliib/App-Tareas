import React, { useContext, useEffect, useState } from 'react';
import {ImageBackground, View,Text, Button,  StyleSheet,TextInput, Switch, tab} from "react-native";
import { useNavigation, NavigationContainer} from "@react-navigation/native";
import { AuthContext } from '../context/AuthContext';

export default function SoloRegister() {


  
  const image = require('../assets/graphic-2d-colorful-wallpaper-with-grainy-gradients.jpg');

  const {status, login, register} = useContext(AuthContext)

  const [esLogin, setEsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const navigation = useNavigation();

  const handleSubmit = () => {
    if(esLogin){
      login(username, password)
    }else{
      
      register(username, email, password)
      navigation.navigate('Login')

    }
  }
  useEffect( () => {
    if( status === 'authenticated'){
      navigation.navigate('Home')
    }
  }, [status, navigation])


  const IrALogin = () => {
    setEsLogin(true);
  };
 
  return (
    <View style={styles.container1}>
    <ImageBackground source={image} resizeMode="cover" style={styles.image}>

    <View style={styles.container}>
      <Text style={styles.title}>{'Registrarse'}</Text>
      
      {
        !esLogin && (
            <TextInput 
        style={ styles.input}
        placeholder='Ingrese su Email'
        value={email}
        onChangeText={setEmail}
        />
        )
      }
      <TextInput 
        style={ styles.input}
        placeholder='Ingrese su Username'
        value={username}
        onChangeText={setUsername}
      />
      <TextInput 
        style={ styles.input}
        placeholder='Ingrese su Password'
        keyboardType='password'
        value={password}
        onChangeText={setPassword}
      />
      <Button title={ esLogin ? 'Login' : 'Registrate'} onPress={handleSubmit}/>

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
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  register: {
    flexDirection: "colum",
    justifyContent: "center",
    gap: 5,
  },
  text1: {
    textAlign: "center",
    color: "blue"
  }
});
