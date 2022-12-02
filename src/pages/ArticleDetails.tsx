/* eslint-disable prettier/prettier */
import React, { useState } from "react"
import { RootStackScreen } from "navigation/NavigationTypes"
import { Pressable, Image, Linking } from "react-native"
import { WebView } from "react-native-webview"
import { ScrollPage } from "components/ScrollPage"
import { usePalette } from "utils/colors"

import { Asset } from "expo-asset"
import { Roboto_400Regular } from "@expo-google-fonts/roboto"

export const Article: RootStackScreen<"Article"> = props => {
    const { isLight } = usePalette()
    const article = props.route.params.article
    const [webHeight, setWebHeight] = useState<number>(400)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    let html: string[] = []
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        html = JSON.parse(article.content)
    } catch (error) {
        console.log(error)
    }

    return (
        <ScrollPage
            navbarOptions={{ elevated: true }}
            title={article.title}
            subtitle={article.subtitle}
            backdropElement={
                <Pressable
                    onPress={() => {
                        // ? cosa deve fare questo callback?
                        console.log("not implemented yet")
                    }}
                >
                    <Image
                        source={{
                            uri: article.image,
                        }}
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </Pressable>
            }
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
            <WebView
                onMessage={event => {
                    console.log(event)
                    setWebHeight(parseInt(event.nativeEvent.data))
                }}
                /* Questo dovrebbe reindirizzare i link nel browser,
                stoppando la webview. Apparentemente non funziona col mio
                android, nel senso che non viene chiamata (comunque 
                il problema dei reindirizzamenti dentro la webview non
                si presenta sul mio telefono). Da testare su iOS e altri
                Android.  */
                onShouldStartLoadWithRequest={event => {
                    if (event.url.slice(0, 4) === "http") {
                        void Linking.openURL(event.url)
                        return false
                    }

                    return true
                }}
                javaScriptEnabled={true}
                injectedJavaScript={webViewScript}
                containerStyle={{ height: webHeight, marginBottom: 120 }}
                showsVerticalScrollIndicator={false}
                setBuiltInZoomControls={false}
                nestedScrollEnabled={false}
                scrollEnabled={false}
                androidHardwareAccelerationDisabled={true}
                originWhitelist={["*"]}
                source={{
                    // ! Font-Family non funzionante
                    // ? come fare?
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    html: `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"> 
                    <style type="text/css">
                    @font-face {
                        font-family: "Roboto";
                        src: url("${Asset.fromModule(Roboto_400Regular).uri}");
                    }
                    body {
                      font-size: 16;
                      font-family: "Roboto";
                      background-color: ${isLight ? "white" : "#232A3E"};
                    }
                    p {
                      color: ${isLight ? "black" : "white"};
                      text-align: justify;
                    }
                    a {
                        color: ${isLight ? "black" : "white"};
                      }
                  </style></head><body><div>${html
                      .map(el => `<p>${el}<p/>`)
                      .join("")}
                    <div/></body></html>`,
                    baseUrl: "",
                }}
            />
        </ScrollPage>
    )
}

//used to set automatic heigth in webview
//solution found here: https://stackoverflow.com/questions/35446209/react-native-webview-height
//the alternative was to install a whole package
const webViewScript = `
  setTimeout(function() { 
    window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight); 
  }, 500);
  true; // note: this is required, or you'll sometimes get silent failures
`
