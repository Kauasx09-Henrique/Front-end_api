import React, { useState, useEffect } from 'react';
import { Image, View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importe suas telas
import HomeScreen from './Screen/HomeScreen.jsx';
import EscolhaLoginScreen from './Screen/Usuario/User_escolha.jsx';
import CadastroClinicaScreen from './Screen/Clinica/CadastroclinicaScreen.jsx';
import LoginScreen from './Screen/Usuario/LoginScreen.jsx';
import CadastroUsuarioScreen from './Screen/Usuario/CadastroUsuarioScreen.jsx';
import EditarClinicaScreen from './Screen/Clinica/EditarClinicaScreen.jsx';
import UserListScreen from './Screen/Admin/UserListScreen.jsx';
import EditUserScreen from './Screen/Admin/EditUserScreen.jsx';
import EditMyProfileScreen from './Screen/Usuario/EditMyProfileScreen.jsx';
import MyConsultationsScreen from './Screen/consulta/MyConsultasScreen.jsx';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function LogoTitle() {
  return <Image source={require('./assets/Logo_app.png')} style={{ width: 140, height: 40, resizeMode: 'contain' }} />;
}

// ====================================================================
// NAVEGADORES INDIVIDUAIS
// ====================================================================

function PublicTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: () => <LogoTitle />,
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = route.name === 'Home' 
            ? (focused ? 'home' : 'home-outline')
            : (focused ? 'log-in' : 'log-in-outline');
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="EscolhaLogin" component={EscolhaLoginScreen} options={{ tabBarLabel: 'Entrar' }} />
    </Tab.Navigator>
  );
}

function AdminTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: () => <LogoTitle />,
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = route.name === 'HomeAdmin'
            ? (focused ? 'home-sharp' : 'home-outline')
            : (focused ? 'people-sharp' : 'people-outline');
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeAdmin" component={HomeScreen} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="UserManagement" component={UserListScreen} options={{ tabBarLabel: 'Usuários' }} />
    </Tab.Navigator>
  );
}

function UserDrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false, // O cabeçalho será gerenciado por cada tela
      }}
    >
      <Drawer.Screen 
        name="DrawerHome" 
        component={HomeScreen} 
        options={{ title: 'Início', drawerIcon: ({color, size}) => <Ionicons name="home-outline" color={color} size={size}/> }} 
      />
      <Drawer.Screen 
        name="MyConsultations" 
        component={MyConsultationsScreen} 
        options={{ title: 'Minhas Consultas', drawerIcon: ({color, size}) => <Ionicons name="calendar-outline" color={color} size={size}/> }} 
      />
      <Drawer.Screen 
        name="EditMyProfile" 
        component={EditMyProfileScreen} 
        options={{ title: 'Meu Perfil', drawerIcon: ({color, size}) => <Ionicons name="person-circle-outline" color={color} size={size}/> }} 
      />
    </Drawer.Navigator>
  );
}


// ====================================================================
// EXPORTAÇÃO PRINCIPAL DO APP - COM LÓGICA DE NAVEGAÇÃO CORRIGIDA
// ====================================================================
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRouteName, setInitialRouteName] = useState('Public');

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const role = await AsyncStorage.getItem('userRole');
        
        if (token) {
          setInitialRouteName(role === 'admin' ? 'Admin' : 'User');
        } else {
          setInitialRouteName('Public');
        }
      } catch (e) {
        setInitialRouteName('Public');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large"/></View>;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRouteName}>
          {/* GRUPOS DE TELAS CONDICIONAIS */}
          <Stack.Screen name="Public" component={PublicTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Admin" component={AdminTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="User" component={UserDrawerNavigator} options={{ headerShown: false }} />
          
          {/* TELAS GLOBAIS - Acessíveis de qualquer lugar */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Marcarconsulta" component={MyConsultationsScreen} />
          <Stack.Screen name="CadastroClinica" component={CadastroClinicaScreen} />
          <Stack.Screen name="CadastroUsuarioScreen" component={CadastroUsuarioScreen}/>
          <Stack.Screen name="EditarClinica" component={EditarClinicaScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EditUserScreen" component={EditUserScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})