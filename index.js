import MiniSearch from 'minisearch';
import { disassemble, getChoseong } from 'es-hangul';
import { getRegExp } from 'korean-regexp';

export default class HangulSearcher {
    searchOption;
    autoOption;

    #searcher;

    #originalArr = [];
    #choseongArr = [];

    #encode(string) {
        return string
            .split('')
            .map(
                (c) =>
                    '0x' +
                    Array.from(new TextEncoder().encode(c))
                        .map((utf8) => utf8.toString(16))
                        .join('')
            )
            .join('');
    }

    constructor(
        stringArr,
        searchOption = {},
        autoOption = { startsWithQuery: true, alwaysUsesChoseong: true }
    ) {
        this.searchOption = searchOption;
        this.autoOption = autoOption;

        this.#originalArr = stringArr.toSorted();

        this.#searcher = new MiniSearch({
            fields: ['original', 'disassembled'],
            storeFields: ['original'],
            tokenize: (string, _fieldName) => string.split('0x'),
        });

        const documentArr = this.#originalArr.reduce((prev, original, i) => {
            this.#choseongArr.push(
                disassemble(getChoseong(original)).replaceAll(' ', '')
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

    search(query, option = undefined) {
        option ??= this.searchOption;
        if (this.#originalArr.indexOf(query) !== -1) return [query];
        return this.#searcher.search(this.#encode(disassemble(query)), option);
    }

    autoComplete(query, option = undefined) {
        option ??= this.autoOption;
        this.autoOption.startsWithQuery ??= true;
        this.autoOption.alwaysUsesChoseong ??= true;

        query = query.replaceAll(' ', '');
        if (query === '') return this.#originalArr;

        const re = new RegExp(
            getRegExp(query, { startsWith: option.startsWithQuery })
        );

        const resultArr = this.#originalArr.filter(
            (word) => word.search(re) !== -1
        );

        const resultSet = new Set(resultArr);

        if (option.alwaysUsesChoseong || getChoseong(query) === query) {
            this.#choseongComplete(
                disassemble(getChoseong(query)),
                option
            ).forEach((string) => {
                if (!resultSet.has(string)) {
                    resultSet.add(string);
                    resultArr.push(string);
                }
            });
        }

        return resultArr;
    }

    #choseongComplete(query, option) {
        if (query === '') return [];

        const re = new RegExp(query, 'i');

        return this.#choseongArr.reduce((prev, choseong, index) => {
            if (choseong === '') return prev;
            if (
                (option.startsWithQuery && choseong.startsWith(query)) ||
                (!option.startsWithQuery && choseong.search(re) !== -1)
            ) {
                prev.push(this.#originalArr[index]);
            }
            return prev;
        }, []);
    }
}
