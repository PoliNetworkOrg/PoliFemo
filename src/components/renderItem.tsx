import React from "react"
import Icon from "react-native-vector-icons/Ionicons"
import { StyleSheet, View } from "react-native"
import AppIntroSlider from "react-native-app-intro-slider"

const styles = StyleSheet.create({
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: "rgba(0, 0, 0, .2)",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    //[...]
})

// slides = [...]

export default class App extends React.Component {
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
                    name="md-arrow-round-forward"
                    color="rgba(255, 255, 255, .9)"
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
                    color="rgba(255, 255, 255, .9)"
                    size={24}
                />
            </View>
        )
    }
    render() {
        return (
            <AppIntroSlider
                data={slides}
                renderDoneButton={this._renderDoneButton}
                renderNextButton={this._renderNextButton}
            />
        )
    }
}
