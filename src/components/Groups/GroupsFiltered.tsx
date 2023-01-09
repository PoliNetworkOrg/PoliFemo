import { Text } from "components/Text"
import React, { FC } from "react"
import { View } from "react-native"

export interface GroupsFilteredProps {
    string?: string
}

export const GroupsFiltered: FC<GroupsFilteredProps> = props => {
    return (
        <View>
            <Text>{props.string}</Text>
        </View>
    )
}
