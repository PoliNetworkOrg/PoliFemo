import { HttpClient, RequestOptions } from "./HttpClient"

/* eslint-disable @typescript-eslint/naming-convention */

export interface GroupOptions {
    name?: string
    year?: string
    degree?: string
    type?: string
    platform?: string
    language?: string
    office?: string
}

export interface MockedGroup {
    name?: string
    year?: string
    id?: string
    degree?: string
    type?: string
    platform?: string
    language?: string
    office?: string
    school?: string
    idLink?: string
}

const client = HttpClient.getInstance()

/**
 * Collection of endpoints related to Groups.
 */
export const groups = {
    /**
     * Retrieves groups from PoliNetwork server.
     * Check {@link GroupOptions} for additional parameters.
     */
    // ! temporarily broken
    async get(groupsOptions?: GroupOptions, options?: RequestOptions) {
        const response = await client.poliNetworkInstance.get<any>(
            "/v1/groups/search",
            {
                ...options,
                params: {
                    name: groupsOptions?.name,
                    year: groupsOptions?.year,
                    degree: groupsOptions?.degree,
                    type: groupsOptions?.type,
                    platform: groupsOptions?.platform,
                    language: groupsOptions?.language,
                    office: groupsOptions?.office,
                },
            }
        )
        return response.data.results
    },
    getMocked() {
        return mockedGroups.groups
    },
}

//random information
const mockedGroups = {
    groups: [
        {
            name: "GRUPPO 1 ITA",
            year: "2022",
            id: "1",
            degree: "LT",
            type: "S",
            platform: "WA",
            language: "ITA",
            office: "Leonardo",
            school: "idk",
            idLink: "https://t.me/joinchat/9RcVXahIKchlMGZk",
        },
        {
            name: "GRUPPO 2 ITA",
            year: "2021",
            id: "1",
            degree: "LT",
            type: "S",
            platform: "TG",
            language: "ITA",
            office: "Leonardo",
            school: "idk",
            idLink: "https://t.me/joinchat/lcaKVtappk83NzU0",
        },
        {
            name: "GRUPPO 3 ENG",
            year: "2020",
            id: "1",
            degree: "LT",
            type: "C",
            platform: "TG",
            language: "ENG",
            office: "Leonardo",
            school: "idk",
            idLink: "https://chat.whatsapp.com/HDZd7mCzDg80dS4fCcSszy",
        },
        {
            name: "GRUPPO 4 ENG",
            year: "2020",
            id: "1",
            degree: "LT",
            type: "C",
            platform: "TG",
            language: "ENG",
            office: "Leonardo",
            school: "idk",
            idLink: "https://t.me/joinchat/YEBlpQ_fzoZmYzI0",
        },
        {
            name: "GRUPPO 5 ITA",
            year: "2020",
            id: "1",
            degree: "LT",
            type: "C",
            platform: "TG",
            language: "ITA",
            office: "Leonardo",
            school: "idk",
            idLink: "https://www.facebook.com/groups/170744940120942",
        },
        {
            name: "GRUPPO 6 ENG",
            year: "2020",
            id: "1",
            degree: "LT",
            type: "C",
            platform: "TG",
            language: "ENG",
            office: "Leonardo",
            school: "idk",
            idLink: "https://t.me/joinchat/_9vETcjqnX5iNzNk",
        },
    ],
}
