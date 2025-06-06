import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button, Card, ActivityIndicator, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const API_URL = 'http://localhost:3000/users/login';


  const inserirDados = async (user) => {
    await AsyncStorage.setItem('userId', user.id);
    await AsyncStorage.setItem('userNome', user.user_email);
  }

  const handleLogin = async () => {
    if (!email || !senha) {
      alert('Campos obrigatórios', 'Por favor, preencha email e senha.');
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
      // console.log(responseData.user)
      if (response.ok) {

        setSnackbarVisible(true);

        setTimeout(() => {
          setSnackbarVisible(false);
          navigation.replace('Home');
        }, 1500);
        inserirDados(responseData.user)
      } else {
        alert('Erro', responseData.message || 'Email ou senha inválidos.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="account-circle" size={80} color="#007bff" />
          </View>
          <Text style={styles.title}>Login</Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon name="email" />}
          />

          <TextInput
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            style={styles.input}
            left={<TextInput.Icon name="lock" />}
          />

          {loading ? (
            <ActivityIndicator animating={true} color="#007bff" style={styles.loader} />
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

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={1500}
        style={{ backgroundColor: '#28a745' }}
      >
        Login realizado com sucesso!
      </Snackbar>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
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
    backgroundColor: '#fff',
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
