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
        const ast = parser.parseOR();
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

            case 'string_variable': {
                this.excuteStringVariable(block);
                break;
            }

            case 'boolean_variable': {
                this.executeBooleanVariable(block);
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
                this.executeWhile(block);
                break;
            }

            case 'array': {
                this.executeArray(block);
                break;
            }

            case 'for': {
                this.executeFor(block);
                break;
            }
            
            case 'nothing': {
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
        }
    }

    executeStringVariable(block) {
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

            this.variables[name] = "";
        }
    }

    executeBooleanVariable(block) {
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

            this.variables[name] = false;
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

        const arrayMatch = left.match(/^([a-zA-Z_][a-zA-Z0-9]*)\[(.+)\]$/);

        if (arrayMatch) {
            const arrayName = arrayMatch[1];
            const indexExpression = arrayMatch[2];

            if (!(arrayName in this.variables)) throw new Error(`Массив ${arrayName} не обнаружен`);
            if (!Array.isArray(this.variables[arrayName])) throw new Error(`${arrayName} не является массивом`);
            const index = this.evaluateExpression(indexExpression);
            if (index < 0 || index >= this.variables[arrayName].length) throw new Error(`Индекс ${index} выходит за границы массива ${arrayName}`);
            this.variables[arrayName][index] = value;
        } else {
            if (!(left in this.variables)) throw new Error(`Переменная ${left} не обнаружена`);
            this.variables[left] = value;
        }
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

    executeAssignmentFromString(str) {
        const trimmed = str.trim();
        if (!trimmed) {
            throw new Error('Пустое присваивание в блоке for');
        }

        if (trimmed.endsWith('++') || trimmed.endsWith('--')) {
            const name = trimmed.slice(0, -2).trim();
            if (!name) {
                throw new Error('Некорректная форма шага цикла for');
            }
            if (!(name in this.variables)) {
                throw new Error(`Переменная ${name} не объявлена`);
            }
            this.variables[name] += trimmed.endsWith('++') ? 1 : -1;
            return;
        }

        const parts = trimmed.split('=');
        if (parts.length !== 2) {
            throw new Error('Ожидалось присваивание вида "i = выражение"');
        }

        const left = parts[0].trim();
        const right = parts[1].trim();

        if (!left || !right) {
            throw new Error('Левая и правая части присваивания не должны быть пустыми');
        }

        const value = this.evaluateExpression(right);
        this.variables[left] = value;
    }

    executeStepExpression(str) {
        const trimmed = str.trim();
        if (!trimmed) {
            throw new Error('Пустой шаг в блоке for');
        }

        const match = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)/);
        if (!match) {
            throw new Error('В шаге цикла for должна быть переменная, например "i + 1"');
        }

        const name = match[1];

        if (!(name in this.variables)) {
            throw new Error(`Переменная ${name} не объявлена`);
        }

        const value = this.evaluateExpression(trimmed);
        this.variables[name] = value;
    }

    executeFor(block) {
        const initInput = block.querySelector('.for-init');
        const condInput = block.querySelector('.for-cond');
        const stepInput = block.querySelector('.for-step');

        const init = initInput?.value.trim();
        const cond = condInput?.value.trim();
        const step = stepInput?.value.trim();

        if (!init || !cond || !step) {
            throw new Error('Все поля в блоке for должны быть заполнены');
        }

        const loopVarName = this.getForVariableName(init, step);
        const hadBefore = Object.prototype.hasOwnProperty.call(this.variables, loopVarName);

        this.executeAssignmentFromString(init);

        const nested = block.querySelector('.nested-workspace');

        while (this.evaluateExpression(cond)) {
            if (nested) {
                this.executeAll(nested);
            }
            this.executeStepExpression(step);
        }

        if (!hadBefore) {
            delete this.variables[loopVarName];
        }
    }

    getForVariableName(init, step) {
        const initTrimmed = init.trim();

        if (initTrimmed.includes('=')) {
            return initTrimmed.split('=')[0].trim();
        }

        const incMatch = initTrimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*(\+\+|--)/);
        if (incMatch) {
            return incMatch[1];
        }

        const stepMatch = step.trim().match(/^([a-zA-Z_][a-zA-Z0-9_]*)/);
        if (stepMatch) {
            return stepMatch[1];
        }

        throw new Error('Не удалось определить переменную цикла for');
    }

    executeArray(block) {
        const nameInput = block.querySelector('.array-name-input');
        const sizeInput = block.querySelector('.array-size-input');
        const name = nameInput.value.trim();
        const sizeExpression = sizeInput.value.trim();

        if (!name || !sizeExpression) throw new Error('Поля имени и размера массива не должны быть пустыми');
        if (name in this.variables) throw new Error(`Переменная ${name} уже существует`);

        const size = this.evaluateExpression(sizeExpression);
        this.variables[name] = new Array(size).fill(0);
    }
    
    executeWhile(block) {
        const input = block.querySelector('.code-input');
        const condition = input?.value.trim();

        if (!condition) {
            throw new Error('Блок while не содержит условие');
        }

        const nested = block.querySelector('.nested-workspace');

        let iterations = 0;
        const MAX_ITERATIONS = 100000;

        while (this.evaluateExpression(condition)) {
            if (iterations++ > MAX_ITERATIONS) {
                throw new Error('Слишком много итераций в while (возможно, бесконечный цикл)');
            }

            if (nested) {
                this.executeAll(nested);
            }
        }
    }
}