import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Icon from "react-native-vector-icons/AntDesign"
import { ColorfulTabBar as TabBar } from "react-navigation-tabbar-collection"
import { SalutoConBottone } from "./SalutoConBottone"
import { CardSection } from "../components/CardSection"
import { Card } from "../components/Card"
import { Menu } from "./Menu"
import { Article } from "./Article"

const Tab = createBottomTabNavigator()

const AppClassic = () => {
    const cards: { titolo: string; sottotitolo: string }[] = []
    for (let i = 0; i < 20; i++) {
        cards.push({
            titolo: `Titolo ${i}`,
            sottotitolo: `Sottotitolo ${i}`,
        })
    }

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
            component: () => (
                <CardSection
                    numColumns={3}
                    titolo="Share"
                    cards={cards}
                    renderItem={({ item, index }) => {
                        if (index % 5 == 0)
                            return <SalutoConBottone key={`saluto ${index}`} />
                        else return <Card {...item} key={"card" + index} />
                    }}
                ></CardSection>
            ),
            color: "info",
        },
        {
            name: "Article",
            icon: "paperclip",
            component: () => (
                <Article
                    titolo="Titolo articolo"
                    corpo="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                    imageURL={[
                        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
                        "https://helpx.adobe.com/content/dam/help/en/stock/how-to/visual-reverse-image-search/jcr_content/main-pars/image/visual-reverse-image-search-v2_intro.jpg",
                    ]}
                />
            ),
            color: "warning",
        },
        {
            name: "Menu",
            icon: "ellipsis1",
            component: () => <Menu />,
            color: "success",
        },
    ]

    const pages = []
    for (let i = 0; i < pagesInfo.length; i++) {
        pages.push(
            <Tab.Screen
                name={pagesInfo[i].name}
                options={{
                    title: pagesInfo[i].name,
                    icon: ({ focused, color, size }) => (
                        <Icon
                            name={pagesInfo[i].icon}
                            size={size}
                            color={color}
                        />
                    ),
                    color: pagesInfo[i].color,
                }}
            >
                {pagesInfo[i].component}
            </Tab.Screen>
        )
    }

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

export default AppClassic
