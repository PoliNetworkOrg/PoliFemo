/**
 * Global State properties, for now just theme.
 */

export interface SettingsStateProps {
    theme: string
}

/**
 * App Settings class
 */
export class AppSettings implements SettingsStateProps {
    theme: string

    constructor(settings: SettingsStateProps) {
        this.theme = settings.theme
    }

    /**
     * method to create a new `AppSettings` object from an existing one
     * with changed values
     */
    public copyWith(newSettings: Partial<SettingsStateProps>): AppSettings {
        return new AppSettings({ theme: newSettings.theme ?? this.theme })
    }
}
