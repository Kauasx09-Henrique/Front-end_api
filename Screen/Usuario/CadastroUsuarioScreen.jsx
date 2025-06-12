import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { TextInput, Button, Text, RadioButton, HelperText, Appbar, Card } from 'react-native-paper';
import { mask } from 'remask';
import Toast from 'react-native-toast-message';

import api from '../../src/services/api'; 

const MASKS = {
  cpf: '999.999.999-99',
  telefone: ['(99) 9999-9999', '(99) 9 9999-9999'],
  dataNascimento: '99/99/9999',
};

export default function CadastroUsuarioScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [genero, setGenero] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

// validaçoes 
  const validate = () => {
    const newErrors = {};

    const validationRules = [
      { field: 'nome', condition: !nome.trim(), message: 'Nome é obrigatório' },
      { field: 'email', condition: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), message: 'E-mail inválido' },
      { field: 'senha', condition: senha.length < 6, message: 'A senha deve ter no mínimo 6 caracteres' },
      { field: 'confirmarSenha', condition: senha !== confirmarSenha, message: 'As senhas não conferem' },
      { field: 'cpf', condition: cpf.replace(/\D/g, '').length !== 11, message: 'CPF inválido' },
      { field: 'telefone', condition: telefone.replace(/\D/g, '').length < 11, message: 'Telefone inválido' },
      { field: 'genero', condition: !genero, message: 'Selecione um gênero' },
      { field: 'dataNascimento', condition: dataNascimento.length !== 10, message: 'Data de nascimento inválida' },
    ];

    validationRules.forEach(({ field, condition, message }) => {
      if (condition) {
        newErrors[field] = message;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Toast.show({
        type: 'error',
        text1: 'Ops!',
        text2: 'Por favor, corrija os erros no formulário.',
      });
      return;
    }

    setLoading(true);

    const payload = {
      user_nome: nome,
      user_email: email,
      user_senha: senha,
      user_genero: genero,
      user_telefone: telefone.replace(/\D/g, ''),
      user_cpf: cpf.replace(/\D/g, ''),
      user_data_nascimento: dataNascimento,
    };

    try {
      await api.post('/users', payload);
      
      Toast.show({
        type: 'success',
        text1: 'Cadastro realizado!',
        text2: `Bem-vindo, ${nome}!`,
      });
      
      navigation.goBack();
    } catch (err) {
      console.error('Erro no cadastro:', err.response?.data || err.message);
      Toast.show({
        type: 'error',
        text1: 'Erro no Cadastro',
        text2: err.response?.data?.message || 'Não foi possível completar o cadastro.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Criar Nova Conta" />
      </Appbar.Header>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                label="Nome completo"
                value={nome}
                onChangeText={setNome}
                error={!!errors.nome}
                style={styles.input}
                mode="outlined"
              />
              {errors.nome && <HelperText type="error">{errors.nome}</HelperText>}

              <TextInput
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!errors.email}
                style={styles.input}
                mode="outlined"
              />
              {errors.email && <HelperText type="error">{errors.email}</HelperText>}

              <TextInput
                label="Senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={secureTextEntry}
                error={!!errors.senha}
                style={styles.input}
                mode="outlined"
                right={<TextInput.Icon icon={secureTextEntry ? 'eye-off' : 'eye'} onPress={() => setSecureTextEntry(!secureTextEntry)}/>}
              />
              {errors.senha && <HelperText type="error">{errors.senha}</HelperText>}

              <TextInput
                label="Confirmar senha"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry={secureTextEntry}
                error={!!errors.confirmarSenha}
                style={styles.input}
                mode="outlined"
              />
              {errors.confirmarSenha && <HelperText type="error">{errors.confirmarSenha}</HelperText>}
              
              <TextInput
                label="CPF"
                value={cpf}
                onChangeText={v => setCpf(mask(v, MASKS.cpf))}
                keyboardType="numeric"
                maxLength={14} 
                error={!!errors.cpf}
                style={styles.input}
                mode="outlined"
              />
              {errors.cpf && <HelperText type="error">{errors.cpf}</HelperText>}

              <TextInput
                label="Telefone"
                value={telefone}
                onChangeText={v => setTelefone(mask(v, MASKS.telefone))}
                keyboardType="phone-pad"
                maxLength={18}
                error={!!errors.telefone}
                style={styles.input}
                mode="outlined"
              />
              {errors.telefone && <HelperText type="error">{errors.telefone}</HelperText>}

              <TextInput
                label="Data de nascimento"
                value={dataNascimento}
                onChangeText={v => setDataNascimento(mask(v, MASKS.dataNascimento))}
                keyboardType="numeric"
                placeholder="DD/MM/AAAA"
                maxLength={10} 
                error={!!errors.dataNascimento}
                style={styles.input}
                mode="outlined"
              />
              {errors.dataNascimento && <HelperText type="error">{errors.dataNascimento}</HelperText>}

              <Text style={styles.label}>Gênero</Text>
              <RadioButton.Group onValueChange={setGenero} value={genero}>
                <View style={styles.radioGroup}>
                  <View style={styles.radioItem}><RadioButton value="Masculino" /><Text>Masculino</Text></View>
                  <View style={styles.radioItem}><RadioButton value="Feminino" /><Text>Feminino</Text></View>
                  <View style={styles.radioItem}><RadioButton value="Outro" /><Text>Outro</Text></View>
                </View>
              </RadioButton.Group>
              {errors.genero && <HelperText type="error" style={{marginTop: -10}}>{errors.genero}</HelperText>}

              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                style={styles.button}
                labelStyle={styles.buttonLabel}
                icon="account-plus"
              >
                {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f0f2f5'
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40
  },
  card: {
    borderRadius: 12,
  },
  input: {
    marginTop: 12,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    color: '#333'
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
  }
});
