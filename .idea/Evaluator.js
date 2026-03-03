import {NumberNode,VariableNode,BinaryOperationNode, OutputNode} from './ast.js'
import { Parser } from './parser.js';
import {logger} from './ConsoleLogger.js';

export class Evaluator {
    constructor (variables) {
        this.variables = variables;
    }

    getType(value){
        if (typeof(value) === 'number') {
            return 'number';
        }
        if (typeof(value) === 'string') {
            return 'string';
        }
        if (typeof(value) === 'boolean') {
            return 'boolean';
        }
    }

    evaluate (node) {
        if (node.type === 'Number')
            return parseFloat(node.value);

        if (node.type === 'String'){
            return String(node.value);
        }

        if (node.type === 'Char'){
            return String(node.value);
        }

        if (node.type === 'Boolean'){
            return Boolean(node.value);
        }

        if (node.type === 'Variable')
        {
            if (!(node.name in this.variables))
                throw new Error(`Переменная${node.name} не обнaружена`);
            return this.variables[node.name];
        }

        if (node.type === 'BinaryOperation'){

            const left = this.evaluate(node.left);
            const right = this.evaluate(node.right);

            const leftType = this.getType(left);
            const rightType = this.getType(right);

            if (leftType === 'number' && rightType === 'number'){
                return this.evaluateNumber(node.operator, left, right);
            }

            if (leftType === 'string' && rightType === 'string'){
                return this.evaluateString(node.operator, left, right);
            }

            if (leftType === 'boolean' && rightType === 'boolean'){
                return this.evaluateBoolean(node.operator, left, right);
            }

            throw new Error(`Оператор ${operator} не поддерживается для строк`)
        }

        if (node.type === 'ArrayAccess') {
            if (!(node.name in this.variables))
                throw new Error(`Массив ${node.name} не обнаружен`);

            const arr = this.variables[node.name];
            if (!Array.isArray(arr))
                throw new Error(`${node.name} не является массивом`);

            const index = this.evaluate(node.index);
            if (index < 0 || index >= arr.length)
                throw new Error(`Индекс ${index} вне диапазона массива ${node.name}`);
            return arr[index];
        }
    }

    evaluateNumber(operator, left, right) {
        switch (operator) {
            case '>':
                return left > right;
            case '<':
                return left < right;
            case '>=':
                return left >= right;
            case '<=':
                return left <= right;
            case '==':
                return left === right;
            case '!=':
                return left !== right;
            case '+':
                return left + right;
            case '-':
                return left - right;
            case '*':
                return left * right;
            case '/':
                if (right === 0) throw new Error("Деление на 0");
                return left / right;
            case '%':
                if (right === 0) throw new Error("Остаток от деления на 0");
                return left % right;
        }
    }

    evaluateString (operator, left, right) {
        switch (operator) {
            case '>':
                return left > right;
            case '<':
                return left < right;
            case '>=':
                return left >= right;
            case '<=':
                return left <= right;
            case '==':
                return left === right;
            case '!=':
                return left !== right;
            case '+':
                return left + right;
           default: throw new Error(`Оператор ${operator} не поддерживается для строк`)
        }
    }

    // evaluateChar (operator, left, right) {
    // }

    evaluateBoolean (operator, left, right) {
        switch (operator) {
            case 'and': return left && right;
            case 'or': return left || right;
            case '==': return left === right;
            case '!=': return left !== right;
            default: throw new Error(`Оператор ${operator} не поддерживается для булевых значений`)
        }
    }
}