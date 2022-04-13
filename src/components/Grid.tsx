import React from "react"
import { FlatList, View } from "react-native"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Grid<T = any>(props: {
    data: T[]
    renderItem: (i: { item: T; index: number }) => JSX.Element
    numColumns?: number
}): JSX.Element {
    const numColumns = props.numColumns || 2
    // split data in to rows
    const rows: T[][] = []
    for (let i = 0; i < props.data.length; i += numColumns) {
        rows.push(props.data.slice(i, i + numColumns))
    }
    return (
        <FlatList
            data={rows}
            // eslint-disable-next-line no-extra-parens
            renderItem={({ item, index }) => (
                <View
                    style={{
                        flexDirection: "row",
                        flex: 1,
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                    key={"grid_sublist_" + index}
                >
                    {item.map((item, i) =>
                        props.renderItem({
                            item,
                            index: index * numColumns + i,
                        })
                    )}
                </View>
            )}
        />
    )
}
