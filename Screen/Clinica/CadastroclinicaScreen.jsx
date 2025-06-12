import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Card, ActivityIndicator, Text, Switch, Appbar, ProgressBar, MD3Colors } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { mask } from 'remask';
import axios from 'axios';

import api from '../../src/services/api'; 

const TOTAL_STEPS = 2;


const StepOne = ({
  nome, setNome,
  especialidade, setEspecialidade,
  cnpj, handleCnpjChange,
  telefone, handleTelefoneChange,
  logoUrl, setLogoUrl, 
  aceitaConvenios, setAceitaConvenios,
}) => (
  <>
    <Text style={styles.stepTitle}>Etapa 1: Dados da Clínica</Text>

 
    <TextInput label="URL da Logo (Opcional)" value={logoUrl} onChangeText={setLogoUrl} style={styles.input} mode="outlined"/>
    <TextInput label="Nome da Clínica" value={nome} onChangeText={setNome} style={styles.input} mode="outlined"/>
    <TextInput label="Especialidade Principal" value={especialidade} onChangeText={setEspecialidade} style={styles.input} mode="outlined"/>
    <TextInput label="CNPJ" value={cnpj} onChangeText={handleCnpjChange} keyboardType="numeric" style={styles.input} mode="outlined"/>
    <TextInput label="Telefone" value={telefone} onChangeText={handleTelefoneChange} keyboardType="phone-pad" style={styles.input} mode="outlined"/>
    <View style={styles.switchContainer}>
      <Text style={styles.switchLabel}>Aceita Convênios?</Text>
      <Switch value={aceitaConvenios} onValueChange={setAceitaConvenios} />
    </View>
  </>
);

const StepTwo = ({
  cep, setCep, cepLoading,
  bairro, setBairro,
  uf, setUf,
  numero, setNumero,
  complemento, setComplemento
}) => (
  <>
    <Text style={styles.stepTitle}>Etapa 2: Endereço</Text>
    <View>
      <TextInput label="CEP" value={cep} onChangeText={setCep} keyboardType="numeric" style={styles.input} mode="outlined" maxLength={9}/>
      {cepLoading && <ActivityIndicator style={{ marginVertical: -10, marginBottom: 10 }}/>}
    </View>
    <TextInput label="Bairro" value={bairro} onChangeText={setBairro} style={styles.input} mode="outlined"/>
    <TextInput label="UF" value={uf} onChangeText={setUf} style={styles.input} mode="outlined" maxLength={2}/>
    <TextInput label="Número" value={numero} onChangeText={setNumero} keyboardType="numeric" style={styles.input} mode="outlined"/>
    <TextInput label="Complemento (Opcional)" value={complemento} onChangeText={setComplemento} style={styles.input} mode="outlined"/>
  </>
);


export default function CadastroClinicaScreen({ navigation }) {

  const [nome, setNome] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [aceitaConvenios, setAceitaConvenios] = useState(false);
  const [logoUrl, setLogoUrl] = useState(''); 

  const [cep, setCep] = useState('');
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState('');
  const [uf, setUf] = useState('');
  const [complemento, setComplemento] = useState('');


  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [step, setStep] = useState(1);

 // faz um destaque para card 
  useEffect(() => {
    const fetchAddress = async () => {
      const unmaskedCep = cep.replace(/\D/g, '');
      if (unmaskedCep.length === 8) {
        setCepLoading(true);
        try {
          const { data } = await axios.get(`https://viacep.com.br/ws/${unmaskedCep}/json/`);
          if (!data.erro) {
            setBairro(data.bairro);
            setUf(data.uf);
            Toast.show({ type: 'success', text1: 'CEP encontrado!' });
          } else {
            Toast.show({ type: 'error', text1: 'CEP não encontrado.' });
          }
        } catch (error) {
          Toast.show({ type: 'error', text1: 'Erro ao buscar CEP.' });
        } finally {
          setCepLoading(false);
        }
      }
    };
    fetchAddress();
  }, [cep]);

  // Funções de máscara usando remask
  const handleCnpjChange = (text) => setCnpj(mask(text, ['99.999.999/9999-99']));
  const handleTelefoneChange = (text) => setTelefone(mask(text, ['(99) 9999-9999', '(99) 99999-9999']));

  const handleSubmit = async () => {
    if (!nome || !cep) {
      Toast.show({ type: 'error', text1: 'Preencha nome e CEP.' });
      return;
    }
    setLoading(true);

   
    const payload = {
      nome_clinica: nome,
      especialidade_consulta: especialidade,
      telefone_clinica: telefone.replace(/\D/g, ''),
      logo_clinica: logoUrl, 
      aceita_convenios: aceitaConvenios,
      enderecos: [{
        endereco_cep: cep.replace(/\D/g, ''),
        endereco_bairro: bairro,
        endereco_numero_casa: numero,
        endereco_uf: uf,
        endereco_complemento: complemento,
      }],
    };

    try {
      await api.post('/clinica', payload);
      Toast.show({ type: 'success', text1: 'Clínica cadastrada com sucesso!' });
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro no Cadastro',
        text2: error.response?.data?.message || 'Não foi possível cadastrar a clínica.',
      });
    } finally {
      setLoading(false);
    }
  };


  const handleNext = () => setStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Cadastrar Nova Clínica" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <ProgressBar progress={step / TOTAL_STEPS} color={MD3Colors.primary50} style={styles.progressBar} />
            
            {step === 1 ? (
              <StepOne
                nome={nome} setNome={setNome}
                especialidade={especialidade} setEspecialidade={setEspecialidade}
                cnpj={cnpj} handleCnpjChange={handleCnpjChange}
                telefone={telefone} handleTelefoneChange={handleTelefoneChange}
                aceitaConvenios={aceitaConvenios} setAceitaConvenios={setAceitaConvenios}
                logoUrl={logoUrl} setLogoUrl={setLogoUrl}
              />
            ) : (
              <StepTwo
                cep={cep} setCep={setCep} cepLoading={cepLoading}
                bairro={bairro} setBairro={setBairro}
                uf={uf} setUf={setUf}
                numero={numero} setNumero={setNumero}
                complemento={complemento} setComplemento={setComplemento}
              />
            )}

            <View style={styles.navigationButtons}>
              {step > 1 && <Button mode="outlined" onPress={handleBack}>Voltar</Button>}
              {step < TOTAL_STEPS ? (
                <Button mode="contained" onPress={handleNext} style={{ marginLeft: 'auto' }}>Avançar</Button>
              ) : (
                <Button mode="contained" onPress={handleSubmit} icon="check-circle" loading={loading} disabled={loading} style={{ marginLeft: 'auto' }}>
                  Finalizar Cadastro
                </Button>
              )}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 16, backgroundColor: '#f0f2f5' },
  card: { borderRadius: 12 },
  progressBar: { marginBottom: 20 },
  stepTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { marginBottom: 16 },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  switchLabel: { fontSize: 16 },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
});
