import React from "react"
import { View } from "react-native"

import { RootStackScreen } from "navigation/NavigationTypes"
import { Page } from "components/Page"
import { BodyText } from "components/Text"

/**
 * News highlights page containing the most important news
 */
export const NewsHighlights: RootStackScreen<"NewsHighlights"> = () => {
    return (
        <Page title={"Evidenza"}>
            <View style={{ flex: 1, paddingBottom: 160 }}>
                <BodyText>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nunc ut dui tempus, porttitor magna at, ultrices mi. Morbi
                    non imperdiet dui. Sed mollis, elit ut eleifend eleifend,
                    quam mi luctus tellus, nec maximus ipsum lorem sit amet
                    libero. In ultrices pharetra turpis, id bibendum orci
                    scelerisque ut. Ut faucibus est sit amet ligula fringilla,
                    id facilisis ipsum facilisis. Morbi dignissim at massa vitae
                    iaculis. Aenean congue vel nulla a congue. Integer quis
                    imperdiet metus. In felis velit, aliquet eu faucibus quis,
                    congue sit amet risus. Pellentesque pulvinar laoreet justo
                    eu vehicula. Nullam sodales, turpis a interdum egestas,
                    lectus nisl pulvinar purus, vitae porttitor nibh risus quis
                    dui. Vestibulum ante ipsum primis in faucibus orci luctus et
                    ultrices posuere cubilia curae; Proin nec varius turpis, ut
                    rhoncus odio. Mauris malesuada ligula nec posuere facilisis.
                    Nulla bibendum augue a est suscipit, non maximus nisl
                    molestie. Fusce nec vulputate nulla, et tristique dui. Duis
                    quis arcu molestie, ultricies quam sed, vehicula nibh. Ut
                    nec sapien dapibus, congue diam ultrices, placerat turpis.
                    Nam imperdiet semper vulputate. Phasellus ultricies nibh
                    quis mi rhoncus, vitae efficitur arcu hendrerit. Sed vel
                    imperdiet lacus, id euismod nisi. Nam malesuada efficitur
                    risus ac suscipit. Phasellus ac ante mi. Ut sit amet urna
                    non mauris suscipit sodales. Class aptent taciti sociosqu ad
                    litora torquent per conubia nostra, per inceptos himenaeos.
                    Orci varius natoque penatibus et magnis dis parturient
                    montes, nascetur ridiculus mus. Vivamus nec felis nec nibh
                    tincidunt malesuada at et nisi. Maecenas in nulla et sem
                    aliquam sagittis at non nunc. Aenean in iaculis leo. Ut nec
                    pellentesque justo. Suspendisse arcu sem, imperdiet vel
                    faucibus sit amet, varius sit amet nunc. In blandit urna
                    sapien, a egestas metus sagittis in. Maecenas et risus id
                    enim commodo sodales. Fusce sed est quis dolor fringilla
                    hendrerit at quis quam. Duis in metus cursus, fringilla
                    risus eget, tempor ipsum. Maecenas vel bibendum lacus. Nulla
                    eget pellentesque est. Proin non dolor dapibus elit
                    facilisis interdum. In hac habitasse platea dictumst.
                </BodyText>
            </View>
        </Page>
    )
}
