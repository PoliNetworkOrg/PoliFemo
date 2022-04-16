import React, { FC } from "react"
import { View } from "react-native"
import { CardProps } from "../components/Card"
import { CardSection } from "../components/CardSection"

const menuItems = [
    {
        title: "PoliTinder",
        subtitle: "Trova nuove amicizie",
        imageURL:
            "https://www.iconpacks.net/icons/1/free-heart-icon-431-thumb.png",
        onClick: () => {
            console.log("ciao2")
        },
    },
    {
        title: "Aule libere",
        subtitle: "Trova le aule libere attorno a te!",
        imageURL:
            "https://previews.123rf.com/images/dacianlogan/dacianlogan1402/dacianlogan140200011/26057672-icono-plana-compass.jpg?fj=1",
    },
    {
        title: "News",
        subtitle: "Le news del Poli, confezionate per te",
        imageURL:
            "https://previews.123rf.com/images/tribalium123/tribalium1231208/tribalium123120800011/14836390-zeitung-icon.jpg?fj=1",
    },
    {
        title: "PoliFemo",
        subtitle: "Il tuo assistente personale!",
        imageURL:
            "https://media.istockphoto.com/vectors/cyclops-polyphemus-vector-id516139946",
    },
]

const cards: CardProps[] = []
for (let i = 0; i < menuItems.length; i++) {
    cards.push(menuItems[i])
}

export const Menu: FC = () => {
    return (
        <View>
            <CardSection title="Menu" cards={cards} numColumns={1} />
        </View>
    )
}
