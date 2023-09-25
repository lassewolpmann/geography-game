<script lang="ts">
    import type { PageData } from './$types';
    import type { CountryData } from "$lib/types/CountryData";
    import { Game } from "$lib/classes/Game";

    export let data: PageData;
    let gameEndDialog: HTMLDialogElement;
    let hintsTable: HTMLTableSectionElement;
    const countryData: CountryData[] = data.countryData;

    const game = new Game(countryData);

    $: if (hintsTable) {
        game.maxHints = hintsTable.children.length - 2;
    }
</script>
<style>
    main {
        width: 100vw;
        height: 100vh;

        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column;
        gap: 5px;

        font-size: 24px;

        --primary-text-color: #ddd;
        --secondary-text-color: #7a7a7a;
        --btn-color: #444;
        --btn-hover-color: #666;
        --input-color: #222;
    }

    table, form, .previous-guesses {
        width: min(800px, 90vw);
    }

    caption, input, button {
        font-weight: 800;
    }

    .secondary {
        color: var(--secondary-text-color);
    }

    /* Table settings */
    .hints {
        border-collapse: collapse;
        margin: 20px 10px;
    }

    .hints td {
        border-bottom: 1px solid var(--btn-color);
        padding: 3px;
    }

    .hints td:last-child {
        text-align: right;
    }

    .hints tr:last-child td {
        border-bottom: none;
    }

    .show-first-letter::first-letter {
        color: var(--primary-text-color);
        text-shadow: none;
    }

    .hidden {
        color: transparent;
        text-shadow: 0 0 16px var(--primary-text-color);
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
        text-align: left;
    }

    /* Form settings */
    form {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    form input {
        flex: 4;
        border: none;
        background: var(--input-color);
        padding: 5px 10px;
        height: 100%;

        color: var(--text-color);
        font-size: 24px;
    }

    form input.invalid {
        background: rgba(255, 0, 0, 0.1);
    }

    form input:placeholder-shown {
        background: var(--input-color);
    }

    form .submit-button {
        cursor: pointer;
        background: var(--btn-color);
        flex: 1;
    }

    form .submit-button:hover {
        background: var(--btn-hover-color);
    }

    /* Game End Dialog */
    .game-end-dialog {
        border: none;
        border-radius: 15px;
        background: var(--input-color);
        color: var(--primary-text-color);
        text-align: center;
    }

    .game-end-dialog::backdrop {
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(4px);
    }

    .game-end-dialog button {
        cursor: pointer;
        background: var(--btn-color);
        border: none;
        padding: 10px;
        color: var(--primary-text-color);
        font-size: 24px;
    }

    .game-end-dialog button:hover {
        background: var(--btn-hover-color);
    }

    /* Previous guesses settings */
    .previous-guesses {
        margin: 20px 10px;
    }

    .previous-guesses caption {
        font-size: 24px;
    }

    .previous-guesses td {
        width: 50%;
    }

    @media only screen and (max-width: 768px) {
        main, form input, .previous-guesses caption {
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
        <tbody bind:this={hintsTable}>
            <tr>
                <td><i class="fa-regular fa-globe"></i></td>
                <td>Region</td>
                <td>{game.country.region}</td>
            </tr>
            <tr>
                <td><i class="fa-regular fa-globe-pointer"></i></td>
                <td>Sub-Region</td>
                <td class:hidden={game.guessIndex < 1}>{game.country.subregion}</td>
            </tr>
            <tr>
                <td><i class="fa-regular fa-chart-area"></i></td>
                <td>Area</td>
                <td class:hidden={game.guessIndex < 2}>{new Intl.NumberFormat(undefined, { style: 'decimal' }).format(game.country.area)} km²</td>
            </tr>
            <tr>
                <td><i class="fa-regular fa-water"></i></td>
                <td>Landlocked</td>
                <td class:hidden={game.guessIndex < 3}>
                    {#if game.country.landlocked}
                        <i class="fa-regular fa-check"></i>
                    {:else}
                        <i class="fa-regular fa-xmark"></i>
                    {/if}
                </td>
            </tr>
            <tr>
                <td><i class="fa-regular fa-people"></i></td>
                <td>Population</td>
                <td class:hidden={game.guessIndex < 4}>{new Intl.NumberFormat(undefined, { style: 'decimal' }).format(game.country.population)}</td>
            </tr>
            <tr>
                <td><i class="fa-regular fa-car"></i></td>
                <td>Side of driving</td>
                <td class:hidden={game.guessIndex < 5}>{game.country.car.side}</td>
            </tr>
            <tr>
                <td><i class="fa-regular fa-city"></i></td>
                <td>Capital</td>
                <td class:hidden={game.guessIndex < 6} class="show-first-letter">{game.country.capital.at(0)}</td>
            </tr>
            <tr>
                <td><i class="fa-regular fa-language"></i></td>
                <td>Language(s)</td>
                <td class:hidden={game.guessIndex < 7} class="show-first-letter">{Object.values(game.country.languages).join(', ')}</td>
            </tr>
            <tr>
                <td><i class="fa-regular fa-flag"></i></td>
                <td>Flag</td>
                <td><img src="{game.country.flags.svg.toString()}" alt="{game.country.flags.alt}" class:hidden={game.guessIndex < 8}></td>
            </tr>
            <tr>
                <td><i class="fa-regular fa-input-text"></i></td>
                <td>Name</td>
                <td class:hidden={game.guessIndex < 9}>{game.country.name.common}</td>
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

    <table class="previous-guesses">
        <caption>Previous guesses</caption>
        <tbody>
            {#each game.previousGuesses as guess}
                <tr>
                    <td>{guess.at(0)}</td>
                    <td class="secondary">{guess.at(1)}</td>
                </tr>
            {/each}
        </tbody>
    </table>

    <dialog bind:this={gameEndDialog} class="game-end-dialog">
        {#if game.guessIndex <= game.maxHints}
            <h3><i class="fa-solid fa-trophy"></i> You won!</h3>
            <p>It took you {game.guessIndex} hint(s) to find the country.</p>
        {:else}
            <h3><i class="fa-solid fa-face-frown-slight"></i> You lost!</h3>
            <p>You couldn't find the country with the given hints.</p>
        {/if}
        <button on:click={() => game.guessIndex = game.startNewRound(gameEndDialog)}>Start new round</button>
    </dialog>
</main>