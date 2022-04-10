import React, { FC, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { Saluto } from "../components/Saluto"

const nomi = ["Tommaso", "Giovanni", "Andrea", "Francesco", "Simone", "Lorenzo", "Vincenzo"]

export const SalutoConBottone: FC = () => {
    // le variabili nella UI possono essere gestite con lo stato di react
    // https://it.reactjs.org/docs/state-and-lifecycle.html
    const [nome, setNome] = useState<string>() // se non viene passato nessun valore, viene inizializzato con undefined
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
                    var nomiSenzaIlNomeGiaInUso = nomi.filter(v => v !== nome); //di modo che il nome già in uso non venga scelto
                    setNome(nomiSenzaIlNomeGiaInUso[Math.floor(Math.random() * nomiSenzaIlNomeGiaInUso.length)])
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
