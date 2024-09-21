# Hangul Search
Hangul Search is a search and automatic completion module for Hangul. It is based on `es-hangul` and `minisearch` modules.

## Installation
```bash
$ npm install hangul-search
```

## Usage
```js
import HangulSearcher from 'hangul-search';
const stringArr = ['한글', '검색', '자동', '오이', '완성', '완제품', '왕', '여왕', 'foo', 'bar', '한글 검색'];
const hangulSearcher = new HangulSearcher(stringArr);
```
The strings do not have to be all Hangul.

## Search
```js
hangulSearcher.search('한글'); //
```

The search function can receive the `minisearch` options as an argument.
```js
hangulSearcher.search('한글', { fuzzy: 2 });
```
*Hangul searcher searches words by formatting Hangul words (i.e., one Hangul character is converted to more than three characters). Therefore, the fuzzy option would not be effective. In other words, the fuzzy option is already applied to the Hangul searcher by default.*

## Auto Completion
```js
hangulSearcher.autoComplete('와'); //
```

