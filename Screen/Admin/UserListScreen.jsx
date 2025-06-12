import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Avatar, Button, Card, IconButton, Menu } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import api from '../../src/services/api'; // Ajuste o caminho conforme sua estrutura

const UserListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState({});

  const fetchUsers = async () => {
    try {
      // Usando a rota do seu backend que busca todos os usuários
      const response = await api.get('/users/dados');
      setUsers(response.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao buscar usuários',
        text2: error.response?.data?.message || 'Não foi possível carregar a lista.',
      });
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect garante que a lista seja recarregada sempre que a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchUsers();
    }, [])
  );

  const handleDelete = (userId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/users/${userId}`);
              Toast.show({ type: 'success', text1: 'Usuário deletado com sucesso!' });
              // Atualiza a lista removendo o usuário deletado
              setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
            } catch (error) {
              Toast.show({ type: 'error', text1: 'Erro ao deletar.' });
            }
          },
        },
      ]
    );
  };

  const handleEdit = (user) => {
    // Navega para a tela de edição, passando os dados do usuário
    navigation.navigate('EditUserScreen', { userData: user });
  };
  
  const renderUserItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.user_nome}
        subtitle={item.user_email}
        left={(props) => <Avatar.Icon {...props} icon={item.role === 'admin' ? 'shield-crown' : 'account'} />}
        right={(props) => (
           <IconButton {...props} icon="dots-vertical" onPress={() => handleEdit(item)} />
        )}
      />
      <Card.Content>
         <View style={styles.infoRow}>
            <Text style={styles.roleText}>Função: {item.role}</Text>
         </View>
      </Card.Content>
       <Card.Actions>
            <Button icon="pencil" onPress={() => handleEdit(item)}>Editar</Button>
            <Button 
                icon="delete" 
                textColor={'red'}
                onPress={() => handleDelete(item.id)}>Deletar
            </Button>
       </Card.Actions>
    </Card>
  );

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.title}>Gerenciamento de Usuários</Text>}
        ListEmptyComponent={<Text style={styles.centeredText}>Nenhum usuário encontrado.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centeredText: { textAlign: 'center', marginTop: 50 },
  list: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  roleText: { fontWeight: 'bold', color: '#555' },
});

export default UserListScreen;
