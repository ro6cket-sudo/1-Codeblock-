export const TokensTypes = {
    NUMBER: 'NUMBER',
    OUTPUT: 'OUTPUT',
    VARIABLE: 'VARIABLE',
    OPERATION: 'OPERATION',//+ - * / %
    COMPARE: 'COMPARE',// == != > < >= <=
    OR: 'OR',
    AND: 'AND',
    NOT: 'NOT',
    OPENPARENTHIST: 'OPENPARENTHIST',// (
    CLOSEPARENTHIST: 'CLOSEPARENTHIST',// )
    COMMA: 'COMMA',// ,
    ENDOFEXPRESS: 'ENDOFEXPRESS',
    OPENBRACKET: 'OPENBRACKET',
    CLOSEBRACKET: 'CLOSEBRACKET'
}

export const tokenRules = [
    {type: TokensTypes.NUMBER, regex: /^\d+/},
    {type: TokensTypes.OUTPUT, regex: /^output\b/},
    {type: TokensTypes.VARIABLE, regex: /^[A-Za-z][A-Za-z0-9]*/},
    {type: TokensTypes.OPERATION, regex: /^[+\-*/%]/},
    {type: TokensTypes.COMPARE, regex: /(^>=|<=|==|!=|>|<)/},
    {type: TokensTypes.OR, regex: /^or/},
    {type: TokensTypes.AND, regex: /^and/},
    {type: TokensTypes.NOT, regex: /^!/},
    {type: TokensTypes.OPENPARENTHIST, regex: /^\(/},
    {type: TokensTypes.CLOSEPARENTHIST, regex: /^\)/},
    {type: TokensTypes.COMMA, regex: /^,/},
    {type: TokensTypes.OPENBRACKET, regex: /^\[/},
    {type: TokensTypes.CLOSEBRACKET, regex: /^\]/}
]

export class Token {
    constructor(type, value, position) {
        this.type = type;
        this.value = value;
        this.position = position;
    }
}