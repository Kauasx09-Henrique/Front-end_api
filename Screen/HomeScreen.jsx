import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Provider as PaperProvider,
  Modal,
  Portal,
  Button,
  FAB,
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

import api from '../src/services/api';

const HomeScreen = ({ navigation }) => {
  const [clinicas, setClinicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchClinicas = async () => {
    try {
      const response = await api.get('/clinica');
      setClinicas(response.data);
    } catch (e) {
      console.error('Erro ao buscar clínicas:', e);
      setError('Não foi possível carregar as clínicas. Verifique sua conexão.');
    }
  };

  // useFocusEffect para carregar os dados
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        try {
          const token = await AsyncStorage.getItem('authToken');
          const userRole = await AsyncStorage.getItem('userRole');

          if (token) {
            setIsLoggedIn(true);
            setIsAdmin(userRole === 'admin');
            const profileResponse = await api.get('/users/profile');
            setUser(profileResponse.data);
          } else {
            setIsLoggedIn(false);
            setUser(null);
            setIsAdmin(false);
          }
          await fetchClinicas();
        } catch (err) {
          if (err.response?.status === 401) {
            handleLogout(true); 
          } else {
             setError('Ocorreu um erro ao carregar os dados.');
          }
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }, [])
  );

  const handleLogout = async (isSilent = false) => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userData', 'userRole']);
      
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
      
      if (!isSilent) {
        Toast.show({ type: 'success', text1: 'Desconectado' });
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });

    } catch (e) {
      console.error('Falha ao fazer logout', e);
    }
  };
  
  const handleMarcarConsulta = (clinica) => {
    const clinicToPass = clinica || selectedClinic;
    if (!clinicToPass) return;

    if (isLoggedIn) {
      navigation.navigate('Marcarconsulta', { clinicaId: clinicToPass.id });
    } else {
      Toast.show({ type: 'info', text1: 'Login Necessário' });
      navigation.navigate('Login');
    }
  };
  
  const handleEditarClinica = (clinica) => {
    navigation.navigate('EditarClinica', { clinicaData: clinica });
  };

  const handleVerMais = (clinica) => {
    setSelectedClinic(clinica);
    setModalVisible(true);
  };
  
  const closeModal = () => setModalVisible(false);

  const renderAddress = (enderecos) => {
    if (!enderecos || enderecos.length === 0) {
      return <Text style={styles.addressText}>Endereço não informado</Text>;
    }
    return enderecos.map((endereco, index) => (
      <Text key={index} style={styles.addressText}>
        {`Nº ${endereco.endereco_numero_casa}, ${endereco.endereco_bairro} - CEP: ${endereco.endereco_cep} (${endereco.endereco_uf})`}
      </Text>
    ));
  };

  const renderClinicItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleVerMais(item)}>
      <View style={styles.card}>
        {item.logo_clinica && (
          <Image
            source={{ uri: item.logo_clinica }}
            style={styles.cardImage}
          />
        )}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.nome_clinica || 'Nome Indisponível'}</Text>
          <View style={styles.infoRow}>
            <Icon name="stethoscope" size={16} color="#666" />
            <Text style={styles.infoText}>{item.especialidade_consulta || 'Especialidade não informada'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="phone" size={16} color="#666" />
            <Text style={styles.infoText}>{item.telefone_clinica || 'Telefone não informado'}</Text>
          </View>
          <View style={styles.addressContainer}>
            <View style={styles.infoRow}>
              <Icon name="map-marker" size={16} color="#666" />
              <Text style={styles.addressTitle}>Endereço</Text>
            </View>
            {renderAddress(item.enderecos)}
          </View>
        </View>
        <View style={styles.cardActions}>
          <Button onPress={() => handleVerMais(item)}>Ver mais</Button>
          
          {isAdmin ? (
            <Button mode="contained" icon="pencil-outline" onPress={() => handleEditarClinica(item)}>
              Editar
            </Button>
          ) : (
            <Button mode="contained" onPress={() => handleMarcarConsulta(item)}>
              Marcar consulta
            </Button>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          {isLoggedIn && user ? (
            <View>
              <View style={styles.userGreeting}>
                <Text style={styles.greetingText}>Olá, {user.user_nome || 'Usuário'}!</Text>
                <Button icon="logout" mode="text" onPress={handleLogout} compact>Sair</Button>
              </View>
              {isAdmin && (
                <Text style={styles.adminBadge}>Modo Administrador</Text>
              )}
            </View>
          ) : (
            <Button mode="contained" onPress={() => navigation.navigate('Login')}>
              Fazer Login ou Cadastrar-se
            </Button>
          )}
        </View>

        <FlatList
          data={clinicas}
          renderItem={renderClinicItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={<Text style={styles.mainTitle}>Nossas Clínicas</Text>}
          ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>Nenhuma clínica encontrada.</Text>}
        />

        {isAdmin && (
          <FAB
            style={styles.fab}
            icon="plus"
            onPress={() => navigation.navigate('CadastroClinica')}
          />
        )}

        {selectedClinic && (
          <Portal>
            <Modal visible={modalVisible} onDismiss={closeModal} contentContainerStyle={styles.modalContainer}>
              <ScrollView>
                <Text style={styles.modalTitle}>{selectedClinic.nome_clinica}</Text>
                <Text style={styles.addressSectionTitle}>Endereços:</Text>
                {renderAddress(selectedClinic.enderecos)}
                <Button style={{marginTop: 20}} onPress={closeModal}>Fechar</Button>
              </ScrollView>
            </Modal>
          </Portal>
        )}
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { 
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  userGreeting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 10,
    color: '#102A43',
  },
  listContainer: { paddingBottom: 80, paddingHorizontal: 8 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 20,
    elevation: 4, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#555',
    marginLeft: 10,
    flexShrink: 1,
  },
  addressContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 4,
    paddingLeft: 26, 
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 9,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  addressSectionTitle: {
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    fontSize: 18,
  },
  adminBadge: {
    textAlign: 'center',
    marginTop: 8,
    color: '#007AFF',
    fontWeight: 'bold',
    backgroundColor: '#e7f3ff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    overflow: 'hidden',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
