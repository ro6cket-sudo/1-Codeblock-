import {TokenTypes, tokenRules, Token} from '.tokens';

export class Lexer {

    constructor(input_code) {
        this.input_code = input_code;
        this.tokensList = [];
        this.position = 0;
    }

    AddTocens(){
        if (this.position >= this.input_code.length) {
            return false;
        }

        const analysysCode = this.input_code.slice(this.position);

        for (let i = 0; i < tokenRules.length; i++) {
            const matchSubStrings = analysysCode.match(tokenRules[i].regex);
            if (matchSubStrings) {
                const token = new Token(tokenRules[i].type, matchSubStrings[0], this.position);
                this.position += matchSubStrings[0].length;
                this.tokensList.push(token);
                return true;
            }
        }
    }

    Analys() {
        while (this.AddTocens()) {}
        this.tokensList.push(new Token());
        return this.tokensList;
    }
}