import React, { useEffect, useState } from "react"
import { Dimensions, View, Pressable } from "react-native"
import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"
import BottomSheet, {
    BottomSheetScrollView,
    BottomSheetScrollViewMethods,
} from "@gorhom/bottom-sheet"

import { RootStackScreen } from "navigation/NavigationTypes"
import { BodyText, Title } from "components/Text"
import { MainMenu, MainTitle, PoliSearchBar } from "components/Home"
import { NavBar } from "components/NavBar"
import { usePalette } from "utils/colors"

import openNavSVG from "assets/menu/open-nav.svg"

/**
 * Home page containing the POLIFEMO logo, search bar, main horizontal scroll menu and the entry
 * point for the news section (which is a bottom sheet)
 */
export const Home: RootStackScreen<"Home"> = () => {
    const [isNewsClosed, setNewsClosed] = useState(true)
    const { homeBackground, background } = usePalette()
    // the ref for the News bottom sheet, used to open and close it programmatically
    const bottomSheetRef = React.useRef<BottomSheet>(null)
    // The reference to the News scrollview, used to scroll programmatically
    const scrollViewRef = React.useRef<BottomSheetScrollViewMethods>(null)

    const svg = useSVG(openNavSVG)

    useEffect(() => {
        // scrolls to the top of the news scrollview when the news bottom sheet is closed
        if (isNewsClosed && scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true })
        }
    }, [isNewsClosed])

    return (
        <View
            style={{
                flex: 1,
                alignItems: "stretch",
                backgroundColor: homeBackground,
            }}
        >
            <View
                style={{
                    flex: 1,
                    marginTop: 106,
                }}
            >
                <MainTitle />
                <View
                    // section containing the search bar and the main menu
                    style={{
                        marginTop: 35,
                        paddingBottom: 50,
                        flex: 1,
                        backgroundColor: background,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,

                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 7,
                        },
                        shadowOpacity: 0.43,
                        shadowRadius: 9.51,

                        elevation: 15,
                    }}
                >
                    <PoliSearchBar />
                    <MainMenu />
                </View>
            </View>
            <BottomSheet
                ref={bottomSheetRef}
                handleComponent={() => (
                    // "News" title component
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "baseline",
                            zIndex: 3,
                            paddingHorizontal: 22,
                            paddingTop: 39,
                            flex: 1,
                            backgroundColor: background,
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                        }}
                    >
                        <Title>News</Title>
                        <Pressable
                            style={{ marginLeft: 10 }}
                            // toggles the bottom sheet open and closed
                            onPress={() => setNewsClosed(!isNewsClosed)}
                        >
                            <Canvas
                                style={{
                                    width: 27,
                                    height: 28,
                                    transform: [
                                        {
                                            rotate: isNewsClosed
                                                ? "0deg"
                                                : "180deg",
                                        },
                                    ],
                                }}
                            >
                                {svg && (
                                    <ImageSVG
                                        svg={svg}
                                        x={0}
                                        y={0}
                                        width={27}
                                        height={27}
                                    />
                                )}
                            </Canvas>
                        </Pressable>
                    </View>
                )}
                backgroundStyle={{
                    // rounds the top corners the same as the rest of the app
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                }}
                onAnimate={progress => {
                    // fires when the bottom sheet is animating, keeps track of when the sheet is
                    // closed/opened
                    setNewsClosed(progress == 1)
                }}
                style={{
                    // Shadow below
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 7,
                    },
                    shadowOpacity: 0.43,
                    shadowRadius: 9.51,

                    elevation: 15,
                }}
                index={isNewsClosed ? 0 : 1} // the position depends on if closed or open
                snapPoints={[
                    // TODO: this can be probably made better
                    Dimensions.get("window").height - 425,
                    Dimensions.get("window").height - 106,
                ]}
                animateOnMount={false} // app should begin stationary
            >
                <BottomSheetScrollView ref={scrollViewRef}>
                    <View
                        //
                        // TODO: EVERYTHING BELOW IS JUST A PLACEHOLDER
                        //
                        style={{
                            zIndex: 2,
                            minHeight: 2000,
                            paddingHorizontal: 22,
                            backgroundColor: background,
                        }}
                    >
                        <BodyText>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nunc ut dui tempus, porttitor magna at,
                            ultrices mi. Morbi non imperdiet dui. Sed mollis,
                            elit ut eleifend eleifend, quam mi luctus tellus,
                            nec maximus ipsum lorem sit amet libero. In ultrices
                            pharetra turpis, id bibendum orci scelerisque ut. Ut
                            faucibus est sit amet ligula fringilla, id facilisis
                            ipsum facilisis. Morbi dignissim at massa vitae
                            iaculis. Aenean congue vel nulla a congue. Integer
                            quis imperdiet metus. In felis velit, aliquet eu
                            faucibus quis, congue sit amet risus. Pellentesque
                            pulvinar laoreet justo eu vehicula. Nullam sodales,
                            turpis a interdum egestas, lectus nisl pulvinar
                            purus, vitae porttitor nibh risus quis dui.
                            Vestibulum ante ipsum primis in faucibus orci luctus
                            et ultrices posuere cubilia curae; Proin nec varius
                            turpis, ut rhoncus odio. Mauris malesuada ligula nec
                            posuere facilisis. Nulla bibendum augue a est
                            suscipit, non maximus nisl molestie. Fusce nec
                            vulputate nulla, et tristique dui. Duis quis arcu
                            molestie, ultricies quam sed, vehicula nibh. Ut nec
                            sapien dapibus, congue diam ultrices, placerat
                            turpis. Nam imperdiet semper vulputate. Phasellus
                            ultricies nibh quis mi rhoncus, vitae efficitur arcu
                            hendrerit. Sed vel imperdiet lacus, id euismod nisi.
                            Nam malesuada efficitur risus ac suscipit. Phasellus
                            ac ante mi. Ut sit amet urna non mauris suscipit
                            sodales. Class aptent taciti sociosqu ad litora
                            torquent per conubia nostra, per inceptos himenaeos.
                            Orci varius natoque penatibus et magnis dis
                            parturient montes, nascetur ridiculus mus. Vivamus
                            nec felis nec nibh tincidunt malesuada at et nisi.
                            Maecenas in nulla et sem aliquam sagittis at non
                            nunc. Aenean in iaculis leo. Ut nec pellentesque
                            justo. Suspendisse arcu sem, imperdiet vel faucibus
                            sit amet, varius sit amet nunc. In blandit urna
                            sapien, a egestas metus sagittis in. Maecenas et
                            risus id enim commodo sodales. Fusce sed est quis
                            dolor fringilla hendrerit at quis quam. Duis in
                            metus cursus, fringilla risus eget, tempor ipsum.
                            Maecenas vel bibendum lacus. Nulla eget pellentesque
                            est. Proin non dolor dapibus elit facilisis
                            interdum. In hac habitasse platea dictumst.
                        </BodyText>
                    </View>
                </BottomSheetScrollView>
                <NavBar
                    // TODO: ask the design team if we need to use the navbar here
                    overrideBackBehavior={() => setNewsClosed(true)}
                    overrideHomeBehavior={() => setNewsClosed(true)}
                />
            </BottomSheet>
        </View>
    )
}
