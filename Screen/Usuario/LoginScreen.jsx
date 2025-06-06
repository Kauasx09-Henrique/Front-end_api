import React, { useState } from 'react';
// 1. Importe o 'Alert' do react-native
import { View, StyleSheet, Text, Alert } from 'react-native';
import { TextInput, Button, Card, ActivityIndicator, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:3000/users/login'; // Ajuste sua API

  const inserirDados = async (user) => {
    try {
      await AsyncStorage.setItem('userId', user.id.toString());
      await AsyncStorage.setItem('userNome', user.user_email);
    } catch (e) {
      console.error('Falha ao salvar dados no AsyncStorage', e);
      // Usando o Alert nativo para o erro
      Alert.alert('Atenção', 'Não foi possível salvar sua sessão. Você poderá ter que fazer login novamente.');
    }
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      // 2. Substituindo a chamada de alerta
      Alert.alert('Campos Obrigatórios', 'Por favor, preencha e-mail e senha.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: email, user_senha: senha }),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Para sucesso, um alerta pode ser um pouco intrusivo, mas funciona.
        Alert.alert('Login Realizado!', 'Bem-vindo(a) de volta!');
        
        await inserirDados(responseData.user);
        navigation.replace('Home');

      } else {
        Alert.alert('Erro no Login', responseData.message || 'E-mail ou senha inválidos.');
      }
    } catch (error) {
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua rede e o endereço da API.');
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
   
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.iconContainer}>
          <Avatar.Image size={120} source={require('./Icons/icons_user.png')} />
          </View>
          <Text style={styles.title}>Login</Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
          />

          {loading ? (
            <ActivityIndicator animating={true} color={styles.colors.primary} style={styles.loader} />
          ) : (
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
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
  );
};

// ... (seus estilos continuam os mesmos)
export default LoginScreen;

const styles = StyleSheet.create({
  colors: {
    primary: '#007bff',
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#333',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  card: {
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    backgroundColor: '#ffffff',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
  },
  loader: {
    marginVertical: 20,
  },
  registerLink: {
    marginTop: 15,
  },
});