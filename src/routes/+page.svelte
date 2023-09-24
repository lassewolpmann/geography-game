<script lang="ts">
    import type { PageData } from './$types';
    import type { CountryData } from "$lib/types/CountryData";
    import { Game } from "$lib/classes/Game";

    export let data: PageData;
    let gameEndDialog: HTMLDialogElement;
    const countryData: CountryData[] = data.countryData;

    const game = new Game(countryData);
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

    /* Table settings */

    table {
        border-collapse: collapse;
    }

    table td {
        border-bottom: 3px solid #444;
        padding: 5px;
    }

    table td:last-child {
        text-align: right;
    }

    table tr:last-child td {
        border-bottom: none;
    }

    .show-first-letter::first-letter {
        color: #ddd;
        text-shadow: none;
    }

    .hidden {
        color: transparent;
        text-shadow: 0 0 16px #ddd;
    }

    img {
        height: 32px;
        vertical-align: middle;
    }

    img.hidden {
        filter: opacity(0);
    }

    caption {
        font-size: 32px;
        font-weight: 800;
        text-align: left;
    }

    /* Form settings */
    form {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        margin-top: 15px;
    }

    form input {
        flex: 4;
        box-sizing: border-box;
        border: none;
        background: #333;
        padding: 10px;
        height: 100%;

        color: #ddd;
        font-size: 24px;
        font-weight: 800;
    }

    form input.invalid {
        background: rgba(255, 0, 0, 0.1);
    }

    form input:placeholder-shown {
        background: #333;
    }

    form .submit-button {
        cursor: pointer;
        background: #444;
        flex: 1;
    }

    form .submit-button:hover {
        background: rgba(255, 255, 255, 0.3);
    }

    /* Game End Dialog */
    .game-end-dialog {
        border: none;
        border-radius: 15px;
        background: #222;
        color: #ddd;
    }

    .game-end-dialog::backdrop {
        background: rgba(0, 0, 0, 0.7);
    }

    .game-end-dialog button {
        cursor: pointer;
        background: #444;
        box-sizing: border-box;
        border: none;
        padding: 10px;
        color: #ddd;
        font-size: 24px;
        font-weight: 800;
    }

    @media only screen and (max-width: 768px) {
        main, form input {
            font-size: 16px;
        }

        caption {
            font-size: 24px;
        }
    }
</style>
<main>
    <table>
        <caption>What country is this?</caption>
        <tbody>
            <tr>
                <td><i class="fa-solid fa-globe"></i></td>
                <td>Region</td>
                <td>{game.country.region} <span style="color: #7a7a7a">({game.country.subregion})</span></td>
            </tr>
            <tr>
                <td><i class="fa-solid fa-chart-area"></i></td>
                <td>Area</td>
                <td>{new Intl.NumberFormat(undefined, { style: 'decimal' }).format(game.country.area)} km²</td>
            </tr>
            <tr>
                <td><i class="fa-solid fa-water"></i></td>
                <td>Landlocked</td>
                <td class:hidden={game.guessIndex < 1}>
                    {#if game.country.landlocked}
                        <i class="fa-solid fa-check"></i>
                    {:else}
                        <i class="fa-solid fa-xmark"></i>
                    {/if}
                </td>
            </tr>
            <tr>
                <td><i class="fa-solid fa-people"></i></td>
                <td>Population</td>
                <td class:hidden={game.guessIndex < 2}>{new Intl.NumberFormat(undefined, { style: 'decimal' }).format(game.country.population)}</td>
            </tr>
            <tr>
                <td><i class="fa-solid fa-car"></i></td>
                <td>Side of driving</td>
                <td class:hidden={game.guessIndex < 3}>{game.country.car.side}</td>
            </tr>
            <tr>
                <td><i class="fa-solid fa-city"></i></td>
                <td>Capital</td>
                <td class:hidden={game.guessIndex < 4} class="show-first-letter">{game.country.capital.at(0)}</td>
            </tr>
            <tr>
                <td><i class="fa-solid fa-language"></i></td>
                <td>Language(s)</td>
                <td class:hidden={game.guessIndex < 5} class="show-first-letter">{Object.values(game.country.languages).join(', ')}</td>
            </tr>
            <tr>
                <td><i class="fa-solid fa-flag"></i></td>
                <td>Flag</td>
                <td><img src="{game.country.flags.svg.toString()}" alt="{game.country.flags.alt}" class:hidden={game.guessIndex < 6}></td>
            </tr>
            <tr>
                <td><i class="fa-regular fa-input-text"></i></td>
                <td>Name</td>
                <td class:hidden={game.guessIndex < 7}>{game.country.name.common}</td>
            </tr>
        </tbody>
    </table>
    <form on:submit={() => game.guessIndex = game.checkGuess(gameEndDialog)}>
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

    <dialog bind:this={gameEndDialog} class="game-end-dialog">
        {#if game.guessIndex <= 6}
            <h3><i class="fa-solid fa-trophy"></i> You won!</h3>
            <p>It took you {game.guessIndex} hint(s) to find the country.</p>
        {:else}
            <h3><i class="fa-solid fa-face-frown-slight"></i> You lost!</h3>
            <p>You couldn't find the country with the given hints.</p>
        {/if}
        <button on:click={() => game.guessIndex = game.startNewRound(gameEndDialog)}>Start new round</button>
    </dialog>
</main>