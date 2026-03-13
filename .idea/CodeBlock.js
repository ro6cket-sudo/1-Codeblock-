export class CodeBlock {
    id;
    type;
    parentID;
    endId;
    childrens;
    parameters;
    constructor(id, type, parentID = null) {
        this.id = id;
        this.type = type;
        this.parentID = parentID;
        // this.endId = null;
        this.childrens = [];
        this.parameters = {};
    }

    getDefualtParameters(type) {
        const parameters = {
            'variable' : {color: "blue", text:"Переменная"},
            'assignment' : {color: "pink", text:"Присвоение"},
            'output' : {color: "orange", text:"Вывод"}
        }
    }

    addChild(block) {
        this.childrens.push(block);
        block.parentID = this.id;
    }
}