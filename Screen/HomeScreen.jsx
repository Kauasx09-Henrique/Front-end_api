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
  Avatar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const API_BASE_URL = 'http://localhost:3000/';

const palette = {
  primary: '#E53935', // vermelho tomate
  secondary: '#FFF3E0', // bege amarelado
  support: '#43A047', // verde ervas
  text: '#333333', // cinza grafite
  light: '#f1f1f1',
  error: '#dc3545',
};

const UserGreeting = ({ isLoading, isLoggedIn, userName, onLoginPress }) => {
  if (isLoading) {
    return <ActivityIndicator style={styles.userGreeting} size="small" color={palette.primary} />;
  }
  return (
    <View style={styles.userGreeting}>
      {isLoggedIn ? (
        <>
          <MaterialCommunityIcons name="account-circle" size={36} color={palette.primary} />
          <Text style={styles.greetingText}>Olá, {userName}!</Text>
        </>
      ) : (
        <TouchableOpacity onPress={onLoginPress}>
          <Text style={styles.loginPrompt}>
            Faça login ou cadastre-se para agendar consultas.
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const ClinicCard = ({ clinic, onSeeMore, onBookAppointment }) => {
  const logoUri = clinic.logo_clinica
    ? `${API_BASE_URL}${clinic.logo_clinica}`
    : 'https://via.placeholder.com/300/CCCCCC/FFFFFF?text=Logo';

  return (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: logoUri }} />
      <Card.Content>
        <Title>{clinic.nome_clinica || 'Nome não disponível'}</Title>
        <Text style={styles.textItem}>
          Especialidade: {clinic.especialidade_consulta || 'Não informada'}
        </Text>
        <Text style={styles.textItem}>
          Telefone: {clinic.telefone_clinica || 'Não informado'}
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => onSeeMore(clinic)}>Ver mais</Button>
        <Button onPress={() => onBookAppointment(clinic)}>Marcar consulta</Button>
      </Card.Actions>
    </Card>
  );
};

const ClinicDetailModal = ({ clinic, visible, onClose }) => {
  if (!clinic) return null;

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Title style={styles.modalTitle}>{clinic.nome_clinica}</Title>
          <Button mode="contained" style={styles.closeButton} onPress={onClose}>
            Fechar
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const ErrorDisplay = ({ error, onRetry }) => (
  <View style={styles.statusContainer}>
    <MaterialCommunityIcons name="alert-circle-outline" size={60} color={palette.error} />
    <Text style={styles.errorText}>{error}</Text>
    <Button mode="outlined" onPress={onRetry}>Tentar novamente</Button>
  </View>
);

const EmptyList = () => (
  <View style={styles.statusContainer}>
    <MaterialCommunityIcons name="store-remove-outline" size={60} color={palette.text} />
    <Text style={styles.emptyText}>Nenhuma clínica encontrada.</Text>
  </View>
);

const HomeScreen = ({ navigation }) => {
  const [clinicas, setClinicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [userNome, setUserNome] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchClinicas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/clinica`);
      if (!response.ok) throw new Error('Falha ao carregar os dados.');
      const data = await response.json();
      setClinicas(data);
    } catch (e) {
      setError('Não foi possível carregar as clínicas.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoadingUser(true);
        try {
          const nome = await AsyncStorage.getItem('userNome');
          setUserNome(nome);
          await fetchClinicas();
        } catch {
          setError('Erro ao carregar dados do usuário.');
        } finally {
          setLoadingUser(false);
        }
      };
      loadData();
    }, [])
  );

  const handleMarcarConsulta = (clinica) => {
    const isLoggedIn = !!userNome;
    if (isLoggedIn) {
      navigation.navigate('ConsultaScreen', { clinicaId: clinica.id });
    } else {
      navigation.navigate('EscolhaLoginScreen', {
        redirectTo: 'ConsultaScreen',
        clinicaId: clinica.id,
      });
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Image source={{ uri: 'https://i.imgur.com/m6y8i2L.png' }} style={styles.logo} />
        <UserGreeting
          isLoading={loadingUser}
          isLoggedIn={!!userNome}
          userName={userNome}
          onLoginPress={() => navigation.navigate('EscolhaLoginScreen')}
        />

        <View style={styles.header}>
          <View style={styles.titleWrapper}>
            <Avatar.Image size={30} source={require('../assets/Logo_app.png')} />
            <Title style={styles.title}>Nossas Clínicas</Title>
          </View>
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
          <ActivityIndicator style={{ marginTop: 50 }} size="large" color={palette.primary} />
        ) : error ? (
          <ErrorDisplay error={error} onRetry={fetchClinicas} />
        ) : (
          <FlatList
            data={clinicas}
            renderItem={({ item }) => (
              <ClinicCard
                clinic={item}
                onSeeMore={setSelectedClinic}
                onBookAppointment={handleMarcarConsulta}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={EmptyList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}

        <ClinicDetailModal
          clinic={selectedClinic}
          visible={!!selectedClinic}
          onClose={() => setSelectedClinic(null)}
        />
      </View>
    </PaperProvider>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: palette.background,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  userGreeting: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    padding: 12,
    backgroundColor: palette.lightGray,
    borderRadius: 8,
  },
  greetingText: {
    fontSize: 18,
    marginLeft: 10,
    color: palette.textPrimary,
    fontWeight: '500',
  },
  loginPrompt: {
    fontSize: 16,
    color: palette.primary,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: palette.lightGray,
    paddingBottom: 16,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: palette.textPrimary,
  },
  icon: {
    width: 32,
    height: 32,
  },
  cadastroButton: {
    borderRadius: 20,
    alignSelf: 'center',
  },
  card: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
    backgroundColor: palette.surface,
  },
  textItem: {
    fontSize: 14,
    marginTop: 4,
    color: palette.textPrimary,
  },
  modalContainer: {
    backgroundColor: palette.surface,
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: palette.textPrimary,
  },
  closeButton: {
    marginTop: 20,
    borderRadius: 20,
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  errorText: {
    fontSize: 16,
    color: palette.error,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  emptyText: {
    fontSize: 18,
    color: palette.textSecondary,
    marginTop: 8,
  },
});


export default HomeScreen;
