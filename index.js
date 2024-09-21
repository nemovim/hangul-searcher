import MiniSearch from 'minisearch';
import { disassemble, getChoseong } from 'es-hangul';

export default class HangulSearcher {
    #searcher;

    #originalArr = [];
    #disassembledArr = [];
    #choseongArr = [];

    #encoder;

    #encode(string) {
        return string
            .split('')
            .map(
                (c) =>
                    '0x' +
                    Array.from(this.#encoder.encode(c))
                        .map((utf8) => utf8.toString(16))
                        .join('')
            )
            .join('');
    }

    constructor(stringArr) {
        this.#encoder = new TextEncoder();
        this.#originalArr = stringArr.toSorted();

        const documentArr = this.#originalArr.reduce((prev, original, i) => {
            const disassembled = disassemble(original);
            const choseong = getChoseong(original);

            this.#disassembledArr.push(disassembled.replaceAll(' ', ''));
            this.#choseongArr.push(choseong.replaceAll(' ', ''));

            prev.push({
                id: i,
                original,
                disassembled: this.#encode(disassembled),
            });

            return prev;
        }, []);

        this.#searcher = new MiniSearch({
            fields: ['original', 'disassembled'],
            storeFields: ['original'],
            tokenize: (string, _fieldName) => string.split('0x'),
        });

        this.#searcher.addAll(documentArr);
    }

    search(query, option = {}) {
        const idx = this.#originalArr.indexOf(query);
        if (idx !== -1) {
            return [this.#originalArr[idx]];
        } else {
            return this.#searcher.search(
                this.#encode(disassemble(query)),
                option
            );
        }
    }

    autoComplete(query) {
        query = query.replaceAll(' ', '');
        let resultArr = [];
        let resultSet;
        if (query === '') {
            resultArr = this.#originalArr.toSorted();
        } else {
            resultArr = this.#wordComplete(disassemble(query));
            resultSet = new Set(resultArr);
            this.#choseongComplete(getChoseong(query)).forEach((string) => {
                if (!resultSet.has(string)) {
                    resultSet.add(string);
                    resultArr.push(string);
                }
            });
        }
        return resultArr;
    }

    #choseongComplete(query, type) {
        return this.#choseongArr
            .reduce((prev, choseong, index) => {
                if (
                    choseong !== '' &&
                    query !== '' &&
                    choseong.startsWith(query)
                ) {
                    prev.push(this.#originalArr[index]);
                }
                return prev;
            }, [])
            .toSorted();
    }

    #wordComplete(query, type) {
        return this.#disassembledArr
            .reduce((prev, disassembled, index) => {
                if (disassembled.startsWith(query)) {
                    prev.push(this.#originalArr[index]);
                }
                return prev;
            }, [])
            .toSorted();
    }
}
