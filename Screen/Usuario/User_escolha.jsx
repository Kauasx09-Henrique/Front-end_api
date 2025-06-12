import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const EscolhaLoginScreen = ({ navigation }) => {
  const handleLoginPress = () => {
    navigation.navigate('Login');
    Toast.show({
      type: 'success',
      text1: 'Sucesso',
      text2: 'Parabéns! Login selecionado com sucesso.',
      position: 'bottom',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.subtitle}>Como deseja prosseguir?</Text>

    
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons name="login" size={50} color="#007bff" />
          <Text style={styles.cardTitle}>Já tem uma conta?</Text>
          <Button
            mode="contained"
            style={[styles.button, { backgroundColor: '#007bff' }]}
            onPress={handleLoginPress}
          >
            Entrar
          </Button>
        </Card.Content>
      </Card>

  
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons name="account-plus" size={50} color="#28a745" />
          <Text style={styles.cardTitle}>Novo por aqui?</Text>
          <Button
            mode="contained"
            style={[styles.button, { backgroundColor: '#28a745' }]}
            onPress={() => navigation.navigate('CadastroUsuarioScreen')}
          >
            Cadastrar-se
          </Button>
        </Card.Content>
      </Card>

      {/* Componente do Toast */}
      <Toast />
    </View>
  );
};

export default EscolhaLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 3,
  },
  cardContent: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
  },
  button: {
    marginTop: 10,
    width: '80%',
  },
});
