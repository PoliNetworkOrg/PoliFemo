import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Saluto from './saluto';

export default function salutoConBottone() {
    // le variabili nella UI possono essere gestite con lo stato di react
    // https://it.reactjs.org/docs/state-and-lifecycle.html
    let [nome, setNome] = useState('')
	let nomi = ["Tommaso", "Giovanni", "Andrea", "Francesco", "Simone", "Lorenzo"]

    useEffect(() => {
        // useEffect può essere usato per chiamare del codice quando i props o lo stato cambiano
        // https://it.reactjs.org/docs/hooks-effect.html

        // per chiamate a servizi web, si può usare fetch nativo di Javascript
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        // potenzialmente anche altre librerie di terze parti possono essere usate 
        // https://reactnative.dev/docs/network
        fetch('https://jsonplaceholder.typicode.com/todos/1')
            .then(async res => {
                let text = await res.json()
                console.log(text)
            })
        // l'array vuoto passato come secondo argomento indica che il useEffect deve essere eseguito
        // solo alla prima renderizzazione
    }, [])

    return (
        <View style={styles.container}>

            <Saluto
                // i componenti vengono messi nella UI con una sintassi simile ai tag HTML
                // si possono passare dei props per cambiare cosa succede nel componente
                nome={nome}
            />

            <Pressable onPress={() => {
                // chiamata quando viene premuto il bottone, aggiorna lo state
                setNome(nomi[Math.floor(Math.random() * nomi.length)])
            }} >
                <Text style={{
                    // stili possono essere passati come prop, come un oggetto plain o usando la
                    // funzione StyleSheet.create
                    margin: 10,
                    padding: 8,
                    backgroundColor: '#f0f0f0',
                }}> Cambia nome </Text>
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