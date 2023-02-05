import React, { FC } from "react"
import { View, StyleSheet } from "react-native"

import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { Divider } from "components/Divider"
import { BodyText } from "components/Text"
import { getUsableScreenHeight } from "utils/height"

export interface PrivacyPageProps {
    /** Title of the page */
    title: string

    /** Informative text at the top of the page. Always shown */
    text: string

    /** Wether to show children and bottomComponent or not (usually if user is logged in or not) */
    showContent: boolean

    children?: React.ReactNode

    /** Component rendered at the bottom of the screen */
    bottomComponent?: React.ReactNode
}

/**
 * Delete account Page
 */
export const PrivacyPage: FC<PrivacyPageProps> = props => {
    return (
        <ContentWrapperScroll title={props.title}>
            <View // wrap all the content to have a minimum height (so that the bottom component stays at the bottom of the page)
                style={styles.container}
            >
                <View style={styles.topComponent}>
                    <BodyText>{props.text}</BodyText>
                    {props.showContent && props.children && (
                        <Divider style={styles.divider} />
                    )}
                    {props.showContent && props.children}
                </View>

                <View style={styles.bottomComponent}>
                    {props.showContent && props.bottomComponent}
                </View>
            </View>
        </ContentWrapperScroll>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        marginHorizontal: 30,
        minHeight: getUsableScreenHeight() - 280,
    },
    divider: {
        marginBottom: 25,
        marginTop: 25,
    },
    topComponent: {
        marginBottom: 40,
    },
    bottomComponent: {
        marginHorizontal: 30,
        marginTop: "auto",
    },
})
