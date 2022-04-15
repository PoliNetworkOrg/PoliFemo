import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Icon from "react-native-vector-icons/AntDesign"
import { ColorfulTabBar as TabBar } from "react-navigation-tabbar-collection"
import { SalutoConBottone } from "./src/pages/SalutoConBottone"
import { CardSection } from "./src/components/CardSection"
import { DemoScreen } from "./src/pages/DemoScreen"
import { Card } from "./src/components/Card"
import { Menu } from "./src/pages/Menu"

import Tab from "./src/variables/tabNavigator"
import pages from "./src/variables/pages"

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
