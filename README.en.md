# Hangul Searcher

[![npm version](https://img.shields.io/npm/v/hangul-searcher.svg)](https://www.npmjs.com/package/hangul-searcher)
[![npm downloads](https://img.shields.io/npm/dm/hangul-searcher.svg)](https://www.npmjs.com/package/hangul-searcher)

[한국어 버전](./README.md)

[Demo website](https://hangul-searcher.vercel.app)

A JavaScript module for Hangul search and autocomplete. It supports Korean initial-consonant search and can also process strings that contain non-Korean text.

Internally, it uses [`es-hangul`](https://github.com/toss/es-hangul), [`korean-regexp`](https://github.com/kimyongseok/korean-regexp), and [`MiniSearch`](https://github.com/lucaong/minisearch).

## Installation

```bash
npm install hangul-searcher
```

## Basic usage

```js
import HangulSearcher from "hangul-searcher";

const words = [
  "한글",
  "검색",
  "자동",
  "오이",
  "완성",
  "완제품",
  "왕",
  "여왕",
  "foo",
  "bar",
  "한글 검색",
];

const searcher = new HangulSearcher(words);
```

## Search

When the query exactly matches a string in the input array, the matching string is returned by itself.

```js
searcher.search("한글");
// ["한글"]
```

When there is no exact match, the method returns an array of MiniSearch result objects.

```js
searcher.search("한");
// [
//   { original: "한글", score: 13.15, ... },
//   { original: "한글 검색", score: 11.19, ... },
//   ...
// ]
```

`original` contains the original string and `score` represents its relevance to the query. Scores and result ordering may vary depending on the input data and MiniSearch version.

MiniSearch search options can be passed to an individual search.

```js
searcher.search("한글", { fuzzy: 2 });
```

They can also be set as the default search options when creating the instance.

```js
const searcher = new HangulSearcher(words, { fuzzy: 3 });
```

## Autocomplete

```js
searcher.autoComplete("와", {
  startsWithQuery: true,
  alwaysUsesChoseong: false,
});
// ["완성", "완제품", "왕"]
```

Autocomplete options can be set on the constructor or passed to an individual `autoComplete` call. When only some options are provided, the remaining values come from the defaults or the constructor configuration.

```js
const searcher = new HangulSearcher(words, {}, {
  startsWithQuery: true,
});

searcher.autoComplete("와", {
  alwaysUsesChoseong: false,
});
```

### `startsWithQuery`

The default is `true`. Matching follows the Korean matching rules from `korean-regexp`, with matches corresponding to the beginning of the string preferred.

```js
searcher.autoComplete("안", { startsWithQuery: true });
// For example: "안경", "아나운서", ...

searcher.autoComplete("안", { startsWithQuery: false });
// Also includes matches corresponding to the middle of a string
```

### `alwaysUsesChoseong`

The default is `true`. Both the original query and its initial consonants are used for autocomplete.

```js
searcher.autoComplete("안녕", { alwaysUsesChoseong: true });
// "안녕", "안녕하다", "아내", "아니", ...

searcher.autoComplete("안녕", { alwaysUsesChoseong: false });
// "안녕", "안녕하다", ...
```

When the query itself consists only of initial consonants, initial-consonant matching is still performed even if `alwaysUsesChoseong` is `false`.

## Default autocomplete options

When no autocomplete options are provided, these values are used:

```js
{
  startsWithQuery: true,
  alwaysUsesChoseong: true,
}
```

## License

MIT
