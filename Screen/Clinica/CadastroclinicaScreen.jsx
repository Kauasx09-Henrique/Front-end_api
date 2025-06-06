import React, { useState, useEffect } from 'react';
import { View, Alert, ScrollView, Image, StyleSheet } from 'react-native';
import { TextInput, Text, Switch, Button, useTheme } from 'react-native-paper';
import axios from 'axios';
import { mask } from 'remask';

export default function CadastroClinicaScreen({ navigation }) {
  const theme = useTheme();

  const baseImageUrl = 'http://localhost:3000/clinica'; // ajuste para seu servidor

  const [form, setForm] = useState({
    nome_clinica: '',
    especialidade_consulta: '',
    cnpj_clinica: '',
    email_clinica: '',
    telefone_clinica: '',
    aceita_convenios: false,
    observacoes: '',
    logo_clinica_url: '',  
  });

  // URL da imagem para exibir no Image
  const [logoUrl, setLogoUrl] = useState('https://via.placeholder.com/150');

  useEffect(() => {

    if (form.logo_clinica_url) {
      setLogoUrl(baseImageUrl + form.logo_clinica_url);
    } else {
      setLogoUrl('https://via.placeholder.com/150');
    }
  }, [form.logo_clinica_url]);

  const handleChange = (field, value) => {
    let maskedValue = value;
    if (field === 'cnpj_clinica') {
      maskedValue = mask(value, ['99.999.999/9999-99']);
    } else if (field === 'telefone_clinica') {
      maskedValue = mask(value, ['(99) 9999-9999', '(99) 99999-9999']);
    }
    setForm(prev => ({ ...prev, [field]: maskedValue }));
  };

  const handleSubmit = async () => {
    const dataToSend = {
      ...form,
      cnpj_clinica: form.cnpj_clinica.replace(/\D/g, ''),
      telefone_clinica: form.telefone_clinica.replace(/\D/g, ''),
      logo_clinica: form.logo_clinica_url,
    };

    try {
      const serverURL = 'http://localhost:3000/clinica'; // IP do servidor na rede local

      await axios.post(serverURL, dataToSend);

      Alert.alert('Sucesso', 'Clínica cadastrada!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao cadastrar clínica.');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Cadastro de Clínica</Text>

      <TextInput
        label="Nome da Clínica"
        value={form.nome_clinica}
        onChangeText={text => handleChange('nome_clinica', text)}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Especialidade Principal"
        value={form.especialidade_consulta}
        onChangeText={text => handleChange('especialidade_consulta', text)}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="CNPJ"
        value={form.cnpj_clinica}
        onChangeText={text => handleChange('cnpj_clinica', text)}
        keyboardType="numeric"
        maxLength={18}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={form.email_clinica}
        onChangeText={text => handleChange('email_clinica', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Telefone"
        value={form.telefone_clinica}
        onChangeText={text => handleChange('telefone_clinica', text)}
        keyboardType="phone-pad"
        maxLength={15}
        mode="outlined"
        style={styles.input}
      />

      <View style={styles.switchRow}>
        <Text>Aceita Convênios?</Text>
        <Switch
          value={form.aceita_convenios}
          onValueChange={value => handleChange('aceita_convenios', value)}
          color={theme.colors.primary}
        />
      </View>

        <Text style={{ marginBottom: 8 }}>Logo da Clínica</Text>
      <View style={styles.logoContainer}>
        <Image source={{ uri: logoUrl }} style={styles.logoImage} />
      </View>

      <TextInput
        label="Observações"
        value={form.observacoes}
        onChangeText={text => handleChange('observacoes', text)}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.textArea}
      />

      <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
        Cadastrar Clínica
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
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  textArea: {
    marginBottom: 12,
    minHeight: 80,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    height: 150,
    width: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  submitButton: {
    marginTop: 10,
  },
});
