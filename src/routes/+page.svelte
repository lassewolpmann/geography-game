<script lang="ts">
    import type { PageData } from './$types';
    import type { CountryData } from "$lib/types/CountryData";
    import { Game } from "$lib/classes/Game";

    export let data: PageData;

    const countryData: CountryData[] = data.countryData;
    const game = new Game(countryData);
</script>
<style>
    main {
        width: 100vw;
        height: 100vh;

        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 5px;

        font-family: 'Poppins', sans-serif;
        font-size: 24px;
    }

    table, form, .previous-guesses {
        width: min(800px, 90vw);
    }

    form {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        margin-top: 15px;
    }

    form > input {
        font-size: 24px;
    }

    form > button {
        font-size: 16px;
        font-weight: 800;
        padding: 15px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        background: #eee;
    }

    form > button:hover {
        background: #ccc;
    }

    .hint {
        color: transparent;
        text-shadow: 0 0 16px #000;
    }

    .hint > td > img {
        height: 50px;
        filter: opacity(0);
    }

    .hint.visible > td > img {
        filter: opacity(1);
        transition: all 0.2s ease;
    }

    .hint.visible {
        color: inherit;
        text-shadow: none;
        transition: all 0.2s ease;
    }

    caption {
        font-size: 32px;
        font-weight: 800;
        text-align: left;
    }

    tr > td:last-child {
        text-align: right;
    }

    .previous-guesses {
        height: 30px;
    }
</style>
<main>
    <table class="hints">
        <caption>Hints</caption>
        <tbody>
            <tr class="hint" class:visible={game.guessIndex >= 0}>
                <td>Continents</td>
                <td>{game.country.continents.join(', ')}</td>
            </tr>
            <tr class="hint" class:visible={game.guessIndex >= 1}>
                <td>Landlocked</td>
                <td>{game.country.landlocked}</td>
            </tr>
            <tr class="hint" class:visible={game.guessIndex >= 2}>
                <td>Area</td>
                <td>{new Intl.NumberFormat(undefined, { style: 'decimal' }).format(game.country.area)} km²</td>
            </tr>
            <tr class="hint" class:visible={game.guessIndex >= 3}>
                <td>Population</td>
                <td>{new Intl.NumberFormat(undefined, { style: 'decimal' }).format(game.country.population)}</td>
            </tr>
            <tr class="hint" class:visible={game.guessIndex >= 4}>
                <td>Side of driving</td>
                <td>{game.country.car.side}</td>
            </tr>
            <tr class="hint" class:visible={game.guessIndex >= 5}>
                <td>Capital(s)</td>
                <td>{game.country.capital.join(', ')}</td>
            </tr>
            <tr class="hint" class:visible={game.guessIndex >= 6}>
                <td>Language(s)</td>
                <td>{Object.values(game.country.languages).join(', ')}</td>
            </tr>
            <tr class="hint" class:visible={game.guessIndex >= 7}>
                <td>Flag</td>
                <td><img src="{game.country.flags.svg.toString()}" alt="{game.country.flags.alt}"></td>
            </tr>
            <tr class="hint" class:visible={game.guessIndex >= 8}>
                <td>Name</td>
                <td>{game.country.name.common}</td>
            </tr>
        </tbody>
    </table>
    <form on:submit={() => game.guessIndex = game.checkGuess()}>
        <input type="text" id="guess" name="guess" list="country-list" bind:value={game.countryGuess}>
        <button type="submit">Check answer</button>

        <datalist id="country-list">
            {#each countryData as country}
                <option>{country.name.common}</option>
            {/each}
        </datalist>
    </form>

    <div>
        <p>Distance to correct guess (capital to capital): {game.distanceToCorrectGuess}</p>
        <h4>Previous guesses: </h4>
        <p class="previous-guesses">{game.previousGuesses.join(', ')}</p>
    </div>
</main>