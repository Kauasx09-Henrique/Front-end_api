import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import React from 'react';


import HomeScreen from './Screen/HomeScreen.jsx';
import EscolhaLoginScreen from './Screen/Usuario/User_escolha.jsx';

// CLinica
import Marcarconsulta from './Screen/Marcarconsulta.jsx';
import CadastroClinicaScreen from './Screen/Clinica/CadastroclinicaScreen.jsx';


// Usuario 

import LoginScreen from './Screen/Usuario/LoginScreen.jsx';
import CadastroUsuarioScreen from './Screen/Usuario/CadastroUsuarioScreen.jsx';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Clínicas Disponíveis' }} />

        <Stack.Screen
          name="EscolhaLoginScreen"
          component={EscolhaLoginScreen}
          options={{ title: 'Criar Conta' }} />
        <Stack.Screen
          name="Marcarconsulta"
          component={Marcarconsulta}
          options={{ title: 'Marcar Consulta' }} />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Fazer Login' }} />
        <Stack.Screen
          name="CadastroClinica"
          component={CadastroClinicaScreen}
          options={{ title: 'Cadastrar Clínica' }}
        />
        <Stack.Screen
          name='CadastroUsuarioScreen'
          component={CadastroUsuarioScreen}
          options={{ title: 'Cadastrar Usuario' }}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
}
