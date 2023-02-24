import { useNavigation } from "@react-navigation/native"
import { ConstructionType } from "api/rooms"
import { BodyText } from "components/Text"
import { BuildingItem } from "pages/FreeClass/BuildingChoice"
import { CampusItem } from "pages/FreeClass/CampusChoice"
import { HeadquarterItem } from "pages/FreeClass/HeadquarterChoice"
import React, { FC } from "react"
import { FlatList, Pressable, View } from "react-native"
import { usePalette } from "utils/colors"

interface DefaultListProps<T> {
  dataToShow: T[]
  currentDate: Date
}

/**
 * This component is useful to display a list of max 2 columns and it is used in the following pages:
 * -HeadquarterChoice.tsx
 * -CampusChoice.tsx
 * -BuildingChoice.tsx
 * The structure is similar, some differences are applied for the buildings.
 */
export const DefaultList: FC<
  DefaultListProps<HeadquarterItem | CampusItem | BuildingItem>
> = props => {
  const { palette } = usePalette()

  const { navigate } = useNavigation()

  return (
    <FlatList
      style={{
        flex: 1,
        marginTop: 53,
        marginBottom: 93,
      }}
      showsVerticalScrollIndicator={true}
      numColumns={2}
      columnWrapperStyle={{
        justifyContent:
          props.dataToShow.length > 1 ? "space-between" : "center",
        marginHorizontal: 22,
      }}
      data={props.dataToShow}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <Pressable
          style={{
            backgroundColor: palette.primary,
            borderRadius: 12,
            width: "45%",
            height: 93,
            marginHorizontal: 9,
            marginBottom: item.type === ConstructionType.BUILDING ? 34 : 54,
            alignItems: "center",
          }}
          onPress={() => {
            if (item.type === ConstructionType.HEADQUARTER) {
              navigate(
                "CampusChoice" as never,
                {
                  headquarter: item,
                  currentDate: props.currentDate.toISOString(),
                } as never
              )
            } else if (item.type === ConstructionType.CAMPUS) {
              navigate(
                "BuildingChoice" as never,
                {
                  campus: item,
                  currentDate: props.currentDate.toISOString(),
                } as never
              )
            } else {
              navigate(
                "ClassChoice" as never,
                {
                  building: item,
                  currentDate: props.currentDate.toISOString(),
                } as never
              )
            }
          }}
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
            {item.name.length > 1 ? (
              <BodyText
                style={{
                  fontWeight: "300",
                  color: "white",
                  fontSize: item.type === ConstructionType.BUILDING ? 36 : 20,
                  textAlign: "center",
                }}
              >
                {item.type === ConstructionType.BUILDING
                  ? item.name[0] + " "
                  : item.name[0] + "\n"}
                <BodyText
                  style={{
                    fontWeight: "900",
                    color: "white",
                    fontSize: item.type === ConstructionType.BUILDING ? 36 : 20,
                    textAlign: "center",
                  }}
                >
                  {item.name[1]}
                </BodyText>
              </BodyText>
            ) : (
              <BodyText
                style={{
                  fontWeight: "900",
                  color: "white",
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                {item.name[0]}
              </BodyText>
            )}
          </View>
        </Pressable>
      )}
    />
  )
}
