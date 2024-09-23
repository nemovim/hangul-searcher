# Hangul Searcher
Hangul-Searcher는 한글 검색 및 자동 완성을 위한 JS 모듈입니다. 텍스트 배열을 받아 생성한 인스턴스를 통해 검색 및 자동 완성을 수행합니다. 자동 완성은 초성 검색도 고려합니다.

Test the Hangul-Searcher on this [Demo Website](https://hangul-searcher.vercel.app)!

Hangul-Searcher is a search and automatic completion module for Hangul. It is based on `es-hangul` and `minisearch` modules.

## Installation
```bash
$ npm install hangul-search
```

## Usage
```js
import HangulSearcher from 'hangul-searcher';
const stringArr = ['한글', '검색', '자동', '오이', '완성', '완제품', '왕', '여왕', 'foo', 'bar', '한글 검색'];
const hangulSearcher = new HangulSearcher(stringArr);
```
The strings do not have to be all Hangul.

## Search
```js
hangulSearcher.search('한글'); // ['한글']
```
When the query is exactly matched, it returns an array with the query itself.

```js
hangulSearcher.search('한');
/* [{ original: '한글', score: 13.xx, ... },
    { original: '한글 검색', score: 11.xx, ... },
     ...
    { original: '자동', score: 1.xx, ... }] */
```
When the query is not matched, it returns an array with the result objects. Each object has `original` and `score` keys (It has other keys, but it would not be meaningful for Hangul.). The `original` value is the result text, and the `score` value is the score measured by how much the query and result text are matched.

The search function can receive the `minisearch` options as an argument.
```js
hangulSearcher.search('한글', { fuzzy: 2 });
```
*Hangul searcher searches words by formatting Hangul words (i.e., one Hangul character is converted to more than three characters). Therefore, the fuzzy option would not be effective. In other words, the fuzzy option is already applied to the Hangul searcher by default.*

## Auto Completion
```js
hangulSearcher.autoComplete('와'); // ['완성', '완제품', '왕', '여왕', '오이']
```

