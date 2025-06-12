// LoginScreen.js

import React, { useState } from 'react';
import { View, StyleSheet, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, Card, ActivityIndicator, Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import axios from 'axios'; 

// ✅ URL da API definida diretamente no arquivo, como solicitado.
const API_URL = 'http://10.30.32.82:3000';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Toast.show({
        type: 'error',
        text1: 'Campos Obrigatórios',
        text2: 'Por favor, preencha e-mail e senha.',
      });
      return;
    }

    setLoading(true);

    try {
      // ✅ Usando axios com a URL completa definida acima.
      const response = await axios.post(`${API_URL}/users/login`, {
        user_email: email,
        user_senha: senha,
      });
      
      const { access_token, user } = response.data;

      if (access_token && user) {
        // Salva o token, os dados e a função do usuário
        await AsyncStorage.setItem('authToken', access_token);
        await AsyncStorage.setItem('userData', JSON.stringify(user));
        
        if (user.role) {
          await AsyncStorage.setItem('userRole', user.role);
        }
        
        Toast.show({
          type: 'success',
          text1: `Bem-vindo, ${user.name || 'Usuário'}!`,
        });
  
        navigation.replace('MainTabs');
      } else {
        throw new Error('Resposta de login incompleta do servidor.');
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'E-mail ou senha incorretos.';
      Toast.show({
        type: 'error',
        text1: 'Erro no Login',
        text2: errorMessage,
      });
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.iconContainer}>
              <Avatar.Image size={100} source={require('../Usuario/Icons/icons_user.png')} />
            </View>
            <Text style={styles.title}>Seja Bem-vindo</Text>

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              left={<TextInput.Icon icon="email-outline" />}
            />

            <TextInput
              label="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              style={styles.input}
              left={<TextInput.Icon icon="lock-outline" />}
            />

            {loading ? (
              <ActivityIndicator animating={true} style={styles.loader} size="large" />
            ) : (
              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
                labelStyle={{ fontSize: 16 }}
                icon="login"
              >
                Entrar
              </Button>
            )}

            <Button
              mode="text"
              onPress={() => navigation.navigate('CadastroUsuarioScreen')}
              style={styles.registerLink}
            >
              Não tem conta? Cadastre-se
            </Button>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  card: { 
    borderRadius: 15, 
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardContent: {
    padding: 20,
  },
  iconContainer: { 
    alignItems: 'center', 
    marginBottom: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 24, 
    color: '#333' 
  },
  input: { 
    marginBottom: 16, 
    backgroundColor: '#fff' 
  },
  button: { 
    marginTop: 12,
    paddingVertical: 6,
    borderRadius: 30
  },
  loader: { 
    marginVertical: 20 
  },
  registerLink: { 
    marginTop: 16 
  },
});

export default LoginScreen;
