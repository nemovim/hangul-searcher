import Hangul from 'hangul-js';
import MiniSearch from 'minisearch';
import Chosung from 'chosung';

export default class HangulSearcher {
    #miniSearch;

    #titleArr = [];
    #chosungArr = [];
    #documentArr = [];

    /** documentArr = [document1, document2, ...]
     * document = { id: 1, title: 'abc', text: 'def' }
     */
    constructor(documentArr) {
        this.#documentArr = documentArr.reduce((prev, document) => {
            let disassembledTitle = Hangul.disassembleToString(document.title);
            let chosungTitle = Chosung.getChosung(document.title);
            this.#chosungArr.push(chosungTitle);
            this.#titleArr.push(disassembledTitle);
            prev.push({
                id: document.id,
                title: disassembledTitle,
                text: disassembledTitle,
                // text: Hangul.disassembleToString(document?.text),
            });
            return prev;
        }, []);
        this.#miniSearch = new MiniSearch({
            // fields: ['title', 'text'],
            fields: ['title'],
            storeFields: ['title'],
        });
        this.#miniSearch.addAll(this.#documentArr);
    }

    search(word, fuzzy = 1) {
        let result = this.#miniSearch.search(Hangul.disassembleToString(word), { fuzzy: fuzzy });
        return result.map((doc) => {
            doc.title = Hangul.assemble(doc.title);
            doc.terms = Hangul.assemble(doc.terms);
            return doc;
        });
    }

    autoComplete(_word) {
        let word = Hangul.disassembleToString(_word);
        if (Hangul.isChoAll(word)) {
            return this.chosungComplete(word);
        } else {
            return this.wordComplete(word);
        }
    }

    chosungComplete(chosung) {
        let reg = new RegExp(chosung);
        let resultArr = this.#chosungArr.reduce((prev, chosungTitle, index) => {
            if (chosungTitle.search(reg) !== -1) {
                prev.push(Hangul.assemble(this.#titleArr[index]));
            }
            return prev;
        }, []);
        resultArr.sort();
        return resultArr;
    }

    wordComplete(word) {
        let reg = new RegExp(word);
        let resultArr = this.#titleArr.reduce((prev, title) => {
            if (title.search(reg) !== -1) {
                prev.push(Hangul.assemble(title));
            }
            return prev;
        }, []);
        resultArr.sort();
        return resultArr;
    }
}
