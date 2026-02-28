import {NumberNode,VariableNode,BinaryOperationNode, OutputNode} from './ast.js'
import { Parser } from './parser.js';
import {logger} from './ConsoleLogger.js';

export class Evaluator {
    constructor (variables) {
        this.variables = variables;
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
    }
}