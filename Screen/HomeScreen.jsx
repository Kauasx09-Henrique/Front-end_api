import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Provider as PaperProvider,
  Modal,
  Portal,
  Button,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// Substitua pelo IP real da sua máquina (exemplo abaixo)
const API_BASE_URL = 'http://192.168.x.x:3000';

const HomeScreen = ({ navigation }) => {
  const [clinicas, setClinicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [userNome, setUserNome] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Busca clínicas da API
  const fetchClinicas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/clinica`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na resposta da rede: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      setClinicas(data);
    } catch (e) {
      setError('Não foi possível carregar as clínicas. Verifique sua conexão e o IP da API.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadUserAndClinicas = async () => {
        setLoadingUser(true);
        setError(null);
        try {
          const nomeResult = await AsyncStorage.getItem('userNome');
          setUserNome(nomeResult);
          await fetchClinicas();
        } catch {
          setError('Erro ao carregar dados do usuário e clínicas.');
          setLoading(false);
        } finally {
          setLoadingUser(false);
        }
      };

      loadUserAndClinicas();
    }, [])
  );

  const usuarioEstaLogado = !!userNome;

  const handleVerMais = (clinica) => {
    setSelectedClinic(clinica);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedClinic(null);
  };

  const handleMarcarConsulta = (clinica) => {
    const clinicToPass = clinica || selectedClinic;
    if (!clinicToPass) return;

    if (usuarioEstaLogado) {
      navigation.navigate('ConsultaScreen', { clinicaId: clinicToPass.id });
    } else {
      navigation.navigate('EscolhaLoginScreen', {
        redirectTo: 'ConsultaScreen',
        clinicaId: clinicToPass.id,
      });
    }
  };

  const renderClinicItem = ({ item }) => {
    const logoUri = item.logo_clinica
      ? `${API_BASE_URL}${item.logo_clinica}`
      : 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Logo';

    return (
      <Card style={styles.card}>
        <Card.Cover source={{ uri: logoUri }} />
        <Card.Content>
          <Title>{item.nome_clinica || 'Nome não disponível'}</Title>
          <Paragraph>
            Especialidade: {item.especialidade_consulta || 'Não informada'}
          </Paragraph>
          <Paragraph>
            Telefone: {item.telefone_clinica || 'Não informado'}
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => handleVerMais(item)}>Ver mais</Button>
          <Button onPress={() => handleMarcarConsulta(item)}>Marcar consulta</Button>
        </Card.Actions>
      </Card>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="store-remove-outline" size={60} color="#888" />
      <Text style={styles.emptyText}>Nenhuma clínica encontrada.</Text>
      <Text style={styles.emptySubText}>Tente cadastrar uma nova clínica.</Text>
    </View>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        {loadingUser ? (
          <ActivityIndicator size="small" color="#007bff" />
        ) : (
          <View style={styles.userGreeting}>
            {usuarioEstaLogado ? (
              <>
                <MaterialCommunityIcons name="account-circle" size={36} color="#007bff" />
                <Text style={styles.greetingText}>Olá, {userNome}!</Text>
              </>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate('EscolhaLoginScreen')}>
                <Text style={styles.loginPrompt}>
                  Faça login ou cadastre-se para aproveitar mais recursos.
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.header}>
          <Text style={styles.title}>Nossas Clínicas 🏥</Text>
          <Button
            icon="plus-circle"
            mode="contained"
            onPress={() => navigation.navigate('CadastroClinica')}
            style={styles.cadastroButton}
          >
            Cadastrar Clínica
          </Button>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#007bff" />
        ) : error ? (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#c0392b" />
            <Text style={styles.errorText}>{error}</Text>
            <Button mode="outlined" onPress={fetchClinicas}>
              Tentar novamente
            </Button>
          </View>
        ) : (
          <FlatList
            data={clinicas}
            renderItem={renderClinicItem}
            keyExtractor={(item, index) => item.id?.toString() || `clinica-${index}`}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyComponent}
          />
        )}

        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={closeModal}
            contentContainerStyle={styles.modalContainer}
          >
            {selectedClinic && (
              <ScrollView>
                <Image
                  source={{
                    uri: selectedClinic.logo_clinica
                      ? `${API_BASE_URL}${selectedClinic.logo_clinica}`
                      : 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Logo',
                  }}
                  style={styles.modalImage}
                />
                <Title style={styles.modalTitle}>{selectedClinic.nome_clinica}</Title>
                <Paragraph>
                  <Text style={styles.bold}>Especialidade:</Text>{' '}
                  {selectedClinic.especialidade_consulta || 'Não informada'}
                </Paragraph>
                <Paragraph>
                  <Text style={styles.bold}>Telefone:</Text> {selectedClinic.telefone_clinica || 'Não informado'}
                </Paragraph>
                <Paragraph><Text style={styles.bold}>Email:</Text> {selectedClinic.email_clinica || 'Não informado'}</Paragraph>
                <Paragraph><Text style={styles.bold}>CNPJ:</Text> {selectedClinic.cnpj_clinica || 'Não informado'}</Paragraph>
                <Paragraph>
                  <Text style={styles.bold}>Aceita Convênios:</Text>{' '}
                  {typeof selectedClinic.aceita_convenios === 'boolean'
                    ? selectedClinic.aceita_convenios ? 'Sim' : 'Não'
                    : 'Não informado'}
                </Paragraph>

                <View style={{ marginTop: 20 }}>
                  <Title style={{ fontSize: 18 }}>Endereços:</Title>
                  {selectedClinic.enderecos && selectedClinic.enderecos.length > 0 ? (
                    selectedClinic.enderecos.map((endereco) => (
                      <View key={endereco.id} style={styles.addressBox}>
                        <Text>
                          {endereco.endereco_bairro}, Nº {endereco.endereco_numero_casa}
                          {endereco.endereco_complemento ? `, ${endereco.endereco_complemento}` : ''}
                        </Text>
                        <Text>
                          {endereco.endereco_uf}, CEP: {endereco.endereco_cep}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text>Sem endereços cadastrados.</Text>
                  )}
                </View>

                <Button
                  mode="contained"
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  Fechar
                </Button>
              </ScrollView>
            )}
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f2f5',
  },
  header: {
    marginBottom: 16,
  },
  userGreeting: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
  },
  greetingText: {
    fontSize: 18,
    marginLeft: 8,
    color: '#333',
    fontWeight: '500',
  },
  loginPrompt: {
    fontSize: 16,
    color: '#0056b3',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 10,
  },
  cadastroButton: {
    borderRadius: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: '85%',
  },
  modalImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    borderRadius: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  addressBox: {
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#c0392b',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    color: '#555',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
  },
});

export default HomeScreen;
