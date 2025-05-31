import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../Screen/HomeScreen.jsx';
import LoginScreen from '../Screen/LoginScreen.jsx'; // Adicione esta linha se LoginScreen estiver em um arquivo similar

import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name='HomeSreen' 
        component={HomeScreen}
        options={{
          title: "Inicio",
          drawerIcon: ({ color, size }) => <Ionicons name='home-outline' color={color} size={size} /> 
        }}
      />

      <Drawer.Screen
        name='Login'
        component={LoginScreen} 
        options={{
          title: "Login",
          drawerIcon: ({ color, size }) => <Ionicons name='log-in-outline' color={color} size={size} /> 
        }}
      />
    </Drawer.Navigator>
  );
}
