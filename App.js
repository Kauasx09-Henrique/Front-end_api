import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';


import Toast from 'react-native-toast-message';

import HomeScreen from './Screen/HomeScreen.jsx';
import EscolhaLoginScreen from './Screen/Usuario/User_escolha.jsx';

// Clínica
import Marcarconsulta from './Screen/Marcar_consulta/Marcarconsulta.jsx';
import CadastroClinicaScreen from './Screen/Clinica/CadastroclinicaScreen.jsx';

// Usuário
import LoginScreen from './Screen/Usuario/LoginScreen.jsx';
import CadastroUsuarioScreen from './Screen/Usuario/CadastroUsuarioScreen.jsx';

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{
    headerTitle: () => (
      <Image
        source={require('./assets/Logo_app.png')}
        style={{ width: 150, height: 50, resizeMode: 'contain' }}
      />
    ),
    headerTitleAlign: 'right',
  }}
/>
          <Stack.Screen
            name="EscolhaLoginScreen"
            component={EscolhaLoginScreen}
            options={{ title: 'Opção Escolha' }}
          />
          <Stack.Screen
            name="Marcarconsulta"
            component={Marcarconsulta}
            options={{ title: 'Marcar Consulta' }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Fazer Login' }}
          />
          <Stack.Screen
            name="CadastroClinica"
            component={CadastroClinicaScreen}
            options={{ title: 'Cadastrar Clínica' }}
          />
          <Stack.Screen
            name="CadastroUsuarioScreen"
            component={CadastroUsuarioScreen}
            options={{ title: 'Cadastrar Usuário' }}
            
          />
        </Stack.Navigator>
      </NavigationContainer>
      
     <Toast /> 
    </>
  );
}
