import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { NotificationDisplayer } from "components/Notifications/NotificationDisplayer"
import { Title } from "components/Text"
import { MainStackScreen } from "navigation/NavigationTypes"
import { View } from "react-native"

export const NotificationDetails: MainStackScreen<
  "NotificationDetails"
> = props => {
  const { notification, category } = props.route.params

  return (
    <ContentWrapperScroll>
      <View style={{ paddingTop: 28, flex: 1, marginBottom: 50 }}>
        {category && <Title style={{ paddingLeft: 28 }}>{category}</Title>}
        <NotificationDisplayer notification={notification} />
      </View>
    </ContentWrapperScroll>
  )
}
