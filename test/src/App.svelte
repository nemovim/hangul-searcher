<script>
    import wordArr from './wordArr.js';
    import HangulSearcher from 'hangul-searcher';

    const hangulSearcherArr = [
        new HangulSearcher(wordArr, {}, {
            startsWithQuery: false,
            alwaysUsesChoseong: false,
        }),
        new HangulSearcher(wordArr, {}, {
            startsWithQuery: false,
            alwaysUsesChoseong: true,
        }),
        new HangulSearcher(wordArr, {}, {
            startsWithQuery: true,
            alwaysUsesChoseong: false,
        }),
        new HangulSearcher(wordArr, {}, {
            startsWithQuery: true,
            alwaysUsesChoseong: true,
        }),
    ];

    let autoResultArr = [[], [], [], []];

    let searchResult;

    let query = '';
    let re;

    let t;
    let dtArr = [0, 0, 0, 0];

    $: {
        for (let k = 0; k < 4; k++) {
            t = new Date().getTime();
            for (let i = 0; i < 50; i++) {
                autoResultArr[k] = hangulSearcherArr[k].autoComplete(query);
            }
            dtArr[k] = new Date().getTime() - t;
            autoResultArr[k] = autoResultArr[k].slice(0, 15);
        }

        searchResult = hangulSearcherArr[0].search(query).slice(0, 15);
    }
</script>

<h1>Hangul-Searcher Demo Site</h1>
<div id="input-div">
    <input
        id="search-input"
        type="text"
        placeholder="Input the query here"
        bind:value={query}
    />
</div>
<div id="container">
    {#each autoResultArr as autoResult, i}
        <div>
            <h2>Auto completion {i+1}</h2>
            <p style="font-size: 1rem">startsWithQuery: {hangulSearcherArr[i].autoOption.startsWithQuery}</p>
            <p>alwaysUsesChoseong: {hangulSearcherArr[i].autoOption.alwaysUsesChoseong}</p>
            {#if i == 3}
                <p><b>(default)</b></p>
            {/if}
            <br>
            {#if autoResult.length === 0}
                <p>None</p>
            {:else}
                {#each autoResult as word}
                    <p>{word}</p>
                {/each}
            {/if}
            <br>
            <p style="font-size: 0.8rem">Time taken for 50 times: {dtArr[i]}ms</p>
        </div>
    {/each}
    <div>
        <h2>Search</h2>
        {#if searchResult.length === 0}
            <p>None</p>
        {:else if searchResult.length === 1 && searchResult[0].score === undefined}
            <p>{searchResult[0]} | exactly matched</p>
        {:else}
            {#each searchResult as result}
                <p>{result.original} | score: {Math.round(result.score)}</p>
            {/each}
        {/if}
    </div>
</div>

<style>
    h1 {
        text-align: center;
        margin-bottom: 1rem;
    }

    #input-div {
        display: flex;
        justify-content: center;
    }

    #container {
        display: flex;
        justify-content: space-around;
    }

    #search-input {
        font-size: 1rem;
        padding: 0.3rem 0.5rem;
        width: 50vw;
        margin-bottom: 1rem;
    }
</style>
