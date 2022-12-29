// ! this is to test Settings Page. Likely to change

export interface User {
    codPersona: number
    careers: Career[]
    nome: string
    cognome: string
    profilePic?: string
}

export interface Career {
    matricola: number
    type?: string // Visitatore - Studente - Studente - titolo conseguito
}

export const mockedUser: User = {
    codPersona: 99999999,
    careers: [
        { matricola: 111111, type: "Studente" },
        { matricola: 222222, type: "Visitatore" },
        { matricola: 333333, type: "Studente - Titolo Conseguito" },
    ],
    nome: "Ferruccio",
    cognome: "Resta",
    profilePic:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
}
