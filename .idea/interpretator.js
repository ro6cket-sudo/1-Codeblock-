import Parser from './parser'
import NumberNode from '.ast'
import VariableNode from '.ast'
import BinaryOperationNode from '.ast'

export class Interpretator {
    constructor (variables) {
        this.variables = variables;
    }

    evaluate (node) {
        if (node.type === 'Number')
            return node.value;

        if (node.type === 'Variable')
        {
            if (!(naode.name in this.variables))
                throw new Error(`Переменная${node.name} не обноружена`);
            return this.variables[node.name];
        }

        if (node.type === 'BinaryOperation'){
            const left = this.evaluate(node.left);
            const right = this.evaluate(node.right);

            switch (node.operator){
                case '+': return left + right;
                case '-': return left - right;
                case '*': return left * right;
                case '/': return left / right;
                case '%': return left % right;
            }
        }
    }
}