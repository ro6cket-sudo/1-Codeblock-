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

export class OutputNode {
    constructor(expression) {
        this.type = 'Output';
        this.expression = expression;
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