import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Marcarconsulta() {
  const { clinicaId } = route.params || {};

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Marcar Consulta na clínica ID: {clinicaId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({})