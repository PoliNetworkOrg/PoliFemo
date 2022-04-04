import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function Saluto(props: { nome: string }) {
    return <Text>Ciao {props.nome}</Text>
}

export default function App() {
    let [nome, setNome] = useState('Tommaso')

    useEffect((): void => {
        fetch('https://jsonplaceholder.typicode.com/todos/1').then(response => response.text()).then(res =>
            console.log(res)
        )
    }, [])

    return (
        <View style={styles.container}>
            <Saluto nome={nome} />
            <Pressable onPress={() => {
                setNome('Giovanni')
            }} >
                <Text>Cambia nome</Text>
            </Pressable>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});