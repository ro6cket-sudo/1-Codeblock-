export const TokensTypes = {
    NUMBER: 'NUMBER',
    VARIABLE: 'VARIABLE',
    ASIGN: 'ASIGN',
    OPERATION: 'OPERATION',
    ENDOFEXPRESS: 'ENDOFEXPRESS'
}

export const tokenRules = [
    {type: TokensTypes.NUMBER, regex: /^\d+/},
    {type: TokensTypes.VARIABLE, regex: /[A-Za-z0-9]+/},
    {type: TokensTypes.OPERATION, regex: /[+\-*/]/},
]

export class Token {
    constructor(type, value, position) {
        this.type = type;
        this.value = value;
        this.position = position;
    }
}