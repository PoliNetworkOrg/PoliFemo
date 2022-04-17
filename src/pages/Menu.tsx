import React, { FC } from "react"
import { View } from "react-native"
import { CardSection } from "../components/CardSection"

export const Menu: FC<{
    onChangeIcon: any
    onChangeText: any
    menuItems: any[]
    itemChanged: any
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
