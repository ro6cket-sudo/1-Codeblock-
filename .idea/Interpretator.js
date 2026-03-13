import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { logger } from './ConsoleLogger.js';
import { Evaluator } from './Evaluator.js';


class ReturnException {
    constructor(value) {
        this.value = value;
    }
}

export class Interpretator {
    variables = {};
    functions = {};

    currentBlock = null;
    callDepth = 0;
    kRecursionLimit = 500;

    stepPermit = null;
    isStopped = false;
    step = null;

    constructor(variables) {
        this.variables = variables;
    }

    async waitStep(){
        return new Promise(resolve => this.stepPermit = resolve);
    }

    evaluateExpression(expression) {
        const lexer = new Lexer(expression);
        const tokens = lexer.Analys();
        const parser = new Parser(tokens);
        const ast = parser.parseOR();
        const evaluator = new Evaluator(this.variables, this.functions);
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

    async executeDebug(container){
        const blocks = Array.from(container.children).filter(block => block.classList.contains('block'));

        for (let i = 0; i < blocks.length; i++) {
            if (this.isStopped){
                break;
            }

            const block = blocks[i];

            if (block.dataset.type === 'else'){
                continue;
            }

            block.classList.add('debug');

            await this.waitStep();

            await this.executeBlockDebug(block);

            if (this.step){
                this.step(this.variables);
            }

            block.classList.remove('debug');
        }
    }

    async executeBlockDebug(block){
        const blockType = block.dataset.type;
        try {
            switch (blockType) {
                case 'if': {
                    await this.executeIfDebug(block);
                    break;
                }
                case 'while': {
                    await this.executeWhileDebug(block);
                    break;
                }
                case 'for': {
                    await this.executeForDebug(block);
                    break;
                }
                case 'call': {
                    await this.executeIfDebug(block);
                    break;
                }
                case 'return': {
                    const input = block.querySelector('.return-input');
                    const value = this.evaluateExpression(input.value.trim());
                    throw new ReturnException(value);
                }
                default: {
                    this.excuteBlock(block);
                }
            }
        }
        catch (error) {
            block.classList.add('error');
            throw error;
        }
    }

    excuteBlock(block) {
        const blockType = block.dataset.type;

        try {
            switch (blockType) {
                case 'variable': {
                    this.excuteVariable(block);
                    break;
                }

                case 'string_variable': {
                    this.executeStringVariable(block);
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

                case 'function': {
                    this.executeFunction(block);
                    break;
                }

                case 'return': {
                    const input = block.querySelector('.return-input');
                    const value = this.evaluateExpression(input.value.trim());
                    throw new ReturnException(value);
                }

                case 'call': {
                    this.executeCall(block);
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

                case 'tu_number':{
                    this.executeTuNumber(block);
                    break;
                }

                case 'tu_string':{
                    this.executeTuString(block);
                    break;
                }

                case 'tu_boolean':{
                    this.executeTuBul(block);
                    break;
                }

                case 'round':{
                    this.executeRound(block);
                    break;
                }

                case 'floor':{
                    this.executeFloor(block);
                    break;
                }

                case 'ceil':{
                    this.executeCeil(block);
                    break;
                }

                default: {
                    throw new Error(`Неизвестный тип блока ${blockType}`);
                }
            }
        } catch (error) {
            if (!(error instanceof ReturnException)) {
                block.classList.add('error');
            }
            throw error;
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
            if (name in this.variables && this.callDepth === 0) {
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
            if (name in this.variables && this.callDepth === 0) {
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
            if (name in this.variables && this.callDepth === 0) {
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

    async executeIfDebug(block){
        const input = block.querySelector('.code-input');
        const string = input.value.trim();
        if (!string){
            throw new Error('Блок if не содержит условие');
        }
        const value = this.evaluateExpression(string);

        const nasted = block.querySelector('.nested-workspace');

        if (value){
            if (nasted){
                await this.executeDebug(nasted);
            }
        }
        else {
            const next = block.nextElementSibling;
            if (next && next.dataset.type === "else") {
                const elseNested = next.querySelector('.nested-workspace');
                if (elseNested){
                    await this.executeDebug(elseNested);
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

    async executeForDebug(block) {
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
                await this.executeDebug(nested);
            }
            this.executeStepExpression(step);

            if (this.isStopped){
                break;
            }

            block.classList.add('debug');
            await this.waitStep();
            block.classList.remove('debug');
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
        if (name in this.variables && this.callDepth === 0) throw new Error(`Массив ${name} уже существует`);

        const size = this.evaluateExpression(sizeExpression);
        this.variables[name] = new Array(size).fill(0);
    }

    executeFunction(block) {
        const nameInput = block.querySelector('.function-name-input');
        const paramsInput = block.querySelector('.function-params-input');

        const name = nameInput.value.trim();
        const paramsString = paramsInput.value.trim();
        const params = paramsString ? paramsString.split(',').map(s => s.trim()) : [];

        if (!name) throw new Error('Имя функции не должно быть пустым');
        if (name in this.functions) throw new Error(`Функция ${name} уже существует`);

        const nested = block.querySelector('.nested-workspace');
        this.functions[name] = (args) => {
            return this.callFunction(params, args, nested);
        };
    }

    callFunction(params, argValues, nested) {
        if (this.callDepth > this.kRecursionLimit) {
            throw new Error(`Превышено ограничение глубины рекурсии (max: ${this.kRecursionLimit})`)
        }

        this.callDepth++;

        const savedVariables = {};

        for (const key of Object.keys(this.variables)) {
            savedVariables[key] = Array.isArray(this.variables[key]) 
                ? [...this.variables[key]] : this.variables[key];
        }

        for (let i = 0; i < params.length; i++)  {
            const val = argValues[i] ?? 0;
            this.variables[params[i]] = Array.isArray(val) ? [...val] : val;
        }

        let returnValue = 0;

        try {
            this.executeAll(nested);
        } catch (e) {
            if (e instanceof ReturnException) {
                returnValue = e.value;
            } else {
                this.variables = savedVariables;
                this.callDepth--;
                throw e;
            }
        }

        const arrayUpdates = {};
        for (const key of Object.keys(this.variables)) {
            if (Array.isArray(savedVariables[key]) && Array.isArray(this.variables[key])) {
                arrayUpdates[key] = [...this.variables[key]];
            }
        }

        this.variables = savedVariables;

        for (const key of Object.keys(arrayUpdates)) {
            this.variables[key] = arrayUpdates[key];
        }

        this.callDepth--;
        return returnValue;
    }

    executeCall(block) {
        const input = block.querySelector('.call-input');
        const callString = input.value.trim();

        if (!callString) {
            throw new Error('Пустая строка вызова функции');
        }

        const match = callString.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*\((.*)\)$/);
        if (!match) {
            throw new Error('Некорректный ввод функции');
        }

        const funcName = match[1];
        const argsString = match[2];
        const args = argsString ? splitArgs(argsString).map(s => this.evaluateExpression(s.trim())) : [];

        if (!(funcName in this.functions)) {
            throw new Error(`Функция ${funcName} не найдена`);
        }

        this.functions[funcName](args);
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

    async executeWhileDebug(block) {
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
                await this.executeDebug(nested);
            }

            if (this.isStopped){
                break;
            }

            block.classList.add('debug');
            await this.waitStep();
            block.classList.remove('debug');
        }
    }

    executeTuNumber(block) {
        const input = block.querySelector('.convector-var-input');
        const vari = input.value.trim();
        if (!vari) {
            throw new Error('Имя переменной не может быть пустым')
        }
        if (!(vari in this.variables)) {
            throw new Error(`Переменная ${vari} не найдена`)
        }

        const value = this.variables[vari];
        const convert  = Number(value);
        if (isNaN(convert)) {
            throw new Error('Невозможно преобразовать в число!');
        }
        this.variables[vari] = convert;
    }

    executeTuString(block) {
        const input = block.querySelector('.convector-var-input');
        const vari = input.value.trim();
        if (!vari) {
            throw new Error('Имя переменной не может быть пустым')
        }
        if (!(vari in this.variables)) {
            throw new Error(`Переменная ${vari} не найдена`)
        }

        const value = this.variables[vari];
        const convert  = String(value);
        this.variables[vari] = convert;
    }

    executeTuBul(block) {
        const input = block.querySelector('.convector-var-input');
        const vari = input.value.trim();
        if (!vari) {
            throw new Error('Имя переменной не может быть пустым')
        }
        if (!(vari in this.variables)) {
            throw new Error(`Переменная ${vari} не найдена`)
        }

        const value = this.variables[vari];
        const convert  = Boolean(value);
        this.variables[vari] = convert;
    }

    executeRound(block) {
        const input = block.querySelector('.round-var-input');
        const vari = input.value.trim();
        if (!vari) {
            throw new Error('Имя переменной не может быть пустым')
        }
        if (!(vari in this.variables)) {
            throw new Error(`Переменная ${vari} не найдена`)
        }

        const value = this.variables[vari];
        if (Number.isFinite(value)) {
            this.variables[vari] = Math.round(value);
        }
        else{
            throw new Error(`Переменная ${vari} не является числом!`)
        }
    }

    executeFloor(block) {
        const input = block.querySelector('.floor-var-input');
        const vari = input.value.trim();
        if (!vari) {
            throw new Error('Имя переменной не может быть пустым')
        }
        if (!(vari in this.variables)) {
            throw new Error(`Переменная ${vari} не найдена`)
        }

        const value = this.variables[vari];
        if (Number.isFinite(value)) {
            this.variables[vari] = Math.floor(value);
        }
        else{
            throw new Error(`Переменная ${vari} не является числом!`)
        }
    }

    executeCeil(block) {
        const input = block.querySelector('.ceil-var-input');
        const vari = input.value.trim();
        if (!vari) {
            throw new Error('Имя переменной не может быть пустым')
        }
        if (!(vari in this.variables)) {
            throw new Error(`Переменная ${vari} не найдена`)
        }

        const value = this.variables[vari];
        if (Number.isFinite(value)) {
            this.variables[vari] = Math.ceil(value);
        }
        else{
            throw new Error(`Переменная ${vari} не является числом!`)
        }
    }
}

function splitArgs(str) {
    const args = [];
    let depth = 0;
    let start = 0;

    for (let i = 0; i < str.length; i++) {
        if (str[i] === '(') depth++;
        else if (str[i] === ')') depth--;
        else if (str[i] === ',' && depth === 0) {
            args.push(str.slice(start, i).trim());
            start = i + 1;
        }
    }

    const last = str.slice(start).trim();
    if (last) args.push(last);

    return args;
}