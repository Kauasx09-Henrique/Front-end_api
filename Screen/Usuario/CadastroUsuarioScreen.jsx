import React, { useState } from 'react';
import { View, Alert, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import axios from 'axios';

export default function CadastroUsuarioScreen({ navigation }) {
  const [form, setForm] = useState({
    user_nome: '',
    user_email: '',
    user_senha: '',
    user_data_nascimento: '',
    user_genero: '',
    user_telefone: '',
    user_cpf: '',
  });

  const handleChange = (field, value) => {
    setForm(prevForm => ({ ...prevForm, [field]: value }));
  };

  const handleSubmit = async () => {
    const dataToSend = {
      ...form,
      user_cpf: form.user_cpf.replace(/\D/g, ''),
      user_telefone: form.user_telefone.replace(/\D/g, ''),
      user_data_nascimento: new Date(form.user_data_nascimento),
    };

    try {
      const response = await axios.post('http://localhost:3000/users', dataToSend);
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar o usuário. Tente novamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Cadastro de Usuário</Text>

      <TextInput
        label="Nome"
        value={form.user_nome}
        onChangeText={text => handleChange('user_nome', text)}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Email"
        value={form.user_email}
        onChangeText={text => handleChange('user_email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Senha"
        value={form.user_senha}
        onChangeText={text => handleChange('user_senha', text)}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Data de Nascimento (AAAA-MM-DD)"
        value={form.user_data_nascimento}
        onChangeText={text => handleChange('user_data_nascimento', text)}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Gênero"
        value={form.user_genero}
        onChangeText={text => handleChange('user_genero', text)}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Telefone"
        value={form.user_telefone}
        onChangeText={text => handleChange('user_telefone', text)}
        keyboardType="phone-pad"
        style={styles.input}
        mode="outlined"
        maxLength={18}
      />

      <TextInput
        label="CPF"
        value={form.user_cpf}
        onChangeText={text => handleChange('user_cpf', text)}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
        maxLength={14}
      />

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Cadastrar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
});
