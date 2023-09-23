import type { PageLoad } from './$types';
import type { CountryData } from "$lib/types/CountryData";

export const load: PageLoad = async ({ fetch }) => {
    const filter: string[] = ['name', 'capital', 'languages', 'landlocked', 'area', 'population', 'car',
        'region', 'subregion', 'flags', 'translations', 'unMember', 'capitalInfo'];
    const apiURL: URL = new URL('https://restcountries.com/v3.1/all');
    apiURL.searchParams.append('fields', filter.join(','))

    const res: Response = await fetch(apiURL);
    const data: CountryData[] = await res.json();

    // Only return countries that are UN members
    const filteredData = data.filter((country) => country.unMember);

    // Sort countries alphabetically by common country name
    filteredData.sort((a, b) => {
        if (a.name.common < b.name.common) {
            return -1
        } else if (a.name.common > b.name.common) {
            return 1
        } else {
            return 0
        }
    })

    return { countryData: filteredData }
};