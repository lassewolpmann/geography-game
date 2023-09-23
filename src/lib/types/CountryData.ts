export interface CountryData {
    name: {
        common: string,
        official: string
    },
    capital: string[],
    languages: {
        [key: string]: string
    },
    translations: {
        [key: string]: {
            common: string,
            official: string
        }
    }
    landlocked: boolean,
    area: number,
    population: number,
    car: {
        signs: string[],
        side: string
    },
    continents: string[],
    flags: {
        png: URL,
        svg: URL,
        alt: string
    },
    unMember: boolean,
    capitalInfo: {
        latlng: number[]
    }
}