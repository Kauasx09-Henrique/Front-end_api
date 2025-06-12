import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Card, ActivityIndicator, Text, Switch, Appbar, ProgressBar, MD3Colors } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import api from '../../src/services/api'; // Ajuste o caminho conforme sua estrutura

const TOTAL_STEPS = 2; // Total de etapas no formulário react native paper

const EditarClinicaScreen = ({ route, navigation }) => {
  const { clinicaData } = route.params;

  // Estados dos dados da clínica
  const [nome, setNome] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [aceitaConvenios, setAceitaConvenios] = useState(false);
  
  // NOVO: Estado para os endereços
  const [addresses, setAddresses] = useState([]);

  // Estados de controle da UI
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Começa na etapa 1

  useEffect(() => {
    if (clinicaData) {
      // Popula os dados da clínica
      setNome(clinicaData.nome_clinica || '');
      setEspecialidade(clinicaData.especialidade_consulta || '');
      setTelefone(clinicaData.telefone_clinica || '');
      setAceitaConvenios(clinicaData.aceita_convenios || false);
      
      // Popula os endereços

      setAddresses(JSON.parse(JSON.stringify(clinicaData.enderecos || [])));
    }
  }, [clinicaData]);

  // Função para atualizar um campo específico de um endereço
  const handleAddressChange = (text, index, field) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index][field] = text;
    setAddresses(updatedAddresses);
  };
  
  const handleUpdate = async () => {
    if (!nome) {
      Toast.show({ type: 'error', text1: 'O nome da clínica é obrigatório.' });
      return;
    }
    setLoading(true);

    const payload = {
      nome_clinica: nome,
      especialidade_consulta: especialidade,
      telefone_clinica: telefone,
      aceita_convenios: aceitaConvenios,
     
      enderecos: addresses, 
    };

    try {
      await api.patch(`/clinica/${clinicaData.id}`, payload);
      Toast.show({ type: 'success', text1: 'Clínica atualizada com sucesso!' });
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao Atualizar',
        text2: error.response?.data?.message || 'Não foi possível salvar as alterações.',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Funções para navegar entre as etapas
  const handleNext = () => setStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  // Renderiza a etapa 1: Dados da Clínica
  const renderStepOne = () => (
    <>
      <Text style={styles.stepTitle}>Etapa 1: Dados da Clínica</Text>
      <TextInput label="Nome da Clínica" value={nome} onChangeText={setNome} style={styles.input} mode="outlined"/>
      <TextInput label="Especialidade Principal" value={especialidade} onChangeText={setEspecialidade} style={styles.input} mode="outlined"/>
      <TextInput label="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" style={styles.input} mode="outlined"/>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Aceita Convênios?</Text>
        <Switch value={aceitaConvenios} onValueChange={setAceitaConvenios} />
      </View>
    </>
  );

  // Renderiza a etapa 2: Endereços
  const renderStepTwo = () => (
    <>
      <Text style={styles.stepTitle}>Etapa 2: Endereços</Text>
      {addresses.map((addr, index) => (
        <View key={addr.id_endereco || index} style={styles.addressBox}>
          <Text style={styles.addressIndex}>Endereço {index + 1}</Text>
          <TextInput label="CEP" value={addr.endereco_cep} onChangeText={(text) => handleAddressChange(text, index, 'endereco_cep')} style={styles.input} mode="outlined" keyboardType="numeric"/>
          <TextInput label="Bairro" value={addr.endereco_bairro} onChangeText={(text) => handleAddressChange(text, index, 'endereco_bairro')} style={styles.input} mode="outlined"/>
          <TextInput label="Número" value={addr.endereco_numero_casa} onChangeText={(text) => handleAddressChange(text, index, 'endereco_numero_casa')} style={styles.input} mode="outlined"/>
          <TextInput label="UF" value={addr.endereco_uf} onChangeText={(text) => handleAddressChange(text, index, 'endereco_uf')} style={styles.input} mode="outlined" maxLength={2}/>
        </View>
      ))}
    </>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Editar Clínica" subtitle={clinicaData.nome_clinica} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <ProgressBar progress={step / TOTAL_STEPS} color={MD3Colors.primary50} style={styles.progressBar} />

            {step === 1 && renderStepOne()}
            {step === 2 && renderStepTwo()}

            <View style={styles.navigationButtons}>
              {step > 1 && (
                <Button mode="outlined" onPress={handleBack}>Voltar</Button>
              )}
              {step < TOTAL_STEPS ? (
                <Button mode="contained" onPress={handleNext} style={{marginLeft: 'auto'}}>Avançar</Button>
              ) : (
                <Button mode="contained" onPress={handleUpdate} icon="content-save-edit" loading={loading} disabled={loading} style={{marginLeft: 'auto'}}>
                  Salvar Alterações
                </Button>
              )}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  scrollContainer: { padding: 16 },
  card: { borderRadius: 12 },
  progressBar: { marginBottom: 20 },
  stepTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  input: { marginBottom: 16 },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  switchLabel: { fontSize: 16 },
  addressBox: {
    marginBottom: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  addressIndex: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16
  },
});

export default EditarClinicaScreen;
