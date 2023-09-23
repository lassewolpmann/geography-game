<script lang="ts">
    import type { PageData } from './$types';
    import type { CountryData } from "$lib/types/CountryData";
    import { Game } from "$lib/classes/Game";

    export let data: PageData;

    const countryData: CountryData[] = data.countryData;
    const game = new Game(countryData);

    const submitGuess = () => {
        game.guessIndex = game.checkGuess()
        game.countryGuess = '';
    }
</script>
<style>
    main {
        width: 100vw;
        padding: 50px 10px;
        height: 100vh;

        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column;
        gap: 5px;

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
        font-weight: 800;
        flex: 4;
        box-sizing: border-box;
        border: none;
        background: rgba(150, 150, 150, 0.2);
        padding: 10px;
        height: 100%;
        color: inherit;
    }

    form > input.invalid {
        background: rgba(255, 0, 0, 0.2);
    }

    form > input:placeholder-shown {
        background: rgba(150, 150, 150, 0.2);
    }

    form > .submit-button {
        font-size: 16px;
        font-weight: 800;
        padding: 5px 10px;
        border: none;
        cursor: pointer;
        color: inherit;
        background: rgba(255, 255, 255, 0.2);
        flex: 1;
        height: 100%;
    }

    form > .submit-button:hover {
        background: rgba(255, 255, 255, 0.3);
    }

    .hint {
        color: transparent;
        text-shadow: 0 0 16px #ddd;
    }

    .hint > td > img {
        margin: 0;
        height: 48px;
        border: none;
        border-radius: 5px;
        filter: opacity(0);
        vertical-align: middle;
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

    @media only screen and (max-width: 768px) {
        main, form > input {
            font-size: 16px;
        }

        caption {
            font-size: 24px;
        }
    }
</style>
<main>
    <table class="hints">
        <caption>What country is this?</caption>
        <tbody>
            <tr class="hint" class:visible={game.guessIndex >= 0}>
                <td><i class="fa-solid fa-globe"></i> Region</td>
                <td>{game.country.region} <span style="color: #7a7a7a">({game.country.subregion})</span></td>
            </tr>
            <tr class="hint" class:visible={game.guessIndex >= 0}>
                <td><i class="fa-solid fa-water"></i> Landlocked</td>
                {#if game.country.landlocked}
                    <td><i class="fa-solid fa-check"></i></td>
                {:else}
                    <td><i class="fa-solid fa-xmark"></i></td>
                {/if}
            </tr>
            <tr class="hint" class:visible={game.guessIndex >= 0}>
                <td><i class="fa-solid fa-chart-area"></i> Area</td>
                <td>{new Intl.NumberFormat(undefined, { style: 'decimal' }).format(game.country.area)} km²</td>
            </tr>
            <tr class="hint" class:visible={game.guessIndex >= 1}>
                <td><i class="fa-solid fa-people"></i> Population</td>
                <td>{new Intl.NumberFormat(undefined, { style: 'decimal' }).format(game.country.population)}</td>
            </tr>
            <tr class="hint" class:visible={game.guessIndex >= 2}>
                <td><i class="fa-solid fa-car"></i> Side of driving</td>
                <td>{game.country.car.side}</td>
            </tr>
            <tr class="hint" class:visible={game.guessIndex >= 3}>
                <td><i class="fa-solid fa-city"></i> Capital(s)</td>
                <td>{game.country.capital.join(', ')}</td>
            </tr>
            <tr class="hint" class:visible={game.guessIndex >= 4}>
                <td><i class="fa-solid fa-language"></i> Language(s)</td>
                <td>{Object.values(game.country.languages).join(', ')}</td>
            </tr>
            <tr class="hint" class:visible={game.guessIndex >= 5}>
                <td><i class="fa-solid fa-flag"></i> Flag</td>
                <td><img src="{game.country.flags.svg.toString()}" alt="{game.country.flags.alt}"></td>
            </tr>
            <tr class="hint" class:visible={game.guessIndex >= 6}>
                <td><i class="fa-regular fa-input-text"></i> Name</td>
                <td>{game.country.name.common}</td>
            </tr>
        </tbody>
    </table>
    <form on:submit={submitGuess}>
        <input type="text" list="country-list" bind:value={game.countryGuess} class:invalid={!game.isValidGuess()} placeholder="Your guess">
        <input type="submit" value="Guess" class="submit-button" />

        <datalist id="country-list">
            {#each countryData as country}
                <option>{country.name.common}</option>
            {/each}
        </datalist>
    </form>

    <div class="previous-guesses">
        <h4>Previous guesses: </h4>
        <ul>
            {#each game.previousGuesses as guess}
                    <li>{guess}</li>
            {/each}
        </ul>
    </div>
</main>