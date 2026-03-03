import {NumberNode,VariableNode,BinaryOperationNode, OutputNode} from './ast.js'
import { Parser } from './parser.js';
import {logger} from './ConsoleLogger.js';

export class Evaluator {
    constructor (variables, functions = {}) {
        this.variables = variables;
        this.functions = functions;
    }

    evaluate (node) {
        if (node.type === 'Number')
            return parseFloat(node.value);

        if (node.type === 'Variable')
        {
            if (!(node.name in this.variables))
                throw new Error(`Переменная${node.name} не обнaружена`);
            return this.variables[node.name];
        }

        if (node.type === 'BinaryOperation'){
            const left = this.evaluate(node.left);
            const right = this.evaluate(node.right);

            switch (node.operator){
                case '>': return left > right;
                case '<':  return left < right;
                case '>=': return left >= right;
                case '<=': return left <= right;
                case '==': return left === right;
                case '!=': return left !== right;
                case '+': return left + right;
                case '-': return left - right;
                case '*': return left * right;
                case '/':
                    if (right === 0) throw new Error("Деление на 0");
                    return left / right;
                case '%':
                    if (right === 0) throw new Error("Остаток от деления на 0");
                    return left % right;
            }
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

        if (node.type === 'FunctionCall') {
            if (!(node.name in this.functions)) {
                throw new Error(`Функция ${node.name} не обнаружена`);
            }

            const argValues = node.args.map(arg => this.evaluate(arg));
            return this.functions[node.name](argValues);
        }
    }
}