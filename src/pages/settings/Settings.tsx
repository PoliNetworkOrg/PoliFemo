import { useContext, useState } from "react"
import { View } from "react-native"
import { SettingsStackScreen, useNavigation } from "navigation/NavigationTypes"
import { ContentWrapperScroll } from "components/Settings"
import { Divider } from "components/Divider"
import { SettingTile, SettingOptions } from "components/Settings"
import { settingsIcons } from "assets/settings"
import { UserDetailsTile } from "components/Settings"
import { CareerTile } from "components/Settings"
import { SelectTile } from "components/Settings"
import { UserAnonymousTile } from "components/Settings"
import { SettingsContext, ValidColorSchemeName } from "contexts/settings"
import { CareerColumn } from "components/Settings"
import { LoginContext } from "contexts/login"
import { Career } from "api/user"
import { HttpClient } from "api/HttpClient"
import { Modal } from "components/Modal"
import { checkPlayServicesExample } from "utils/checkGooglePlayServices"
import { Alert } from "react-native"

const themes: string[] = ["Predefinito", "Scuro", "Chiaro"]
const themesToSave: ValidColorSchemeName[] = ["predefined", "dark", "light"]

const client = HttpClient.getInstance()
/**
 * Settings Page
 */
export const SettingsPage: SettingsStackScreen<"Settings"> = () => {
  //for testing logged in/out view
  const { loggedIn, userInfo } = useContext(LoginContext)
  const { settings, setSettings } = useContext(SettingsContext)
  const theme = settings.theme

  //RadioButtonGroup theme state and setter
  const [selectedTheme, setSelectedTheme] =
    useState<ValidColorSchemeName>(theme)

  //actual career and setter. It will be moved in app state eventually.
  const [career, setCareer] = useState<Career | undefined>(userInfo?.careers[0])

  //currently selected career and setter.
  const [selectedCareer, setSelectedCareer] = useState<Career>(
    career ?? {
      matricola: "N/A",
      type: "Nessuna Carriera",
    }
  )

  //control theme selector modal's visibility
  const [isModalThemeVisible, setModalThemeVisible] = useState(false)

  //control career selector modal's visibility
  const [isModalCareerVisible, setModalCareerVisible] = useState(false)

  const { navigate } = useNavigation()

  const settingsList: SettingOptions[] = [
    {
      title: "Aspetto",
      subtitle: "Dark, light mode",
      icon: settingsIcons.modify,
      callback: () => {
        setModalThemeVisible(true)
      },
    },
    {
      title: "Su quest'app",
      subtitle: "Informazioni sull'app, versione, contatti",
      icon: settingsIcons.help,
      callback: () => {
        navigate("About")
      },
    },
    {
      title: "Privacy",
      subtitle:
        "Informativa sulla privacy\nImpostazioni del tuo account relative alla privacy",
      icon: settingsIcons.privacy,
      callback: () => {
        navigate("Privacy")
      },
    },
    {
      title: "Check Google",
      subtitle: "Check Google",
      icon: settingsIcons.privacy,
      callback: () => {
        const result = checkPlayServicesExample()
        console.log(result)
        Alert.alert(
          "Google",
          String(result),
          [
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
          {
            cancelable: true,
          }
        )
      },
    },
    {
      title: "Disconnetti",
      icon: settingsIcons.disconnect,
      callback: async () => {
        await client.destroyTokens()
      },
    },
  ]

  return (
    <View style={{ flex: 1 }}>
      <ContentWrapperScroll title="Impostazioni">
        {loggedIn ? (
          <UserDetailsTile user={userInfo} />
        ) : (
          <UserAnonymousTile
            showRipple={false}
            onLogin={() => navigate("Login")}
          />
        )}
        {loggedIn && (
          <View>
            <CareerTile
              career={career ?? userInfo.careers[0]}
              onPress={() => setModalCareerVisible(true)}
            />
          </View>
        )}
        <Divider />

        {settingsList.map((setting, index) => {
          return <SettingTile setting={setting} key={index} />
        })}
      </ContentWrapperScroll>

      <Modal
        title={"Scegli Tema"}
        centerText
        isShowing={isModalThemeVisible}
        buttons={[
          {
            light: true,
            text: "Annulla",
            onPress: () => {
              //restore real theme value
              setSelectedTheme(theme)
              setModalThemeVisible(false)
            },
          },
          {
            text: "OK",
            onPress: () => {
              setSettings({ ...settings, theme: selectedTheme })
              setModalThemeVisible(false)
            },
          },
        ]}
      >
        {themes?.map((themeName, index) => {
          return (
            <SelectTile
              key={index}
              value={themeName}
              selected={selectedTheme === themesToSave[index]}
              onPress={() => {
                setSelectedTheme(themesToSave[index])
              }}
            />
          )
        })}
      </Modal>
      <Modal
        title={"Cambia Matricola"}
        centerText
        isShowing={isModalCareerVisible}
        buttons={[
          {
            light: true,
            text: "Annulla",
            onPress: () => {
              //restore selectedCareer to career
              if (career) setSelectedCareer(career)
              setModalCareerVisible(false)
            },
          },
          {
            text: "OK",
            onPress: () => {
              //change career to selectedCareer
              setCareer(selectedCareer)
              setModalCareerVisible(false)
            },
          },
        ]}
      >
        {userInfo?.careers?.map((careerOfIndex, index) => {
          return (
            <SelectTile
              key={index}
              selected={selectedCareer?.matricola === careerOfIndex.matricola}
              onPress={() => {
                setSelectedCareer(careerOfIndex)
              }}
              flexStyle={"space-between"}
            >
              <CareerColumn career={careerOfIndex} />
            </SelectTile>
          )
        })}
      </Modal>
    </View>
  )
}
