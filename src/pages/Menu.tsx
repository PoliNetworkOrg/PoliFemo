import React, { FC } from "react"
import { View } from "react-native"
import { CardSection } from "../components/CardSection"

export interface MenuItem {
    title: string
    subtitle: string
    imageURL: string
    icon?: string
    onClick?: () => void
    view?: JSX.Element
}

export const Menu: FC<{
    onChangeIcon: (icon: string | undefined) => void
    onChangeText: (text: string) => void
    menuItems: MenuItem[]
    itemChanged: (index: number) => void
}> = props => {
    for (let i = 0; i < props.menuItems.length; i++) {
        props.menuItems[i].onClick = () => {
            props.onChangeIcon(props.menuItems[i].icon)
            props.onChangeText(props.menuItems[i].title)
            props.itemChanged(i)
        }
    }

    return (
        <View>
            <CardSection title="Menu" cards={props.menuItems} numColumns={1} />
        </View>
    )
}
