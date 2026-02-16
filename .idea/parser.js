import Token from './tokens';
import TokenTypes from './tokens';
import NumberNode from '.ast'
import VariableNode from '.ast'
import BinaryOperationNode from '.ast'

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
            this.currentToken = new Token(TokenTypes.ENDOFEXPRESS, null, last);
        }
    }

    parse()
    {
        return this.parseExpression();
    }

    parseExpression() {
        let node = this.parseMultiplication();
        while (this.currentToken.type === TokenTypes.OPERATION && ['+', '-'].includes(this.currentToken.value)) {
            let operation = this.currentToken.value;
            this.NextToken();
            node = new BinaryOperationNode(operation, node, this.parseMultiplication());
        }
        return node;
    }

    parseMultiplication() {
        let node = this.parseLiteral();
        while (this.currentToken.type === TokenTypes.OPERATION && ['*', '/', '%'].includes(this.currentToken.value)) {let operation = this.currentToken.value;
            let oper = this.currentToken.value;
            this.NextToken();
            node = new BinaryOperationNode(oper, node, this.parseLiteral());
        }
        return node;
    }

    parseLiteral() {
        if(this.currentToken.type === TokenTypes.OPENPARENTHIST){
            this.NextToken();
            let node = this.parseExpression();
            if (this.currentToken.type === TokenTypes.CLOSEPARENTHIST) {
                this.NextToken();
                return node;
            }
            else{
                throw new Error("Ожидалась ')'");
            }
        }
        if(this.currentToken.type === TokenTypes.NUMBER){
            let token = this.currentToken;
            this.NextToken();
            return new NumberNode(token.value);
        }
        if(this.currentToken.type === TokenTypes.VARIABLE)
        {
            let token = this.currentToken;
            this.NextToken();
            return new VariableNode(token.value);
        }

        throw new Error(`Неизвестный токен: ${this.currentToken.value}`);
    }
}