import React, { FC } from "react"
import { StyleSheet, View } from "react-native"
import { FlatGrid } from "react-native-super-grid"

export const FlatGridExample: FC<{ views: JSX.Element[] }> = props => {
    return (
        <FlatGrid
            itemDimension={130}
            data={props.views}
            style={styles.gridView}
            // staticDimension={300}
            // fixed
            spacing={10}
            renderItem={({ item }) => (
                <View style={[styles.itemContainer, {}]}>{item}</View>
            )}
        />
    )
}

const styles = StyleSheet.create({
    gridView: {
        marginTop: 10,
        flex: 1,
    },
    itemContainer: {
        justifyContent: "flex-end",
        borderRadius: 5,
        padding: 10,
        height: 150,
    },
    itemName: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "600",
    },
    itemCode: {
        fontWeight: "600",
        fontSize: 12,
        color: "#fff",
    },
})
