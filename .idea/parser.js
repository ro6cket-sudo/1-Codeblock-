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
            this.currentToken = new Token(TokenTypes.ENDOFEXPRESS, null, this.tokens[this.position.length - 1].position || 0);
        }
    }

    parse()
    {
        return praseExpression()
    }

    parseExpression() {
        let node = this.parseMultiplication();
        while (this.currentToken.type === TokenTypes.OPERATION && ['+', '-'].includes(this.currentToken.value)) {
            let operation = this.currentToken.value;
            this.NextToken();
            node = new BinaryOperationNode(operation, node, );
        }
        return node;
    }

    parseMultiplication() {
        let node = this.parseLiteral();
        while (this.currentToken.type === TokenTypes.OPERATION && ['*', '/', '%'].includes(this.currentToken.value)) {let operation = this.currentToken.value;
            let oper = this.currentToken.value;
            this.NextToken();
            node = new BinaryOperationNode(oper, node, this.parseMultiplication());
        }
        return node;
    }

    parseLiteral() {
        if(this.currentToken.type === TokenTypes.OPENPARENTHIST){
            this.nextToken();
            let node = this.parseExpression();
            this.nextToken;
            return node;
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
    }
}