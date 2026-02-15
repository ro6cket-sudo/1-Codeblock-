import Token from './tokens';
import TokenTypes from './tokens';
import NumberNode from '.ast'
import VariableNode from '.ast'
import BinaryOperationNode from '.ast'

class Parser {
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

    ChekToken(type,value = null) {
        return this.currentToken.type === type && (value === null || this.currentToken.value === value);
    }

    Pars(type, value = null) {
        if (this.ChekToken(type, value)) {
            const token = this.currentToken;
            this.NextToken();
            return token;
        }
        this.error(`Ожидался токен ${type}${value}`);
    }

    error(massage){
        throw new Error(massage);
    }
}