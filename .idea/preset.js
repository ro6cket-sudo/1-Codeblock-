import { CodeBlock } from "./CodeBlock.js";
import { createHTMLInstructionBlock } from "./CreateHTMLInstructionBlock.js";
import { blocks, clearAllBlocks, sortBlocks } from "./ManageInstructionsBlocks.js";


const workspace = document.querySelector('.workspace');

function makeBlock(type, container = workspace) {
    const id = crypto.randomUUID();
    const codeBlock = new CodeBlock(id, type);
    blocks.set(id, codeBlock);

    const htmlBlock = createHTMLInstructionBlock(codeBlock);
    htmlBlock.dataset.id = id;

    if (['if', 'while', 'for', 'else', 'function'].includes(type)) {
        const endId = crypto.randomUUID();
        const endBlock = new CodeBlock(endId, 'end');
        endBlock.parentID = id;
        blocks.set(endId, endBlock);
        codeBlock.endId = endId;

        const footer = htmlBlock.querySelector('.block-footer');
        if (footer) {
            footer.dataset.id = codeBlock.endId;
        }
    }

    container.appendChild(htmlBlock);
    return htmlBlock;
}

function makeVariable(names, container = workspace) {
    const el = makeBlock('variable', container);
    el.querySelector('.variable-input').value = names;
    return el;
}

function makeArray(name, size, container = workspace) {
    const el = makeBlock('array', container);
    el.querySelector('.array-name-input').value = name;
    el.querySelector('.array-size-input').value = size;
    return el;
}

function makeAssignment(left, right, container = workspace) {
    const el = makeBlock('assignment', container);
    const inputs = el.querySelectorAll('.variable-input');
    inputs[0].value = left;
    inputs[1].value = right;
    return el;
}

function makeFor(init, condition, step, container = workspace) {
    const el = makeBlock('for', container);
    el.querySelector('.for-init').value = init;
    el.querySelector('.for-cond').value = condition;
    el.querySelector('.for-step').value = step;
    return el.querySelector('.nested-workspace');
}

function makeOutput(expression, container = workspace) {
    const el = makeBlock('output', container);
    el.querySelector('.output-input').value = expression;
    return el;
}

function makeNothingBlock(container = workspace) {
    return makeBlock('nothing', container);
}

function makeNothing(n = 1) {
    for (let i = 0; i < n; i++) {
        makeNothingBlock();
    }
}

function makeFunction(name, params, container = workspace) {
    const el = makeBlock('function', container);
    el.querySelector('.function-name-input').value = name;
    el.querySelector('.function-params-input').value = params;
    return el.querySelector('.nested-workspace');
}

function makeReturn(expression, container = workspace) {
    const el = makeBlock('return', container);
    el.querySelector('.return-input').value = expression;
    return el;
}

function makeCall(expression, container = workspace) {
    const el = makeBlock('call', container);
    el.querySelector('.call-input').value = expression;
    return el;
}

export function presetBubbleSort() {
    clearAllBlocks();

    makeArray('arr', '5');
    
    makeAssignment('arr[0]', '5');
    makeAssignment('arr[1]', '3');
    makeAssignment('arr[2]', '8');
    makeAssignment('arr[3]', '1');
    makeAssignment('arr[4]', '4');

    makeNothing(1);

    makeVariable('temp');

    makeNothing(2);

    const outerNested = makeFor('i = 0', 'i < 5', 'i + 1');
    const innerNested = makeFor('j = 0', 'j < 4', 'j + 1', outerNested);

    const ifBlock = makeBlock('if', innerNested);
    ifBlock.querySelector('.code-input').value = 'arr[j] > arr[j + 1]';
    const ifNested = ifBlock.querySelector('.nested-workspace');

    makeAssignment('temp', 'arr[j]', ifNested);
    makeAssignment('arr[j]', 'arr[j + 1]', ifNested);
    makeAssignment('arr[j + 1]', 'temp', ifNested);

    makeNothing(1);
    const nested = makeFor('i = 0', 'i < 5', 'i + 1');
    makeOutput('arr[i]', nested);

    sortBlocks();
}

export function presetGCD() {
    clearAllBlocks();

    const functionNested = makeFunction('gcd', 'a, b');

    const ifBlock = makeBlock('if', functionNested);
    ifBlock.querySelector('.code-input').value = 'b == 0';

    const ifNested = ifBlock.querySelector('.nested-workspace');
    makeReturn('a', ifNested);

    makeReturn('gcd(b, a % b)', functionNested);

    makeNothing(4);

    makeVariable('x, y');
    makeAssignment('x', '300');
    makeAssignment('y', '108');

    makeNothing(1);
    
    makeOutput('gcd(x, y)');

    sortBlocks();
}


document.getElementById('preset-bubble-sort').addEventListener('click', presetBubbleSort);
document.getElementById('preset-gcd').addEventListener('click', presetGCD);