export class astNode{}

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
    constructor(operator, right, left) {
        super();
        this.type = 'BinaryOperation';
        this.operator = operator;
        this.right = right;
        this.left = left;
    }
}