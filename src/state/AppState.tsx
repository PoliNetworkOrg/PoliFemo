/**
 * Global State properties, for now just theme and its setter.
 */

export interface SettingsStateProps {
    theme: string
    setTheme: React.Dispatch<React.SetStateAction<string>>
}

/**
 * Global State class
 */
export class AppState implements SettingsStateProps {
    theme: string
    setTheme: React.Dispatch<React.SetStateAction<string>>

    constructor(settings: SettingsStateProps) {
        this.theme = settings.theme
        this.setTheme = settings.setTheme
    }
}
