import React, { useEffect, useState } from "react"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import { View, Pressable, FlatList } from "react-native"
import { usePalette } from "utils/colors"
import { Title, BodyText } from "components/Text"
import { DateTimePicker } from "components/FreeClass/DateTimePicker/DateTimePicker"
import { PageWrapper } from "components/Groups/PageWrapper"

export interface HeadquarterItem {
  acronym: string
  name: string[]
}

const headquarterList: HeadquarterItem[] = [
  { acronym: "MIA", name: ["Milano", "Città Studi"] },
  { acronym: "MIB", name: ["Milano", "Bovisa"] },
  { acronym: "CRG", name: ["Cremona"] },
  { acronym: "LCF", name: ["Lecco"] },
  { acronym: "PCL", name: ["Piacenza"] },
  { acronym: "MNI", name: ["Mantova"] },
  { acronym: "MIC", name: ["Residenze"] },
  { acronym: "MID", name: ["Sesto", "Ulteriano"] },
  { acronym: "COE", name: ["Como"] },
]

/**
 * In this page the user can select the campus.
 */
export const HeadquarterChoice: MainStackScreen<
  "HeadquarterChoice"
> = props => {
  const { navigate } = useNavigation()
  const { palette } = usePalette()

  const { currentDate } = props.route.params

  //non-ISO format for simplicity (local timezone) and
  // compatibility with `handleConfirm` function
  const [date, setDate] = useState<Date>(
    new Date(currentDate) !== new Date() ? new Date(currentDate) : new Date()
  )

  useEffect(() => {
    setDate(new Date(currentDate))
  }, [props.route.params.currentDate])

  return (
    <PageWrapper style={{ marginTop: 106 }}>
      <View style={{ paddingTop: 28 }}>
        <Title style={{ paddingLeft: 28 }}>Sede</Title>
        <DateTimePicker date={date} setDate={(date: Date) => setDate(date)} />
      </View>
      <FlatList
        style={{
          flex: 1,
          marginTop: 53,
          marginBottom: 93,
        }}
        showsVerticalScrollIndicator={true}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginHorizontal: 22,
        }}
        data={headquarterList}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={{
              backgroundColor: palette.primary,
              borderRadius: 12,
              width: "45%",
              height: 93,
              marginHorizontal: 9,
              marginBottom: 54,
              alignItems: "center",
            }}
            onPress={() =>
              navigate("CampusChoice", {
                headquarter: item,
                currentDate: date.toISOString(),
              })
            }
          >
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BodyText
                style={{
                  fontWeight: item.name.length > 1 ? "300" : "900",
                  color: "white",
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                {item.name[0]}
              </BodyText>
              {item.name.length > 1 ? (
                <BodyText
                  style={{
                    fontWeight: "900",
                    color: "white",
                    fontSize: 20,
                    textAlign: "center",
                  }}
                >
                  {item.name[1]}
                </BodyText>
              ) : undefined}
            </View>
          </Pressable>
        )}
      />
    </PageWrapper>
  )
}
