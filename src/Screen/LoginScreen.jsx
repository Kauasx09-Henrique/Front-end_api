import { StyleSheet, Text, View, } from 'react-native'
import React from 'react'
import { TextInput, Card, Title} from 'react-native-paper';

export default function LoginScreen() {

    const [Text, setText] = React.useState("");
    const [textsenha, setTextsenha] = React.useState('');

  return (
    <View style={styles.conteudoCentralizado}>

        <Card style={styles.Card}>
            <Card.Content>
            <Title style={styles.tituloCard}>Acessar Conta</Title>

    
         <TextInput
         label="email"
         value={Text}
         onChangeText={setText}
         style={styles.input}
         mode="outlined" 
         left={<TextInput.Icon icon="account" />} 
       />
       <TextInput
      label="Password"
      secureTextEntry
      value={textsenha}
      onChangeText={() => setText(setTextsenha)}
      style={styles.input}
      mode="outlined" 
      right={<TextInput.Icon icon="eye" />}
    />
    </Card.Content>
     </Card>
    </View>
  )
}

const styles = StyleSheet.create({

    card: {
        width: '85%', 
        maxWidth: 400, 
        padding: 10, 
        elevation: 8,
    },
    input: {
        marginBottom: 10, 
        margin: 20,


      },

})