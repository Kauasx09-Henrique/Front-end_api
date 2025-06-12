import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Alert } from 'react-native';
import {
  Appbar,
  List,
  Button,
  ActivityIndicator,
  Text,
  Divider,
  Provider as PaperProvider,
} from 'react-native-paper';

// --- Constantes de Configuração ---
// É uma boa prática manter estas constantes consistentes em todo o app.
const API_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'adm@gmail.com'; 

const COLORS = {
  primary: '#007bff',
  white: '#fff',
  error: '#dc3545',
  edit: '#E69B00', // Um laranja/dourado para edição
  text: '#212529',
  lightGray: '#f8f9fa',
};

const AdminUsuarioScreen = ({ navigation }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Função para buscar os usuários na API, otimizada com useCallback
  const buscarUsuarios = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      // Ajuste este endpoint se o da sua API for diferente
      const res = await fetch(`${API_URL}/user/users`);
      if (!res.ok) throw new Error('Falha ao carregar a lista de usuários.');
      
      const data = await res.json();
      // Filtra para garantir que não haja itens nulos na lista
      setUsuarios(data.filter(u => u && u.id));
    } catch (err) {
      setErro(err.message || 'Ocorreu um erro ao buscar os dados.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca os dados quando o componente é montado
  useEffect(() => {
    buscarUsuarios();
  }, [buscarUsuarios]);

  // Função para navegar para a tela de edição de usuário (precisa ser criada)
  const handleEditarUsuario = (usuario) => {
    navigation.navigate('EditarUsuarioScreen', { usuarioId: usuario.id });
  };

  // Função para excluir um usuário com diálogo de confirmação
  const handleExcluirUsuario = (usuario) => {
    // Impede que o administrador se auto-exclua desta tela
    if (usuario.email_usuario === ADMIN_EMAIL) {
      Alert.alert("Ação Inválida", "A conta de administrador não pode ser excluída aqui.");
      return;
    }

    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir o usuário "${usuario.nome_usuario}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            // ** Lógica para chamar a API e deletar o usuário **
            // try {
            //   const res = await fetch(`${API_URL}/user/users/${usuario.id}`, { method: 'DELETE' });
            //   if (!res.ok) throw new Error('Falha ao excluir');
            //   // Remove o usuário da lista local para feedback imediato
            //   setUsuarios(prevUsuarios => prevUsuarios.filter(u => u.id !== usuario.id));
            //   Alert.alert("Sucesso", "Usuário excluído.");
            // } catch (error) {
            //   Alert.alert("Erro", "Não foi possível excluir o usuário.");
            // }
            
            // Para demonstração, remove o usuário da lista local
            setUsuarios(prevUsuarios => prevUsuarios.filter(u => u.id !== usuario.id));
          },
        },
      ]
    );
  };

  // Componente para renderizar cada item da lista de usuários
  const renderItemUsuario = ({ item }) => (
    <List.Item
      title={item.nome_usuario}
      description={item.email_usuario}
      titleStyle={styles.title}
      descriptionStyle={styles.description}
      left={props => <List.Icon {...props} icon="account-circle" color={COLORS.primary} />}
      right={() => (
        <View style={styles.buttonContainer}>
          <Button
            icon="pencil-outline"
            onPress={() => handleEditarUsuario(item)}
            textColor={COLORS.edit}
            compact // Deixa o botão menor
            labelStyle={styles.buttonLabel}
          />
          <Button
            icon="delete-outline"
            onPress={() => handleExcluirUsuario(item)}
            textColor={COLORS.error}
            compact
            labelStyle={styles.buttonLabel}
          />
        </View>
      )}
    />
  );
  
  // --- Renderização condicional para Loading e Erro ---
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando usuários...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <PaperProvider>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Erro" />
        </Appbar.Header>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{erro}</Text>
          <Button mode="contained" onPress={buscarUsuarios}>Tentar Novamente</Button>
        </View>
      </PaperProvider>
    );
  }

  // --- Renderização principal da tela ---
  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <Appbar.Header elevated>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Gerenciar Usuários" />
        </Appbar.Header>
        
        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItemUsuario}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={usuarios.length === 0 && styles.listEmpty}
          ListEmptyComponent={() => (
              <View style={styles.centered}>
                <List.Icon icon="account-off-outline" size={50} color="#ccc" />
                <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
              </View>
          )}
        />
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.primary,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  description: {
    color: '#6c757d', // Cinza para descrição
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 18, // Aumenta o tamanho do ícone no botão
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 10,
    color: '#ccc',
    fontSize: 16,
  }
});

export default AdminUsuarioScreen;