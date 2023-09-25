import type { CountryData } from "$lib/types/CountryData";

export class Game {
    public guessIndex: number;
    public maxHints: number;
    public countryGuess: string;
    public previousGuesses: string[][];
    public readonly countryData: CountryData[];
    public country: CountryData;

    private guessCoords: number[];
    private distanceToCorrectGuess: string;

    constructor(countryData: CountryData[]) {
        this.guessIndex = 0;
        this.maxHints = 0;
        this.countryGuess = '';
        this.previousGuesses = [];
        this.countryData = countryData;
        this.country = this.chooseRandomCountry();

        this.guessCoords = [0, 0];
        this.distanceToCorrectGuess = '';
    }

    chooseRandomCountry(): CountryData {
        const randomNumber: number = Math.floor(Math.random() * this.countryData.length);
        const randomCountry: CountryData | undefined = this.countryData.at(randomNumber);

        if (randomCountry) {
            return randomCountry
        } else {
            return {} as CountryData
        }
    }

    startNewRound(dialog: HTMLDialogElement): number {
        dialog.close();
        this.guessIndex = 0;
        this.countryGuess = '';
        this.previousGuesses = [];
        this.country = this.chooseRandomCountry();

        return this.guessIndex;
    }

    checkGuess(dialog: HTMLDialogElement): number {
        this.findCoordsOfGuess();

        if (!this.countryGuess) return this.guessIndex;
        if (!this.isValidGuess()) return this.guessIndex;

        const guess: string = this.countryGuess.toLowerCase();
        const common: string = this.country.name.common.toLowerCase();
        const official: string = this.country.name.official.toLowerCase();

        if (guess === common || guess === official) {
            // Correct guess or last possible guess
            dialog.showModal();
        } else if (this.guessIndex === this.maxHints) {
            this.guessIndex += 1;
            dialog.showModal();
        } else {
            // Wrong guess but keep playing
            this.guessIndex += 1;
            this.previousGuesses.push([this.countryGuess, this.distanceToCorrectGuess]);
        }

        this.countryGuess = '';

        return this.guessIndex;
    }

    isValidGuess(): boolean {
        return this.returnDataOfGuessedCountry().length > 0
    }

    findCoordsOfGuess(): void {
        const guessedDataEntry = this.returnDataOfGuessedCountry()

        if (guessedDataEntry.length > 0) {
            const guessedData = guessedDataEntry.at(0);
            if (guessedData) this.guessCoords = guessedData.capitalInfo.latlng;

            this.calculateDistanceToCorrectCountry();
        }
    }

    calculateDistanceToCorrectCountry() {
        // source: https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
        const r = 6371;

        const lat1 = this.guessCoords.at(0);
        const lon1 = this.guessCoords.at(1);
        const lat2 = this.country.capitalInfo.latlng.at(0);
        const lon2 = this.country.capitalInfo.latlng.at(1);

        if (lat1 && lon1 && lat2 && lon2) {
            const dLat = this.deg2rad(lat2 - lat1);
            const dLon = this.deg2rad(lon2- lon1);

            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const d = r * c;
            const roundedD = Math.round(d);
            this.distanceToCorrectGuess = new Intl.NumberFormat(undefined, {style: 'unit', unit: 'kilometer'}).format(roundedD);
        }
    }

    deg2rad(deg: number): number {
        return deg * (Math.PI/180)
    }

    returnDataOfGuessedCountry(): CountryData[] {
        const guess: string = this.countryGuess.toLowerCase();
        return this.countryData.filter((country: CountryData) => {
            const common: string = country.name.common.toLowerCase();
            const official: string = country.name.official.toLowerCase();

            if (guess === common || guess === official) return true;
        })
    }
}