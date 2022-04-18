import React, { FC } from "react"
import { Menu } from "./Menu"
import { Text } from "react-native"
import { AuleLibere } from "./AuleLibere"
import { Impostazioni } from "./Impostazioni"
import { Article } from "./Article"
import { Dating } from "./Dating"

const menuItems: {
    title: string
    subtitle: string
    imageURL: string
    icon?: string
    onClick?: any
    view?: any
}[] = [
    {
        title: "PoliTinder",
        subtitle: "Trova nuove amicizie",
        imageURL:
            "https://www.iconpacks.net/icons/1/free-heart-icon-431-thumb.png",
        icon: "heart",
        view: <Dating />,
    },
    {
        title: "Aule libere",
        subtitle: "Trova le aule libere attorno a te!",
        imageURL:
            "https://previews.123rf.com/images/dacianlogan/dacianlogan1402/dacianlogan140200011/26057672-icono-plana-compass.jpg?fj=1",
        icon: "pushpin",
        view: <AuleLibere />,
    },
    {
        title: "News",
        subtitle: "Le news del Poli, confezionate per te",
        imageURL:
            "https://previews.123rf.com/images/tribalium123/tribalium1231208/tribalium123120800011/14836390-zeitung-icon.jpg?fj=1",
        icon: "filetext1",
        view: <Article title="Titolo articolo..." imageURLs={[]} />,
    },
    {
        title: "PoliFemo",
        subtitle: "Il tuo assistente personale!",
        imageURL:
            "https://media.istockphoto.com/vectors/cyclops-polyphemus-vector-id516139946",
        icon: "eye",
    },
    {
        title: "Impostazioni",
        subtitle: "",
        imageURL:
            "https://cdn.icon-icons.com/icons2/1632/PNG/512/62971gear_109245.png",
        icon: "setting",
        view: <Impostazioni />,
    },
]

export const MenuChange: FC<{
    onChangeIcon: any
    onChangeText: any
    CurrentMenuView: any
}> = props => {
    const [CurrentView, setCurrentView] = props.CurrentMenuView
    return CurrentView == -1 ? (
        <Menu
            onChangeIcon={props.onChangeIcon}
            onChangeText={props.onChangeText}
            menuItems={menuItems}
            itemChanged={setCurrentView}
        />
    ) : (
        menuItems[CurrentView].view ?? (
            <Text style={{ padding: 100, textAlign: "center" }}>
                {menuItems[CurrentView].title}
            </Text>
        )
    )
}
