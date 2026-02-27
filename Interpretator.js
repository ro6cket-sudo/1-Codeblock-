import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { logger } from './ConsoleLogger.js';
import { Evaluator } from './Evaluator.js';

export class Interpretator {
    variables = {};
    constructor(variables) {
        this.variables = variables;
    }

    excuteBlock(block) {
        const blockType = block.dataset.type;
        switch (blockType) {
            case 'variable': {
                this.excuteVariable(block);
                break;
            }

            case 'assigment': {
                this.excuteVariable(block);
                break;
            }

            case 'output': {
                this.excuteVariable(block);
                break;
            }

            case 'if': {
                this.excuteVariable(block);
                break;
            }

            case 'while': {
                this.excuteVariable(block);
                break;
            }

            case 'array': {
                this.excuteVariable(block);
                break;
            }

            default: {
                throw new Error(`Неизвестный тип блока ${blockType}`);
            }
        }
    }

    excuteVariable(block) {
        const input = block.querySlector('.variable-input');
        const string = input.value.trim();
        if (!string){
            throw new Error('Nothing to excute variable found');
        }

        const names = string.split(',').map(s => s.trim()).filter(s => s.length > 0);

        for (const name of names){
            if (this.variables[name]) {
                throw new Error(`Переменная ${name} уже существует`);
            }

            this.variables[name] = null;
        }
    }
}