export const TokensTypes = {
    NUMBER: 'NUMBER',
    VARIABLE: 'VARIABLE',
    ASIGN: 'ASIGN',//=
    OPERATION: 'OPERATION',//+ - * / %
    COMPARE: 'COMPARE',// == != > < >= <=
    OPENPARENTHIST: 'OPENPARENTHIST',// (
    CLOSEPARENTHIST: 'CLOSEPARENTHIST',// )
    COMMA: 'COMMA',// ,
    ENDOFEXPRESS: 'ENDOFEXPRESS'
}

export const tokenRules = [
    {type: TokensTypes.NUMBER, regex: /^\d+/},
    {type: TokensTypes.VARIABLE, regex: /[A-Za-z0-9]+/},
    {type: TokensTypes.ASIGN, regex: /=/},
    {type: TokensTypes.OPERATION, regex: /[+\-*/%]/},
    {type: TokensTypes.COMPARE, regex: /(>=|<=|==|!=|>|<)/},
    {type: TokensTypes.OPENPARENTHIST, regex: /\(/},
    {type: TokensTypes.CLOSEPARENTHIST, regex: /\)/},
    {type: TokensTypes.COMMA, regex: /,/}
]

export class Token {
    constructor(type, value, position) {
        this.type = type;
        this.value = value;
        this.position = position;
    }
}