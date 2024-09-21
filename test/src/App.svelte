<script>
    import wordArr from './wordArr.js';
    import HangulSearcher from 'hangul-search';
    const stringArr = [
        '한글',
        '검색',
        '자동',
        '오이',
        '완성',
        '완제품',
        '왕',
        '여왕',
        'foo',
        'bar',
        '한글 검색',
    ];
    const hangulSearcher = new HangulSearcher(stringArr);

    let autoResult;
    let searchResult;
    let query = '';
    let dt = 0;

    $: {
        autoResult = hangulSearcher.autoComplete(query).slice(0, 20);
        searchResult = hangulSearcher.search(query).slice(0, 20);
    }
</script>

<h1>Hangul-Search Demo Site</h1>
<div id="input-div">
    <input
        id="search-input"
        type="text"
        placeholder="Input the query here"
        bind:value={query}
    />
</div>
<div id="container">
    <div>
        <h2>Auto completion</h2>
        {#if autoResult.length === 0}
            <p>None</p>
        {:else}
            {#each autoResult as word}
                <p>{word}</p>
            {/each}
        {/if}
    </div>
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
