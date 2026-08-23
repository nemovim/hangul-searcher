import MiniSearch from "minisearch";
import { disassemble, getChoseong } from "es-hangul";
import { getRegExp } from "korean-regexp";
import type { SearchOptions, SearchResult } from "minisearch";

export type AutoOption = {
  startsWithQuery: boolean;
  alwaysUsesChoseong: boolean;
};
export type AutoOptionInput = Partial<AutoOption>;
export type { SearchResult };

export default class HangulSearcher {
  searchOption;
  autoOption;

  #searcher;

  #originalArr: string[] = [];
  #choseongArr: string[] = [];

  #encode(str: string): string {
    const encoder = new TextEncoder();

    return Array.from(str)
      .map(
        (c) =>
          "0x" +
          Array.from(encoder.encode(c))
            .map((utf8) => utf8.toString(16))
            .join(""),
      )
      .join("");
  }

  constructor(
    stringArr: string[],
    searchOption: SearchOptions = {},
    autoOption: AutoOptionInput = {},
  ) {
    this.searchOption = searchOption;
    this.autoOption = {
      startsWithQuery: autoOption.startsWithQuery ?? true,
      alwaysUsesChoseong: autoOption.alwaysUsesChoseong ?? true,
    };

    this.#originalArr = stringArr.toSorted();

    this.#searcher = new MiniSearch({
      fields: ["original", "disassembled"],
      storeFields: ["original"],
      tokenize: (string, _fieldName) => string.split("0x"),
    });

    const documentArr = this.#originalArr.reduce<
      { id: number; original: string; disassembled: string }[]
    >((prev, original, i) => {
      this.#choseongArr.push(
        disassemble(getChoseong(original, { keepNonHangul: true })).replaceAll(
          " ",
          "",
        ),
      );

      prev.push({
        id: i,
        original,
        disassembled: this.#encode(disassemble(original)),
      });

      return prev;
    }, []);

    this.#searcher.addAll(documentArr);
  }

  search(
    query: string,
    option?: SearchOptions,
  ): Array<string | SearchResult> {
    option ??= this.searchOption;
    if (this.#originalArr.indexOf(query) !== -1) return [query];
    return this.#searcher.search(this.#encode(disassemble(query)), option);
  }

  autoComplete(query: string, option?: AutoOptionInput): string[] {
    const resolvedOption: AutoOption = {
      startsWithQuery:
        option?.startsWithQuery ?? this.autoOption.startsWithQuery,
      alwaysUsesChoseong:
        option?.alwaysUsesChoseong ?? this.autoOption.alwaysUsesChoseong,
    };

    query = query.replaceAll(" ", "");
    if (query === "") return [...this.#originalArr];

    const re = new RegExp(
      getRegExp(query, { startsWith: resolvedOption.startsWithQuery }),
    );

    const resultArr = this.#originalArr.filter(
      (word) => word.search(re) !== -1,
    );

    const resultSet = new Set(resultArr);

    if (
      resolvedOption.alwaysUsesChoseong ||
      getChoseong(query, { keepNonHangul: true }) === query
    ) {
      this.#choseongComplete(
        disassemble(getChoseong(query, { keepNonHangul: true })),
        resolvedOption,
      ).forEach((string) => {
        if (!resultSet.has(string)) {
          resultSet.add(string);
          resultArr.push(string);
        }
      });
    }

    return resultArr;
  }

  #choseongComplete(query: string, option: AutoOption): string[] {
    if (query === "") return [];

    const normalizedQuery = query.toLocaleLowerCase();

    return this.#choseongArr.reduce<string[]>((prev, choseong, index) => {
      if (choseong === "") return prev;
      if (
        (option.startsWithQuery && choseong.startsWith(query)) ||
        (!option.startsWithQuery &&
          choseong.toLocaleLowerCase().includes(normalizedQuery))
      ) {
        prev.push(this.#originalArr[index]);
      }
      return prev;
    }, []);
  }
}
