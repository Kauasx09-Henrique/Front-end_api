import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';


export default function App() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/users/dados')
      .then(response => setDados(response.data))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#555" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lista de Usuários</Text>
      {dados.length === 0 ? (
        <Text style={styles.noDataText}>Nenhum usuário encontrado.</Text>
      ) : (
        dados.map(user => (
          <View key={user.id} style={styles.card}>
            <Text style={styles.userName}>{user.user_nome}</Text>
            <Text><Text style={styles.label}>Email:</Text> {user.user_email}</Text>
            <Text><Text style={styles.label}>Nascimento:</Text> {user.user_data_nascimento}</Text>
            <Text><Text style={styles.label}>Gênero:</Text> {user.user_genero}</Text>
            <Text><Text style={styles.label}>Telefone:</Text> {user.user_telefone}</Text>
            <Text><Text style={styles.label}>CPF:</Text> {user.user_cpf}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaeaea',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#555',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },
});
