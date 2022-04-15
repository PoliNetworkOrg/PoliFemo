import * as React from "react"
import { View } from "react-native"
import styled, { css } from "styled-components/native"
import { SalutoConBottone } from "../../pages/SalutoConBottone"
import { CardSection } from "../CardSection"
import { Saluto } from "../Saluto"

interface IContainer {
    backgroundColor?: string
}

const DummyScreen: React.FC<IContainer> = ({ backgroundColor = "white" }) => (
    <Container backgroundColor={backgroundColor} />
)

const Container = styled.View<IContainer>`
    flex: 1;

    ${({ backgroundColor }) =>
        backgroundColor &&
        css`
            background-color: ${backgroundColor};
        `};
`

export default DummyScreen

export const DummyScreenOne = () => (
    <View>
        <Saluto />
    </View>
)

const cards: { titolo: string; sottotitolo: string }[] = []
for (let i = 0; i < 20; i++) {
    cards.push({
        titolo: `Titolo ${i}`,
        sottotitolo: `Sottotitolo ${i}`,
    })
}

export const DummyScreenTwo = () => (
    <CardSection titolo="Titolo" cards={cards} numColumns={3} />
)

export const DummyScreenThree = () => <DummyScreen backgroundColor="#20B2AA" />

export const DummyScreenFour = () => <DummyScreen backgroundColor="#4169E1" />
