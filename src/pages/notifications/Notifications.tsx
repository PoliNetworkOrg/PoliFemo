import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { NotificationData } from "components/Notifications"
import { Title } from "components/Text"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import { Pressable, View } from "react-native"
import { usePalette } from "utils/colors"

const fakeContent =
  // eslint-disable-next-line quotes
  'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.\n Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.'

const fakeData: NotificationData[] = [
  {
    object: "Prima notifica",
    sender: "Polimi Scacchi",
    content: fakeContent,
    date: new Date().toISOString(),
  },
  {
    object: "Seconda notifica",
    sender: "Polimi Scacchi",
    content: fakeContent,
    date: new Date().toISOString(),
    linkUrl:
      "https://images.unsplash.com/photo-1560174038-da43ac74f01b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2057&q=80",
  },
  {
    object: "Terza notifica",
    sender: "Polimi Scacchi",
    content: fakeContent,
    date: new Date().toISOString(),
  },
]

export const Notifications: MainStackScreen<"Notifications"> = () => {
  const { primary } = usePalette()

  const { navigate } = useNavigation()

  return (
    <ContentWrapperScroll marginTop={106}>
      <View style={{ paddingHorizontal: 28, paddingTop: 28 }}>
        <Title>Notifiche</Title>
        <View style={{ marginTop: 62 }}>
          <Pressable
            onPress={() =>
              navigate("NotificationsCategory", {
                category: "Comunicazioni Istituzionali",
                notifications: fakeData,
              })
            }
          >
            <View
              style={{
                flex: 1,
                height: 132,
                backgroundColor: primary,
                marginBottom: 34,
              }}
            />
          </Pressable>
          <Pressable
            onPress={() =>
              navigate("NotificationsCategory", {
                category: "Associazioni",
                notifications: fakeData,
              })
            }
          >
            <View
              style={{
                flex: 1,
                height: 132,
                backgroundColor: primary,
                marginBottom: 34,
              }}
            />
          </Pressable>
          <Pressable
            onPress={() =>
              navigate("NotificationsCategory", {
                category: "Nuovi Upload",
                notifications: fakeData,
              })
            }
          >
            <View
              style={{
                flex: 1,
                height: 132,
                backgroundColor: primary,
                marginBottom: 34,
              }}
            />
          </Pressable>
        </View>
      </View>
    </ContentWrapperScroll>
  )
}
