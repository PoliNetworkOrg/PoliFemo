import React, { useState } from "react"
import { RootStackScreen } from "navigation/NavigationTypes"

import { Pressable, Image } from "react-native"

import { WebView } from "react-native-webview"
import { ArticleScroll } from "components/ArticleScroll"

export const Article: RootStackScreen<"Article"> = props => {
    const article = props.route.params.article
    const [webHeight, setWebHeight] = useState<number>(400)
    const [refreshing, setRefreshing] = useState<boolean>(false)

    return (
        <ArticleScroll
            navbarOptions={{ elevated: true }}
            title={article.title}
            subtitle={article.subtitle}
            backdropElement={
                <Pressable
                    onPress={() => {
                        console.log("hi")
                    }}
                >
                    <Image
                        source={{
                            uri: article.image,
                        }}
                        style={{
                            resizeMode: "cover",
                            width: "100%",
                            height: "100%",
                        }}
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
            <WebView
                onMessage={event => {
                    console.log(event)
                    setWebHeight(parseInt(event.nativeEvent.data))
                }}
                javaScriptEnabled={true}
                injectedJavaScript={webViewScript}
                containerStyle={{ height: webHeight, marginBottom: 120 }}
                showsVerticalScrollIndicator={false}
                setBuiltInZoomControls={false}
                nestedScrollEnabled={false}
                scrollEnabled={false}
                minimumFontSize={16}
                androidHardwareAccelerationDisabled={true}
                source={{
                    html: `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><p align="justify" style="font-family:roboto">${
                        article.content ?? "error"
                    }</p></body></html>`,
                }}
                automaticallyAdjustContentInsets={false}
            />
        </ArticleScroll>
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
