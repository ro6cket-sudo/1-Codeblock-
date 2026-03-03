export class Node{}

export class NumberNode extends Node {
    constructor(value) {
        super();
        this.type = 'Number';
        this.value = value;
    }
}

export class VariableNode extends Node {
    constructor(name) {
        super();
        this.type = 'Variable';
        this.name = name;
    }
}

export class BinaryOperationNode extends Node {
    constructor(operator, left, right) {
        super();
        this.type = 'BinaryOperation';
        this.operator = operator;
        this.right = right;
        this.left = left;
    }
}

export class OutputNode extends Node {
    constructor(expression) {
        super();
        this.type = 'Output';
        this.expression = expression;
    }
}

export class StringNode extends Node {
    constructor(value) {
        super();
        this.type = 'String';
        this.value = value;
    }
}

export class CharNode extends Node {
    constructor(value) {
        super();
        this.type = 'Char';
        this.value = value;
    }
}

export class BooleanNode extends Node {
    constructor(value) {
        super();
        this.type = 'Boolean';
        this.value = value;
    }
}

export class ArrayAccessNode extends Node {
    constructor(name, indexExpression) {
        super();
        this.type = 'ArrayAccess';
        this.name = name;
        this.index = indexExpression;
    }
}

export class ReturnNode extends Node {
    constructor(expression) {
        super();
        this.type = 'Return';
        this.expression = expression;
    }
}

export class FunctionCallNode extends Node {
    constructor(name, args) {
        super();
        this.type = 'FunctionCall';
        this.name = name;
        this.args = args;
    }
}