export class CodeBlock {
    id;
    type;
    parentID;
    childrens;
    parameters;
    constructor(id, type, parentID = null) {
        this.id = id;
        this.type = type;
        this.parentID = parentID;
        this.childrens = [];
        this.parameters = {};
    }

    addChild(block) {
        this.childrens.push(block);
        block.parentID = this.id;
    }
}