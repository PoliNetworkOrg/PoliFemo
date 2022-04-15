import React from "react"
import { StyleSheet, View, Text, Image } from "react-native"
import AppIntroSlider from "react-native-app-intro-slider"
import AppClassic from "./src/pages/AppClassic"
import Icon from "react-native-vector-icons/Ionicons"

const styles = StyleSheet.create({
    buttonCircle: {
        width: 40,
        height: 40,

        backgroundColor: "rgba(0, 0, 0, .8)",

        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    slide: {
        display: "flex",
        width: "100%",
        height: "100%",
    },
    title: {
        display: "flex",
    },
    text: {
        display: "flex",
    },
    //[...]
})

// slides = [...]

export default class App extends React.Component {
    ShowRealApp: boolean = false

    _renderItem = ({ item }) => {
        return (
            <View style={styles.slide}>
                <Text style={styles.title}>{item.title}</Text>
                <Image source={item.image} />
                <Text style={styles.text}>{item.text}</Text>
            </View>
        )
    }
    _renderNextButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Icon
                    name="arrow-forward"
                    color="rgba(1, 1, 255, .9)"
                    size={24}
                />
            </View>
        )
    }
    _renderDoneButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Icon
                    name="md-checkmark"
                    color="rgba(1, 255, 1, .9)"
                    size={24}
                />
            </View>
        )
    }

    render() {
        if (this.ShowRealApp == true) {
            return <AppClassic />
        } else {
            return (
                <AppIntroSlider
                    renderItem={this._renderItem}
                    showSkipButton
                    showPrevButton
                    data={slides}
                    bottomButton={false}
                    activeDotStyle={{
                        backgroundColor: "rgba(100, 200, 150, .9)",
                    }}
                    doneLabel={"Done"}
                    nextLabel={"Next"}
                    renderDoneButton={this._renderDoneButton}
                    renderNextButton={this._renderNextButton}
                    onDone={() => {
                        this.ShowRealApp = true
                        this.forceUpdate()
                    }}
                />
            )
        }
    }
}

const slides = [
    {
        key: "one",
        title: "Title 1",
        text: "Description.\nSay something cool",
        image: "https://thumbs.dreamstime.com/z/jour-de-terre-d-environnement-dans-les-mains-des-arbres-cultivant-jeunes-plantes-bokeh-verdissent-la-main-femelle-fond-tenant-l-130247647.jpg",
        backgroundColor: "#59b2ab",
    },
    {
        key: "two",
        title: "Title 2",
        text: "Other cool stuff",
        image: "https://thumbs.dreamstime.com/z/jour-de-terre-d-environnement-dans-les-mains-des-arbres-cultivant-jeunes-plantes-bokeh-verdissent-la-main-femelle-fond-tenant-l-130247647.jpg",
        backgroundColor: "#febe29",
    },
    {
        key: "three",
        title: "Rocket guy",
        text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
        image: "https://thumbs.dreamstime.com/z/jour-de-terre-d-environnement-dans-les-mains-des-arbres-cultivant-jeunes-plantes-bokeh-verdissent-la-main-femelle-fond-tenant-l-130247647.jpg",
        backgroundColor: "#22bcb5",
    },
]
