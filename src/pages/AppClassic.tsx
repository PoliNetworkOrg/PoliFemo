import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Icon from "react-native-vector-icons/AntDesign"
import { SalutoConBottone } from "./SalutoConBottone"
import { CardSection } from "../components/CardSection"
import { CardProps } from "../components/Card"
import { Menu } from "./Menu"
import { Article } from "./Article"

const Tab = createBottomTabNavigator()

const AppClassic = () => {
    const cards: CardProps[] = []
    for (let i = 0; i < 20; i++) {
        cards.push({
            title: `Titolo ${i}`,
            subtitle: `Sottotitolo ${i}`,
        })
    }

    const pagesInfo = [
        {
            name: "News",
            icon: "notification",
            component: () => <SalutoConBottone />,
        },
        {
            name: "Aule",
            icon: "enviromento",
            component: () => (
                <CardSection numColumns={3} title="Share" cards={cards} />
            ),
        },
        {
            name: "Article",
            icon: "paperclip",
            component: () => (
                <Article
                    title="Titolo articolo"
                    body="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                    imageURLs={[
                        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
                        "https://helpx.adobe.com/content/dam/help/en/stock/how-to/visual-reverse-image-search/jcr_content/main-pars/image/visual-reverse-image-search-v2_intro.jpg",
                        "https://fruttamami.com/wp-content/uploads/2017/08/5.jpg",
                    ]}
                />
            ),
        },
        {
            name: "Menu",
            icon: "ellipsis1",
            component: () => <Menu />,
        },
    ]

    const pages = []
    for (let i = 0; i < pagesInfo.length; i++) {
        pages.push(
            <Tab.Screen
                key={"page_" + pagesInfo[i].name}
                name={pagesInfo[i].name}
                options={{
                    title: pagesInfo[i].name,
                    tabBarIcon: ({ color, size }) => (
                        <Icon
                            name={pagesInfo[i].icon}
                            size={size}
                            color={color}
                        />
                    ),
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
            >
                {pages}
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default AppClassic
