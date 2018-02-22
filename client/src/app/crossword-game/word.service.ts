import { Injectable } from "@angular/core";
import { Word, Direction } from "../../../../common/word";
import { words } from "./mock-words";
// following line causes circular dependencies:
// import { GRID_SIZE } from "./grid/grid.component";
const GRID_SIZE: number = 10;

@Injectable()
export class WordService {
    private _words: Word[];
    private _selectedWord: Word;

    public constructor() {
        this._words = words;
        this._selectedWord = null;
    }

    public get selectedWord(): Word {
        return this._selectedWord;
    }

    public get words(): Word[] {
        return this._words;
    }

    public get definition(): string {
        if (this._selectedWord === null) {
            return null;
        }

        return this._selectedWord.definition;
    }

    public set definition(definition: string) {
        for (const word of this._words) {
            if (word.definition === definition) {
                this._selectedWord = word;

                return;
            }
        }
    }

    public selectWord(row: number, column: number): void {
        for (const word of words) {
            if (word === this._selectedWord) {
                continue;
            }
            if (word.direction === Direction.Horizontal) {
                if (word.row === row && column >= word.column && column < word.column + word.size) {
                    this._selectedWord = word;
                    break;
                }
            } else if (column === word.column && row >= word.row && row < word.row + word.size) {
                this._selectedWord = word;
                break;
            }
        }
    }

    public getDefinitions(direction: Direction): string[][] {
        const definitions: string[][] = [];
        for (let i: number = 0; i < GRID_SIZE; i++) {
            definitions.push([]);
        }

        for (const word of this._words) {
            if (word.direction !== direction) {
                continue;
            }
            if (word.direction === Direction.Horizontal) {
                definitions[word.row].push(word.definition);
            } else {
                definitions[word.column].push(word.definition);
            }
        }

        return definitions;
    }

    public deselect(): void {
        this._selectedWord = null;
    }

    public focusOnCell(row: number, column: number): void {
        const id: number = (row * GRID_SIZE) + column;
        const element: HTMLElement = document.getElementById(id.toString());
        element.focus();
    }

    public focusOnFirstCell(): void {
        const id: number = (this.selectedWord.row * GRID_SIZE) + this.selectedWord.column;
        const element: HTMLElement = document.getElementById(id.toString());
        element.focus();
    }

    public focusOnNextCell(row: number, column: number): void {
        if (this._selectedWord.direction === Direction.Horizontal) {
            if (column === this._selectedWord.column + this.selectedWord.value.length) {
                return;
            }
            column++;
        } else {
            if (row === this._selectedWord.row + this.selectedWord.value.length) {
                return;
            }
            row++;
        }
        const id: number = (row * 10) + column;
        const element: HTMLElement = document.getElementById(id.toString());
        element.focus();
    }

    public focusOnPreviousCell(row: number, column: number): void {
        if (this._selectedWord.direction === Direction.Horizontal) {
            if (column === this._selectedWord.column) {
                return;
            }
            column--;
        } else {
            if (row === this._selectedWord.row) {
                return;
            }
            row--;
        }
        const id: number = (row * 10) + column;
        const element: HTMLElement = document.getElementById(id.toString());
        element.focus();
    }

}
