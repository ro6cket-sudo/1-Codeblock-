import {Token,TokensTypes} from './tokens.js';
import { NumberNode, VariableNode, BinaryOperationNode, OutputNode, ArrayAccessNode, ReturnNode, FunctionCallNode, StringNode, BooleanNode, CharNode, UnaryOperationNode } from './ast.js'

export class Parser {
    tokens = [];
    position;
    currentToken;

    constructor(tokens) {
        this.tokens = tokens;
        this.position = 0;
        this.currentToken = tokens[0];
    }

    NextToken() {
        this.position++;
        if (this.position < this.tokens.length) {
            this.currentToken = this.tokens[this.position];
        } else {
            const last = this.tokens.length > 0 ? this.tokens[this.tokens.length - 1].position : 0;
            this.currentToken = new Token(TokensTypes.ENDOFEXPRESS, null, last);
        }
    }

    parse()
    {
        return this.parseStatement();
    }

    parseStatement() {
        if (this.currentToken.type === TokensTypes.RETURN) {
            return this.parseReturn();
        }

        const token = this.currentToken;

        switch (token.type) {
            case TokensTypes.OUTPUT:
                return this.parseOutput();
        // case TokensTypes.VARIABLE:
        //     return this.parseAssignment();

        default:
            return this.parseOR();
        }
    }

    parseReturn() {
        this.NextToken();
        const expression = this.parseOR();
        return new ReturnNode(expression);
    }

    parseOR() {
        let node = this.parseAND();
        while (this.currentToken.type === TokensTypes.OR) {
            const operation = this.currentToken.value;
            this.NextToken();
            node = new BinaryOperationNode(operation, node, this.parseAND());
        }
        return node;
    }

    parseAND() {
        let node = this.parseCompare();
        while (this.currentToken.type === TokensTypes.AND) {
            const operation = this.currentToken.value;
            this.NextToken();
            node = new BinaryOperationNode(operation, node, this.parseCompare());
        }
        return node;
    }

    parseCompare(){
        let node = this.parseExpression();
        while (this.currentToken.type === TokensTypes.COMPARE) {
            const operation = this.currentToken.value;
            this.NextToken();
            node = new BinaryOperationNode(operation, node, this.parseExpression());
        }
        return node;
    }

    parseExpression() {
        let node = this.parseMultiplication();
        while (this.currentToken.type === TokensTypes.OPERATION && ['+', '-'].includes(this.currentToken.value)) {
            let operation = this.currentToken.value;
            this.NextToken();
            node = new BinaryOperationNode(operation, node, this.parseMultiplication());
        }
        return node;
    }

    parseMultiplication() {
        let node = this.parseUnaryOperation();
        while (this.currentToken.type === TokensTypes.OPERATION && ['*', '/', '%'].includes(this.currentToken.value)) {let operation = this.currentToken.value;
            let oper = this.currentToken.value;
            this.NextToken();
            node = new BinaryOperationNode(oper, node, this.parseUnaryOperation());
        }
        return node;
    }

    parseUnaryOperation(){
        if (this.currentToken.type === TokensTypes.OPERATION && this.currentToken.value === '-'){
            this.NextToken();
            return new UnaryOperationNode('-', this.parseUnaryOperation());
        }

        if (this.currentToken.type === TokensTypes.NOT){
            this.NextToken();
            return new UnaryOperationNode('!', this.parseUnaryOperation());
        }

        return this.parseLiteral();
    }

    parseLiteral() {
        if(this.currentToken.type === TokensTypes.OPENPARENTHIST){
            this.NextToken();
            let node = this.parseExpression();
            if (this.currentToken.type === TokensTypes.CLOSEPARENTHIST) {
                this.NextToken();
                return node;
            }
            else{
                throw new Error("Ожидалась ')'");
            }
        }

        if (this.currentToken.type === TokensTypes.STRING) {
            let token = this.currentToken;
            this.NextToken();
            return new StringNode(token.value.slice(1, -1));
        }

        if (this.currentToken.type === TokensTypes.CHAR) {
            let token = this.currentToken;
            this.NextToken();
            return new CharNode(token.value.slice(1, -1));
        }

        if (this.currentToken.type === TokensTypes.BOOLEAN) {
            let token = this.currentToken;
            this.NextToken();
            return new BooleanNode(token.value === 'true');
        }

        if(this.currentToken.type === TokensTypes.NUMBER){
            let token = this.currentToken;
            this.NextToken();
            return new NumberNode(token.value);
        }
        if(this.currentToken.type === TokensTypes.VARIABLE)
        {
            let token = this.currentToken;
            this.NextToken();

            if (this.currentToken.type === TokensTypes.OPENPARENTHIST) {
                this.NextToken();
                const args = [];

                while (this.currentToken.type !== TokensTypes.CLOSEPARENTHIST && this.currentToken.type !== TokensTypes.ENDOFEXPRESS) {
                    args.push(this.parseOR());
                    if (this.currentToken.type == TokensTypes.COMMA)  {
                        this.NextToken();
                    }
                }

                if (this.currentToken.type !== TokensTypes.CLOSEPARENTHIST) {
                    throw new Error("Ожидалась ')'");
                }
                this.NextToken();
                return new FunctionCallNode(token.value, args);
            }

            if (this.currentToken.type === TokensTypes.OPENBRACKET) {
                this.NextToken();
                const indexExpression = this.parseExpression();
                if (this.currentToken.type !== TokensTypes.CLOSEBRACKET) {
                    throw new Error("Ожидалась ']'");
                }
                this.NextToken();
                return new ArrayAccessNode(token.value, indexExpression);
            }

            return new VariableNode(token.value);
        }

        throw new Error(`Неизвестный токен: ${this.currentToken.value}`);
    }

    parseOutput() {
        this.NextToken();
    
        const expression = this.parseExpression();
    
        return new OutputNode(expression);
    }
}