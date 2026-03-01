import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { logger } from './ConsoleLogger.js';
import { Evaluator } from './Evaluator.js';

export class Interpretator {
    variables = {};
    currentBlock = null;
    constructor(variables) {
        this.variables = variables;
    }

    evaluateExpression(expression) {
        const lexer = new Lexer(expression);
        const tokens = lexer.Analys();
        const parser = new Parser(tokens);
        const ast = parser.parseExpression(expression);
        const evaluator = new Evaluator(this.variables);
        return evaluator.evaluate(ast);
    }

    executeAll(container){
        const blocks = Array.from(container.children).filter(block => block.classList.contains('block'));

        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];

            if (block.dataset.type === 'else'){
                continue;
            }

            this.excuteBlock(block)
        }
    }

    excuteBlock(block) {
        const blockType = block.dataset.type;
        switch (blockType) {
            case 'variable': {
                this.excuteVariable(block);
                break;
            }

            case 'assignment': {
                this.executeAssignment(block);
                break;
            }

            case 'output': {
                this.executeOutput(block);
                break;
            }

            case 'if': {
                this.excuteIf(block);
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
        const input = block.querySelector('.variable-input');
        const string = input.value.trim();
        if (!string){
            throw new Error('Nothing to excute variable found');
        }

        const names = string.split(',').map(s => s.trim()).filter(s => s.length > 0);

        for (const name of names){
            if (name in this.variables) {
                throw new Error(`Переменная ${name} уже существует`);
            }

            this.variables[name] = 0;
            // по тз "считаем, что все вновь объявленные переменные по умолчанию равны 0."
        }
    }

    executeAssignment(block) {
        const input = block.querySelectorAll('.variable-input');
        const left = input[0].value.trim();
        const right = input[1].value.trim();

        if (!left || !right){
            throw new Error('Окна в присваивание не должны быть пусты');
        }

        const value = this.evaluateExpression(right);
        this.variables[left] = value;
    }

    executeOutput(block) {
        const input = block.querySelector('.output-input');
        const string = input.value.trim();
        const value = this.evaluateExpression(string);
        logger.log(value);
    }

    excuteIf(block) {
        const input = block.querySelector('.code-input');
        const string = input.value.trim();
        if (!string){
            throw new Error('Блок if не содержит условие');
        }
        const value = this.evaluateExpression(string);

        const nasted = block.querySelector('.nested-workspace');

        if (value){
            if (nasted){
                this.executeAll(nasted);
            }
        }
        else {
            const next = block.nextElementSibling;
            if (next && next.dataset.type === "else") {
                const elseNested = next.querySelector('.nested-workspace');
                if (elseNested){
                    this.executeAll(elseNested);
                }
            }
        }
    }
}