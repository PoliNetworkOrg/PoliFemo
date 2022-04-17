import React, { useState } from "react"
import AppClassic from "./src/pages/AppClassic"
import { IntroSlider } from "./src/pages/IntroSlider"

export default function App() {
    const [realApp, setRealApp] = useState(false)

    if (realApp) return <AppClassic />
    else return <IntroSlider onDone={() => setRealApp(true)} />
}
