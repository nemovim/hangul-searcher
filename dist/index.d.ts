import type { SearchOptions, SearchResult } from "minisearch";
export type AutoOption = {
    startsWithQuery: boolean;
    alwaysUsesChoseong: boolean;
};
export type AutoOptionInput = Partial<AutoOption>;
export type { SearchResult };
export default class HangulSearcher {
    #private;
    searchOption: SearchOptions;
    autoOption: {
        startsWithQuery: boolean;
        alwaysUsesChoseong: boolean;
    };
    constructor(stringArr: string[], searchOption?: SearchOptions, autoOption?: AutoOptionInput);
    search(query: string, option?: SearchOptions): Array<string | SearchResult>;
    autoComplete(query: string, option?: AutoOptionInput): string[];
}
