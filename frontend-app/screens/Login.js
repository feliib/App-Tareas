import React, { useContext, useEffect, useState } from 'react';
import { ImageBackground, Image, View,Text, Button,  StyleSheet,TextInput, Switch, tab} from "react-native";
import { useNavigation, NavigationContainer} from "@react-navigation/native";
import { AuthContext } from '../context/AuthContext';


export default function RegisterLoginScreen() {

 const image = require('../assets/graphic-2d-colorful-wallpaper-with-grainy-gradients.jpg'); 

  const {status, login, register} = useContext(AuthContext)

  const [esLogin, setEsLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");


  const navigation = useNavigation();
  const handleSubmit = () => {
  
        const loginResult =  login(username, password);
        if (loginResult === 'success') {
            navigation.navigate('Home');
        }
    
};

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

<View style={styles.container2}>
<Image
        source={require('../assets/logo2.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      </View>


    <View style={styles.container}>
<TextInput 
    style={[styles.input, {backgroundColor: 'rgba(255, 255, 255, 0.50)'}]}
    placeholder='Ingrese su Username'
    value={username}
    onChangeText={setUsername}
/>
      <TextInput 
         style={[styles.input, {backgroundColor: 'rgba(255, 255, 255, 0.50)'}]}
        placeholder='Ingrese su Password'
        keyboardType='password'
        value={password}
        onChangeText={setPassword}
      />
      <Button title={'Iniciar sesion'} onPress={handleSubmit}/>

{/* Finalidad espaciadora */}
<View style={{ height: 5}} />
<View style={styles.inputContainer}>
</View>
      <Text style={styles.text1}> ¿Olvidaste tu contraseña? </Text>

{/* Finalidad espaciadora */}
<View style={{ height: 20 }} />
<View style={styles.inputContainer}>
</View>
   
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
    flexDirection: "colum",
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
