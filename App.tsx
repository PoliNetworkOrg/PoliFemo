import React, { useEffect } from "react" // react deve essere importato in tutti i file che usano JSX
import { StatusBar, View } from "react-native"
import { Card } from "./src/components/Card"
import { SalutoConBottone } from "./src/pages/SalutoConBottone"

export default function App() {
    useEffect(() => {
        // useEffect può essere usato per chiamare del codice quando i props o lo stato cambiano
        // https://it.reactjs.org/docs/hooks-effect.html

        // per chiamate a servizi web, si può usare fetch nativo di Javascript
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        // potenzialmente anche altre librerie di terze parti possono essere usate
        // https://reactnative.dev/docs/network
        fetch("https://jsonplaceholder.typicode.com/todos/1").then(
            async res => {
                const text = await res.json()
                console.log(text)
            }
        )
        // l'array vuoto passato come secondo argomento indica che il useEffect deve essere eseguito
        // solo alla prima renderizzazione
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <SalutoConBottone />
            <Card titolo="titolo" sottotitolo="sottotitolo" />
            <StatusBar />
        </View>
    )
}
