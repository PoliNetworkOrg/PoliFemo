import { useContext, useState } from "react"
import { View } from "react-native"
import { SettingsStackScreen, useNavigation } from "navigation/NavigationTypes"
import { Divider } from "components/Divider"
import { SettingTile } from "components/Settings"
import { settingsIcons } from "assets/settings"
import { UserDetailsTile } from "components/Settings"
import { CareerTile } from "components/Settings"
import { SelectTile } from "components/Settings"
import { UserAnonymousTile } from "components/Settings"
import { SettingsContext, ValidColorSchemeName } from "contexts/settings"
import { CareerColumn } from "components/Settings"
import { LoginContext } from "contexts/login"
import { Career } from "api/collections/user"
import { HttpClient } from "api/HttpClient"
import { Modal } from "components/Modal"
import { useTranslation } from "react-i18next"
import { Linking } from "react-native"
import { ScrollPage } from "components/PageLayout"

const themes: string[] = ["settings_default", "settings_dark", "settings_light"]
const themesToSave: ValidColorSchemeName[] = ["predefined", "dark", "light"]

const client = HttpClient.getInstance()
/**
 * Settings Page
 */
export const SettingsPage: SettingsStackScreen<"Settings"> = () => {
  const { t } = useTranslation("settings")

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

  return (
    <>
      <ScrollPage upperTitle={"" + t("settings_title")}>
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
        <SettingTile
          title={t("settings_appearance")}
          subtitle="Dark, light mode"
          icon={settingsIcons.modify}
          callback={() => {
            setModalThemeVisible(true)
          }}
        />
        <SettingTile
          title={t("settings_language")}
          icon={settingsIcons.modify}
          callback={() => {
            void Linking.openSettings()
          }}
        />
        <SettingTile
          title={t("settings_infoAppTitle")}
          subtitle={"" + t("settings_infoAppSubTitle")}
          icon={settingsIcons.help}
          callback={() => {
            navigate("About")
          }}
        />
        <SettingTile
          title="Privacy"
          subtitle={"" + t("settings_privacySubTitle")}
          icon={settingsIcons.privacy}
          callback={() => {
            navigate("Privacy")
          }}
        />
        {loggedIn && (
          <>
            <Divider />
            <SettingTile
              title={t("settings_logout")}
              icon={settingsIcons.disconnect}
              callback={async () => {
                await client.destroyTokens()
              }}
            />
          </>
        )}
      </ScrollPage>

      <Modal
        title={t("settings_chooseTheme")}
        centerText
        isShowing={isModalThemeVisible}
        buttons={[
          {
            light: true,
            text: "" + t("cancel", { ns: "common" }),
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
              value={"" + t(themeName)}
              selected={selectedTheme === themesToSave[index]}
              onPress={() => {
                setSelectedTheme(themesToSave[index])
              }}
            />
          )
        })}
      </Modal>
      <Modal
        title={t("settings_changeId")}
        centerText
        isShowing={isModalCareerVisible}
        buttons={[
          {
            light: true,
            text: "" + t("cancel", { ns: "common" }),
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
    </>
  )
}
