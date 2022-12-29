// ! this is to test Settings Page. Likely to change

export interface User {
    codPersona: string
    careers: Career[]
    firstname: string
    lastname: string
    profilePic?: string
}

export interface Career {
    matricola: string
    type?: string // Visitatore - Studente - Studente - titolo conseguito
}
