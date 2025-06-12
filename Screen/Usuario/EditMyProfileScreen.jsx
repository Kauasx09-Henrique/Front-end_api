import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Card, ActivityIndicator, Text, Appbar, HelperText } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { mask } from 'remask';

import api from '../../src/services/api'; 

const MASKS = {
  telefone: ['(99) 9999-9999', '(99) 9 9999-9999'],
};

export default function EditMyProfileScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Busca os dados do perfil 
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        const userData = response.data;
        
        setNome(userData.user_nome || '');
        setEmail(userData.user_email || '');
        setTelefone(userData.user_telefone || '');
        setUserId(userData.id);
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível carregar seu perfil.' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'E-mail inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) {
      Toast.show({ type: 'error', text1: 'Por favor, corrija os erros.' });
      return;
    }
    setLoading(true);

    const payload = {
      user_nome: nome,
      user_email: email,
      user_telefone: telefone.replace(/\D/g, ''),
    };

    try {
      // Usa a rota PATCH para atualizar o usuário mesma do backend
      await api.patch(`/users/${userId}`, payload);
      
      Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Seu perfil foi atualizado.' });
      navigation.goBack();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao Atualizar',
        text2: err.response?.data?.message || 'Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userId) {
      return <ActivityIndicator style={{flex: 1}} size="large" />
  }

  return (
    <View style={styles.mainContainer}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Editar Meu Perfil" />
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
                label="Telefone"
                value={telefone}
                onChangeText={v => setTelefone(mask(v, MASKS.telefone))}
                keyboardType="phone-pad"
                maxLength={15}
                style={styles.input}
                mode="outlined"
              />

              <Button
                mode="contained"
                onPress={handleUpdate}
                loading={loading}
                disabled={loading}
                style={styles.button}
                icon="content-save"
              >
                Salvar Alterações
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f0f2f5' },
  scrollContainer: { padding: 16, paddingBottom: 40 },
  card: { borderRadius: 12 },
  input: { marginTop: 12 },
  button: { marginTop: 24, paddingVertical: 8 },
});
