# Hangul Searcher

[![npm version](https://img.shields.io/npm/v/hangul-searcher.svg)](https://www.npmjs.com/package/hangul-searcher)
[![npm downloads](https://img.shields.io/npm/dm/hangul-searcher.svg)](https://www.npmjs.com/package/hangul-searcher)

[English version](./README.en.md)

[데모 웹사이트](https://hangul-searcher.vercel.app)

한글 검색과 자동완성을 위한 JavaScript 모듈입니다. 한글 초성 검색을 지원하며, 한글이 아닌 문자열도 함께 처리할 수 있습니다.

내부적으로 [`es-hangul`](https://github.com/toss/es-hangul), [`korean-regexp`](https://github.com/kimyongseok/korean-regexp), [`MiniSearch`](https://github.com/lucaong/minisearch)를 사용합니다.

## 설치

```bash
npm install hangul-searcher
```

## 기본 사용법

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

## 검색

검색어가 배열의 문자열과 정확히 일치하면 해당 문자열 하나를 반환합니다.

```js
searcher.search("한글");
// ["한글"]
```

정확히 일치하지 않으면 MiniSearch의 검색 결과 객체 배열을 반환합니다.

```js
searcher.search("한");
// [
//   { original: "한글", score: 13.15, ... },
//   { original: "한글 검색", score: 11.19, ... },
//   ...
// ]
```

결과 객체의 `original`은 원본 문자열이고, `score`는 검색어와의 관련도입니다. 점수와 결과 순서는 입력 데이터와 MiniSearch 버전에 따라 달라질 수 있습니다.

검색 시 MiniSearch 옵션을 전달할 수 있습니다.

```js
searcher.search("한글", { fuzzy: 2 });
```

생성할 때 기본 검색 옵션으로 지정할 수도 있습니다.

```js
const searcher = new HangulSearcher(words, { fuzzy: 3 });
```

## 자동완성

```js
searcher.autoComplete("와", {
  startsWithQuery: true,
  alwaysUsesChoseong: false,
});
// ["완성", "완제품", "왕"]
```

자동완성 옵션은 생성자 또는 `autoComplete` 호출 시 지정할 수 있습니다. 일부 옵션만 전달하면 나머지는 기본값 또는 생성자에서 지정한 값을 사용합니다.

```js
const searcher = new HangulSearcher(words, {}, {
  startsWithQuery: true,
});

searcher.autoComplete("와", {
  alwaysUsesChoseong: false,
});
```

### `startsWithQuery`

기본값은 `true`입니다. `korean-regexp`의 한글 매칭 규칙을 사용해 검색어가 문자열의 앞부분에 해당하는 결과를 우선적으로 찾습니다.

```js
searcher.autoComplete("안", { startsWithQuery: true });
// 예: "안경", "아나운서" ...

searcher.autoComplete("안", { startsWithQuery: false });
// 문자열 중간에 검색어가 해당하는 결과도 포함
```

### `alwaysUsesChoseong`

기본값은 `true`입니다. 입력한 검색어와 검색어의 초성을 모두 자동완성에 사용합니다.

```js
searcher.autoComplete("안녕", { alwaysUsesChoseong: true });
// "안녕", "안녕하다", "아내", "아니" ...

searcher.autoComplete("안녕", { alwaysUsesChoseong: false });
// "안녕", "안녕하다" ...
```

초성만 입력한 경우에는 `alwaysUsesChoseong: false`여도 초성 검색이 수행됩니다.

## 자동완성 기본값

옵션을 지정하지 않으면 다음 값이 사용됩니다.

```js
{
  startsWithQuery: true,
  alwaysUsesChoseong: true,
}
```

## 라이선스

MIT
