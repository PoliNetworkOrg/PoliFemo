import { useState } from "react"
import { Pressable, StyleSheet, Image, View } from "react-native"


const bandiere = [
    "url0",
    "url1",
    "url2",
    "url3"
    // pensavo di inserire qui tutti gli url delle immagini per poi chiamarli dopo
]

export const lingua_selezionata: /*where?*/ { //piu' che altro immagino tu la voglia usare per l'internazionalizzazione
        const { lingua_default } = bandiere[0]

    const [imageURL, setimageURL] = useState<Image>(defaultimageURL) // valore di default preso dai parametri della navigazione
    return (

            <Pressable
                onPress={() => {
                    // chiamata quando viene premuto il bottone, aggiorna lo state
                    if(bandiere[]+1!=null) //cosi' nel caso termini la lista riparte
                    {
                    const actualLang = bandiere[] + 1
                    }
                    else
                    {
                    const actualLang = [0]
                    }
                    setimageURL( actualLang )
                }}
            >
                <image
                    style="background: url(imageURL)"{{
                        // stili possono essere passati con il prop style, sia come un oggetto plain
                        // che usando la funzione StyleSheet.create
                        
                        
                        borderRadius: 4,
                        overflow: "hidden",
                    }}
                >
                </image>
            </Pressable>
        
    )
}


//WIP (bottone che on press cambia sfondo e valore export di lingua)
