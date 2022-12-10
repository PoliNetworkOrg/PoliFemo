import React, { useState } from "react"
import { View } from "react-native"

import { RootStackScreen } from "navigation/NavigationTypes"
import {
    MainMenu,
    MainTitle,
    NewsBottomSheet,
    PoliSearchBar,
} from "components/Home"
import { usePalette } from "utils/colors"
import { HighlightsManager } from "components/Home/Highlights/HighlightsManager"
import openNavSVG from "assets/menu/open-nav.svg"
import { api, RetryType } from "api"
import AsyncStorage from "@react-native-async-storage/async-storage"

const DEFAULT_FETCH_INTERVAL = 1 * 24 * 60 * 60 * 1000 //1 day

/**
 * Home page containing the POLIFEMO logo, search bar, main horizontal scroll menu and the entry
 * point for the news section (which is a bottom sheet)
 */
export const Home: RootStackScreen<"Home"> = () => {
    const { homeBackground, background } = usePalette()

    const [search, setSearch] = useState("")

    /**
     * Lo scopo di questo useEffect è determinare se è passato `DEFAULT_FETCH_INTERVAL`
     * (al momento settato a 1 giorno) dall'ultima volta che è stato eseguito
     * un fetch degli articoli. Se la condizione è soddisfatta,
     * viene eseguito un fetch degli articoli con data di inizio pari alla data di
     * fine dell'ultimo fetch e data di fine pari a oggi, dopodichè salva
     * nell'asyncstorage la data di oggi in modo che sia disponibile alla
     * prossima apertura dell'app per rivalutare la condizione, etc...
     *
     * Se si tratta del primo fetch in assoluto, vengono richiesti dall'api
     * gli articoli pubblicati da 14 giorni fa in avanti e viene settata
     * la data di oggi nell'asyncStorage
     *
     * ? Questa logica (di prendere e settare date da async storage e
     * ? valutare quanto tempo era passato dall'ultima richiesta)
     * ? poteva essere implementata anche nell'oggeto api,
     * ? tuttavia questo mi sembrava il modo migliore, poichè deve
     * ? comunque essere valutata una condizione nella home se eseguire o
     * ? meno la richiesta, quindi mi sembrava sensato porre tutto in un posto
     *
     *
     */
    /* useEffect(() => {
        AsyncStorage.getItem("date:articles")
            .then(dateJSON => {
                const endDate = new Date() //today
                const end = endDate.toISOString() // this is ISO
                if (dateJSON) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const start: string = JSON.parse(dateJSON) //this is ISO
                    const startDate = new Date(start) //last time fetched
                    console.log()
                    //if some time has passed and articles need refetching => refetch
                    if (
                        endDate.getTime() - startDate.getTime() >
                        DEFAULT_FETCH_INTERVAL
                    ) {
                        api.getArticlesFromDateTillDate(
                            RetryType.RETRY_N_TIMES,
                            3,
                            3,
                            start,
                            end
                        )
                            .then(res => {
                                const articles = res
                                console.log(articles[0])
                                //now you can cache articles somewhere I guess
                                AsyncStorage.setItem(
                                    "date:articles",
                                    JSON.stringify(end)
                                ).catch(err => console.log(err))
                            })
                            .catch(err => console.log(err))
                    }
                } else {
                    api.getArticlesFromDaysAgoTillDate(
                        RetryType.RETRY_N_TIMES,
                        3,
                        3,
                        14,
                        end
                    )
                        .then(res => {
                            const articles = res
                            console.log(articles[0])
                            //now you can cache articles somewhere I guess
                            AsyncStorage.setItem(
                                "date:articles",
                                JSON.stringify(end)
                            ).catch(err => console.log(err))
                        })
                        .catch(err => console.log(err))
                }
            })
            .catch(err => console.log(err))
    }, []) */

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
                        paddingBottom: 190,
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
                    <PoliSearchBar
                        onChange={searchKey => setSearch(searchKey)}
                    />
                    <MainMenu filter={search} />
                    <HighlightsManager />
                </View>
            </View>
            <NewsBottomSheet />
        </View>
    )
}
