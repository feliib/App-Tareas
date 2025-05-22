import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
import SoloRegister from './screens/SoloRegister';
import { HomeScreen } from './screens/HomeScreen';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { TareaProvider } from './context/TareasContext';

const Stack = createStackNavigator();

const image = {uri: 'https://legacy.reactjs.org/logo-og.png'};

function AppNavigator(){
  const { status } = useContext(AuthContext)

  

return (
  
  <Stack.Navigator
  
  
    screenOptions={{
      cardStyle: {
        backgroundColor: 'white'
      }
    }}
  >
   
   {status !== 'authenticated' ? (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SoloRegister" component={SoloRegister} />
        </>
      ) : (
        <Stack.Screen name="Home" component={HomeScreen} />
        
      )}
    </Stack.Navigator>
  

  );
}


export default function App() {
  return (
   


<AuthProvider>
 <TareaProvider>

 <NavigationContainer>
   <AppNavigator />
 </NavigationContainer>

 </TareaProvider>
</AuthProvider>



  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
});




/* export default function App() {
  return (
<NavigationContainer>
  <Stack.Navigator initialRouteName='RegisterLogin'>
    <Stack.Screen name="RegisterLogin" component={RegisterLoginScreen}/>
    <Stack.Screen name="Home" component={HomeScreen}/>
  </Stack.Navigator>
  </NavigationContainer>
  );
} */