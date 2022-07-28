import React from "react"
import { FC } from "react"
import { Pressable } from "react-native"

// WIP: Dobbiamo ancora decidere se usare o meno questa cosa della bandiera.
// const bandiere = ["url0", "url1", "url2", "url3"]

export const LanguageSelection: FC = () => {
    //piu' che altro immagino tu la voglia usare per l'internazionalizzazione
    // const linguaDefault = bandiere[0]

    // const [imageURL, setimageURL] = useState<string>(linguaDefault) // valore di default preso dai parametri della navigazione
    return (
        <Pressable
            onPress={() => {
                // // chiamata quando viene premuto il bottone, aggiorna lo state
                // if(bandiere[]+1!=null) //cosi' nel caso termini la lista riparte
                // {
                // const actualLang = bandiere[] + 1
                // }
                // else
                // {
                // const actualLang = [0]
                // }
                // setimageURL( actualLang )
            }}
        >
            {/* <Image
                style={{
                    borderRadius: 4,
                    overflow: "hidden",
                }}
            /> */}
        </Pressable>
    )
}

//WIP (bottone che on press cambia sfondo e valore export di lingua)
