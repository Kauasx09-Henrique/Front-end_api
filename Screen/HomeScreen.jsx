import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';

import {
  Provider as PaperProvider,
  Modal,
  Portal,
  Button,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  const [clinicas, setClinicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);

  
  const usuarioEstaLogado = false;

  const API_URL = 'http://localhost:3000/clinica';

  useEffect(() => {
    const fetchClinicas = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }
        const data = await response.json();
        setClinicas(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClinicas();
  }, []);

  const handleVerMais = (clinica) => {
    setSelectedClinic(clinica);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedClinic(null);
  };

  // Função para tratar o botão Marcar Consulta
  const handleMarcarConsulta = (clinica) => {
    if (usuarioEstaLogado) {
      // Se estiver logado, vai para a tela de marcação de consulta
      navigation.navigate('ConsultaScreen', { clinicaId: clinica.id });
    } else {
      // Se não estiver, vai para a tela de cadastro/login, pode passar a clínica para depois redirecionar
      navigation.navigate('CadastroScreen', { redirectTo: 'ConsultaScreen', clinicaId: clinica.id });
    }
  };

  const renderClinicItem = ({ item }) => {
    const logoUri = item.logo_clinica;
    const placeholderImage =
      'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Logo';

    return (
      <Card style={styles.card}>
        <Card.Cover source={{ uri: logoUri || placeholderImage }} />
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

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Nossas Clínicas 🏥</Text>
<Button
  mode="contained"
  onPress={() => navigation.navigate('Cadastro')}
  style={styles.cadastroButton}
>
  Ir para Cadastro
</Button>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : error ? (
          <Text>Erro: {error}</Text>
        ) : (
          <FlatList
            data={clinicas}
            renderItem={renderClinicItem}
            keyExtractor={(item, index) =>
              item.cnpj_clinica || item.id?.toString() || `clinica-${index}`
            }
            contentContainerStyle={styles.listContainer}
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
                    uri:
                      selectedClinic.logo_clinica ||
                      'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Logo',
                  }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedClinic.nome_clinica}</Text>
                <Text>
                  Especialidade:{' '}
                  {selectedClinic.especialidade_consulta || 'Não informada'}
                </Text>
                <Text>
                  Telefone: {selectedClinic.telefone_clinica || 'Não informado'}
                </Text>
                <Text>Email: {selectedClinic.email_clinica || 'Não informado'}</Text>
                <Text>CNPJ: {selectedClinic.cnpj_clinica || 'Não informado'}</Text>
                <Text>
                  Aceita Convênios:{' '}
                  {typeof selectedClinic.aceita_convenios === 'boolean'
                    ? selectedClinic.aceita_convenios
                      ? 'Sim'
                      : 'Não'
                    : 'Não informado'}
                </Text>

                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Endereços:</Text>
                  {selectedClinic.enderecos && selectedClinic.enderecos.length > 0 ? (
                    selectedClinic.enderecos.map((endereco, index) => (
                      <Text key={index} style={{ marginBottom: 5 }}>
                        {endereco.endereco_bairro}, Nº {endereco.endereco_numero_casa},{' '}
                        {endereco.endereco_complemento}, {endereco.endereco_uf}, CEP:{' '}
                        {endereco.endereco_cep}
                      </Text>
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
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
  },
});

export default HomeScreen;
