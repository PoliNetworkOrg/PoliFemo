import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StyleSheet, Text, View } from "react-native"
import Icon from "react-native-vector-icons/AntDesign"
import { ColorfulTabBar as TabBar } from "react-navigation-tabbar-collection"
import { SalutoConBottone } from "./src/pages/SalutoConBottone"
import { CardSection } from "./src/components/CardSection"

const Tab = createBottomTabNavigator()

const DemoScreen = ({ route }) => (
    <View style={styles.screen}>
        <Text>{route.name}</Text>
    </View>
)

const cards: { titolo: string; sottotitolo: string }[] = []
for (let i = 0; i < 20; i++) {
    cards.push({
        titolo: `Titolo ${i}`,
        sottotitolo: `Sottotitolo ${i}`,
    })
}

const Griglia = ({ route }) => (
    <View style={styles.screen}>
        <CardSection numColumns={3} titolo="Titolo" cards={cards}></CardSection>
    </View>
)

const App = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={{ headerShown: false }}
                tabBar={props => <TabBar {...props} />}
            >
                <Tab.Screen
                    name="Home"
                    component={SalutoConBottone}
                    options={{
                        title: "Home",
                        icon: ({ focused, color, size }) => (
                            <Icon name="home" size={size} color={color} />
                        ),
                        color: "primary",
                    }}
                />
                <Tab.Screen
                    name="News"
                    component={Griglia}
                    options={{
                        title: "News",
                        icon: ({ focused, color, size }) => (
                            <Icon name="sharealt" size={size} color={color} />
                        ),
                        color: "info",
                    }}
                />
                <Tab.Screen
                    name="Chat"
                    component={DemoScreen}
                    options={{
                        title: "Chat",
                        icon: ({ focused, color, size }) => (
                            <Icon name="API" size={size} color={color} />
                        ),
                        color: "warning",
                    }}
                />
                <Tab.Screen
                    name="Likes"
                    component={DemoScreen}
                    options={{
                        title: "Likes",
                        icon: ({ focused, color, size }) => (
                            <Icon name="hearto" size={size} color={color} />
                        ),
                        color: "danger",
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={DemoScreen}
                    options={{
                        title: "Settings",
                        icon: ({ focused, color, size }) => (
                            <Icon name="setting" size={size} color={color} />
                        ),
                        color: "success",
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default App

const styles = StyleSheet.create({
    screen: {
        width: "100%",
        height: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
})
