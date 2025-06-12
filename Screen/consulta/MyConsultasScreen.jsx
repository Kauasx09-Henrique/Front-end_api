import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Card, ActivityIndicator, Text, Appbar, Chip, Provider as PaperProvider } from 'react-native-paper';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Toast from 'react-native-toast-message';

import api from '../../src/services/api'; // Ajuste o caminho se necessário

// Configuração do calendário para Português
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'],
  today: "Hoje"
};
LocaleConfig.defaultLocale = 'pt-br';

// Horários de exemplo. horas definidas no frotn,
const AVAILABLE_TIMES = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

export default function Marcarconsulta({ route, navigation }) {
  const { clinicaId } = route.params;

  // Estados do formulário
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);
  const [motivo, setMotivo] = useState('');
  
  // Estados de controle da UI
  const [clinica, setClinica] = useState(null);
  const [loading, setLoading] = useState(true);

  // Busca os detalhes da clínica ao carregar a tela
  useEffect(() => {
    const fetchClinicDetails = async () => {
      try {
        const response = await api.get(`/clinica/${clinicaId}`);
        setClinica(response.data);
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível carregar os dados da clínica.' });
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchClinicDetails();
  }, [clinicaId]);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !motivo) {
      Toast.show({ type: 'error', text1: 'Campos obrigatórios', text2: 'Por favor, selecione data, hora e motivo.' });
      return;
    }

    setLoading(true);

    const payload = {
      clinicaId: clinica.id,
      data_consulta: selectedDate,
      horario_consulta: selectedTime,
      motivo_consulta: motivo,
    };

    try {
      
      await api.post('/marcar-consulta', payload);
      
      Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Sua consulta foi agendada.' });
      navigation.goBack();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Erro no Agendamento',
        text2: err.response?.data?.message || 'Tente novamente mais tarde.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getMarkedDates = () => {
      if (!selectedDate) return {};
      return {
          [selectedDate]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: '#007AFF',
              selectedTextColor: 'white',
          }
      };
  }

  if (loading && !clinica) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <PaperProvider>
      <View style={styles.mainContainer}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Agendar Consulta" />
        </Appbar.Header>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Card style={styles.card}>
            <Card.Title 
              title={clinica?.nome_clinica} 
              subtitle={clinica?.especialidade_consulta}
              titleStyle={styles.cardTitle}
            />
            <Card.Content>
              <Text style={styles.label}>1. Selecione a Data</Text>
              <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={getMarkedDates()}
                minDate={new Date().toISOString().split('T')[0]}
                theme={{
                  arrowColor: '#007AFF',
                  todayTextColor: '#007AFF',
                  textDayFontWeight: '600',
                }}
              />

              <Text style={styles.label}>2. Escolha o Horário</Text>
              <View style={styles.timeContainer}>
                {AVAILABLE_TIMES.map((time) => (
                  <Chip
                    key={time}
                    selected={selectedTime === time}
                    onPress={() => setSelectedTime(time)}
                    style={styles.chip}
                    mode="flat"
                  >
                    {time}
                  </Chip>
                ))}
              </View>

              <Text style={styles.label}>3. Motivo da Consulta</Text>
              <TextInput
                label="Descreva brevemente o motivo"
                value={motivo}
                onChangeText={setMotivo}
                multiline
                numberOfLines={4}
                style={styles.input}
                mode="outlined"
              />

              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                style={styles.button}
                icon="calendar-check"
              >
                Confirmar Agendamento
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f0f2f5' },
  scrollContainer: { padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { borderRadius: 12, paddingBottom: 10 },
  cardTitle: { fontSize: 20, fontWeight: 'bold' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10 },
  timeContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginTop: 5 },
  chip: { margin: 4 },
  input: { marginTop: 10 },
  button: { marginTop: 30, paddingVertical: 8 },
});
