import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './Screen/HomeScreen.jsx';
import CadastroScreen from './Screen/CadastroUsuario.jsx';
import Marcarconsulta from './Screen/Marcarconsulta.jsx'; // IMPORTAR o componente
import LoginScreen from './Screen/LoginScreen.jsx';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Clínicas Disponíveis' }}
        />
        <Stack.Screen
          name="Cadastro"
          component={CadastroScreen}
          options={{ title: 'Criar Conta' }}
        />
        <Stack.Screen
          name="Marcarconsulta" // Dê um nome válido para a rota
          component={Marcarconsulta}
          options={{ title: 'Marcar Consulta' }}
        />
         <Stack.Screen
          name="Login" 
          component={LoginScreen}
          options={{ title: 'Fazer Login ' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
