import React, { useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { Saluto } from "../components/Saluto"
import { RootStackScreen } from "../navigation/NavigationTypes"

const nomi = [
    "Tommaso",
    "Giovanni",
    "Andrea",
    "Francesco",
    "Simone",
    "Lorenzo",
    "Vincenzo",
]

export const SalutoConBottone: RootStackScreen<"Saluti"> = props => {
    // le variabili nella UI possono essere gestite con lo stato di react
    // https://it.reactjs.org/docs/state-and-lifecycle.html
    const { route } = props
    const { defaultName } = route.params

    const [nome, setNome] = useState<string>(defaultName) // valore di default preso dai parametri della navigazione
    return (
        <View style={styles.container}>
            <Saluto
                // i componenti vengono messi nella UI con una sintassi simile ai tag HTML
                // si possono passare dei props per cambiare cosa succede nel componente
                nome={nome}
            />

            <Pressable
                onPress={() => {
                    // chiamata quando viene premuto il bottone, aggiorna lo state
                    const altriNomi = nomi.filter(v => v !== nome) //di modo che il nome già in uso non venga scelto
                    setNome(
                        altriNomi[Math.floor(Math.random() * altriNomi.length)]
                    )
                }}
            >
                <Text
                    style={{
                        // stili possono essere passati con il prop style, sia come un oggetto plain
                        // che usando la funzione StyleSheet.create
                        margin: 10,
                        padding: 8,
                        backgroundColor: "#ddd",
                        fontSize: 20,
                        borderRadius: 4,
                        overflow: "hidden",
                    }}
                >
                    Cambia nome
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
})
