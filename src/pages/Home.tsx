import React from "react"
import { Dimensions, TextInput, View } from "react-native"
import BottomSheet, {
    BottomSheetScrollView,
    BottomSheetScrollViewMethods,
} from "@gorhom/bottom-sheet"

import { RootStackScreen } from "../navigation/NavigationTypes"
import { BodyText, Title } from "../components/Text"
import { usePalette } from "../utils/colors"
import { MainMenu, MainTitle } from "../components/Home"
// import { StickyHeader } from "../components/MainMenu/StickyHeader"

export const Home: RootStackScreen<"Home"> = () => {
    // const [isNewsClosed, setNewsClosed] = useState(true)
    const { homeBackground, background } = usePalette()
    // the ref for the News bottom sheet, used to open and close it programmatically
    const bottomSheetRef = React.useRef<BottomSheet>(null)
    // The reference to the News scrollview, used to scroll programmatically
    const scrollViewRef = React.useRef<BottomSheetScrollViewMethods>(null)

    return (
        <View
            style={{
                flex: 1,
                alignItems: "stretch",
                backgroundColor: homeBackground,
            }}
        >
            {/* <ScrollView
                style={{
                    flex: 1,
                    zIndex: 2,
                    marginTop: 106,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    overflow: "hidden",
                }}
                bounces={false}
                snapToOffsets={[0, 300]}
                snapToStart={false}
                snapToEnd={false}
                StickyHeaderComponent={StickyHeader}
                // stickyHeaderHiddenOnScroll
                stickyHeaderIndices={[0, 2]}
                disableIntervalMomentum
                decelerationRate={isNewsClosed ? "fast" : "normal"}
                scrollEventThrottle={100}
                onScroll={e => {
                    // console.log(e.nativeEvent.contentOffset.y)
                    if (e.nativeEvent.contentOffset.y < 350) {
                        setNewsClosed(true)
                    } else {
                        setNewsClosed(false)
                    }
                }}
                // onMomentumScrollEnd={e => {
                //     if (e.nativeEvent.contentOffset.y < 300) {
                //         console.log("now closed!")
                //         setNewsClosed(true)
                //     } else {
                //         console.log("now open!")
                //         setNewsClosed(false)
                //     }
                // }}
            > */}
            <View
                style={{
                    flex: 1,
                    marginTop: 106,
                }}
            >
                <MainTitle />
                <View
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
                    <TextInput
                        placeholder="Search"
                        style={{
                            padding: 12,
                            margin: 46,
                            marginBottom: 35,
                            borderRadius: 100,
                            backgroundColor: "white",

                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            shadowOpacity: 0.27,
                            shadowRadius: 4.65,
                            elevation: 6,
                        }}
                    />
                    <MainMenu />
                </View>
            </View>
            <BottomSheet
                handleComponent={() => (
                    // "News" title component
                    // TODO: add button to open and close the sheet
                    <View
                        style={{
                            zIndex: 2000000,
                            padding: 25,
                            flex: 1,
                            backgroundColor: background,
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                        }}
                    >
                        <Title>News</Title>
                    </View>
                )}
                onAnimate={progress => {
                    if (progress == 1 && scrollViewRef.current) {
                        scrollViewRef.current.scrollTo({ y: 0, animated: true })
                    }
                }}
                ref={bottomSheetRef}
                style={{
                    // Shadow below
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
                index={0} // starts closed
                // TODO: get right height programmatically, not just 50%
                snapPoints={["50%", Dimensions.get("window").height - 106]}
                animateOnMount={false} // should begin stationary
            >
                <BottomSheetScrollView ref={scrollViewRef}>
                    <View
                        // TODO: Everything below is just a placeholder
                        style={{
                            zIndex: 2,
                            minHeight: 2000,
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
            </BottomSheet>
            {/* </ScrollView> */}
        </View>
    )
}
