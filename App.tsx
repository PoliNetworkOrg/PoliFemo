import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { ScrollView, View } from "react-native"
import Icon from "react-native-vector-icons/AntDesign"
import { ColorfulTabBar as TabBar } from "react-navigation-tabbar-collection"
import { SalutoConBottone } from "./src/pages/SalutoConBottone"
import { CardSection } from "./src/components/CardSection"
import { DemoScreen } from "./src/pages/DemoScreen"
import { Card } from "./src/components/Card"

const Tab = createBottomTabNavigator()

const cards: { titolo: string; sottotitolo: string }[] = []
for (let i = 0; i < 20; i++) {
    cards.push({
        titolo: `Titolo ${i}`,
        sottotitolo: `Sottotitolo ${i}`,
    })
}

const Griglia = ({ route }) => (
    <ScrollView>
        <CardSection
            numColumns={3}
            titolo={route.name}
            cards={cards}
            renderItem={({ item, index }) => {
                if (index % 5 == 0)
                    return <SalutoConBottone key={`saluto ${index}`} />
                else return <Card {...item} key={"card" + index} />
            }}
        ></CardSection>
    </ScrollView>
)

const pagesInfo = [
    {
        name: "Home",
        icon: "home",
        component: () => <SalutoConBottone />,
        color: "primary",
    },
    {
        name: "Share",
        icon: "sharealt",
        component: Griglia,
        color: "info",
    },
    {
        name: "API",
        icon: "API",
        component: () => <DemoScreen name="API"></DemoScreen>,
        color: "warning",
        props: { name: "API" },
    },
    {
        name: "Hearth",
        icon: "hearto",
        component: () => <SalutoConBottone />,
        color: "danger",
    },
    {
        name: "Settings",
        icon: "setting",
        component: () => <SalutoConBottone />,
        color: "success",
    },
]
const pages = []

for (let i = 0; i < pagesInfo.length; i++) {
    pages.push(
        <Tab.Screen
            name={pagesInfo[i].name}
            children={pagesInfo[i].component}
            options={{
                title: pagesInfo[i].name,
                icon: ({ focused, color, size }) => (
                    <Icon name={pagesInfo[i].icon} size={size} color={color} />
                ),
                color: pagesInfo[i].color,
            }}
        ></Tab.Screen>
    )
}

const App = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                //initialRouteName="Name"
                screenOptions={{ headerShown: false }}
                tabBar={props => <TabBar {...props} />}
            >
                {pages}
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default App
