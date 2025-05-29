// Exemplo em um componente de tela (ProfileScreen.js)
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import axios from 'axios'; // ou seu método preferido

function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://sua-api-nest.com/users/1');
        setUserData(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Array de dependências vazio para executar apenas na montagem

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Erro: {error}</Text>;
  if (!userData) return <Text>Nenhum dado encontrado.</Text>;

  return (
    <View>
      <Text>Nome: {userData.name}</Text>
      {/* ... outros dados do usuário */}
    </View>
  );
}

export default ProfileScreen;