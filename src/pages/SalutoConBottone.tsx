/**
 *
 *
 *      THIS FILE IS JUST FOR DEMONSTRATION PURPOSES
 *      IT WILL BE DELETED IN FUTURE COMMITS
 *
 *
 */

import React, { useState } from "react"
import { Pressable, Image } from "react-native"
import { Page } from "../components/Page"
import { RootStackScreen } from "../navigation/NavigationTypes"
import { BodyText } from "../components/Text"

export const SalutoConBottone: RootStackScreen<"Saluti"> = () => {
    // le variabili nella UI possono essere gestite con lo stato di react
    // https://it.reactjs.org/docs/state-and-lifecycle.html
    const [refreshing, setRefreshing] = useState<boolean>(false)

    return (
        <Page
            navbarOptions={{
                customButtons: [
                    {
                        icon: "Down",
                        onPress: () => {
                            // esempio di chiamata alla navigazione
                            console.log("pressed!")
                        },
                    },
                ],
            }}
            title="Saluti"
            backdropElement={
                <Pressable
                    onPress={() => {
                        console.log("hi")
                    }}
                    style={{ width: "100%", height: "100%" }}
                >
                    <Image
                        source={{
                            uri: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
                        }}
                        style={{ width: "100%", height: "100%" }}
                    />
                </Pressable>
            }
            scrollOffset={100}
            refreshControl={{
                refreshing,
                onRefresh: () => {
                    setRefreshing(true)
                    setTimeout(() => {
                        setRefreshing(false)
                    }, 2000)
                },
            }}
        >
            <BodyText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ut
                dui tempus, porttitor magna at, ultrices mi. Morbi non imperdiet
                dui. Sed mollis, elit ut eleifend eleifend, quam mi luctus
                tellus, nec maximus ipsum lorem sit amet libero. In ultrices
                pharetra turpis, id bibendum orci scelerisque ut. Ut faucibus
                est sit amet ligula fringilla, id facilisis ipsum facilisis.
                Morbi dignissim at massa vitae iaculis. Aenean congue vel nulla
                a congue. Integer quis imperdiet metus. In felis velit, aliquet
                eu faucibus quis, congue sit amet risus. Pellentesque pulvinar
                laoreet justo eu vehicula. Nullam sodales, turpis a interdum
                egestas, lectus nisl pulvinar purus, vitae porttitor nibh risus
                quis dui. Vestibulum ante ipsum primis in faucibus orci luctus
                et ultrices posuere cubilia curae; Proin nec varius turpis, ut
                rhoncus odio. Mauris malesuada ligula nec posuere facilisis.
                Nulla bibendum augue a est suscipit, non maximus nisl molestie.
                Fusce nec vulputate nulla, et tristique dui. Duis quis arcu
                molestie, ultricies quam sed, vehicula nibh. Ut nec sapien
                dapibus, congue diam ultrices, placerat turpis. Nam imperdiet
                semper vulputate. Phasellus ultricies nibh quis mi rhoncus,
                vitae efficitur arcu hendrerit. Sed vel imperdiet lacus, id
                euismod nisi. Nam malesuada efficitur risus ac suscipit.
                Phasellus ac ante mi. Ut sit amet urna non mauris suscipit
                sodales. Class aptent taciti sociosqu ad litora torquent per
                conubia nostra, per inceptos himenaeos. Orci varius natoque
                penatibus et magnis dis parturient montes, nascetur ridiculus
                mus. Vivamus nec felis nec nibh tincidunt malesuada at et nisi.
                Maecenas in nulla et sem aliquam sagittis at non nunc. Aenean in
                iaculis leo. Ut nec pellentesque justo. Suspendisse arcu sem,
                imperdiet vel faucibus sit amet, varius sit amet nunc. In
                blandit urna sapien, a egestas metus sagittis in. Maecenas et
                risus id enim commodo sodales. Fusce sed est quis dolor
                fringilla hendrerit at quis quam. Duis in metus cursus,
                fringilla risus eget, tempor ipsum. Maecenas vel bibendum lacus.
                Nulla eget pellentesque est. Proin non dolor dapibus elit
                facilisis interdum. In hac habitasse platea dictumst.
            </BodyText>
            {/* <View style={styles.container}>
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
                            altriNomi[
                                Math.floor(Math.random() * altriNomi.length)
                            ]
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
            </View> */}
        </Page>
    )
}
