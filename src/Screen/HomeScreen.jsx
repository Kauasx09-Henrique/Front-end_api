import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Searchbar } from 'react-native-paper';



export default function HomeScreen({ navigation }) {

    const [pesquisar, setpesquisar] = React.useState('');

    return (
        <View style={styles.container}>
            <View> 
            <Searchbar
                placeholder="Pesquisar Uma Clinica"
                onChangeText={setpesquisar}
                value={pesquisar}
                style={styles.pesquisar} 
                keyboardType='web-search'/>
        </View>
        
    </View >
    
  )
}

const styles = StyleSheet.create({
    pesquisar: {
        margin: 20,
        backgroundColor: "#B3E0F2"

    },
    
})