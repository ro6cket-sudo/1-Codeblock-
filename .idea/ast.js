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
    constructor(string) {
        super();
        this.type = 'String';
        this.string = string;
    }
}