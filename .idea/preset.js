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

function makeNothingBlock(container) {
    return makeBlock('nothing', container);
}

function makeNothing(n = 1, container = workspace) {
    for (let i = 0; i < n; i++) {
        makeNothingBlock(container);
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

export function presetMergeSort() {
    clearAllBlocks();

    makeArray('arr', '8');

    makeNothing(1);

    makeAssignment('arr[0]', '5');
    makeAssignment('arr[1]', '2');
    makeAssignment('arr[2]', '7');
    makeAssignment('arr[3]', '1');
    makeAssignment('arr[4]', '3');
    makeAssignment('arr[5]', '8');
    makeAssignment('arr[6]', '4');
    makeAssignment('arr[7]', '6');

    makeNothing(2);
    
    const functionNested1 = makeFunction('Merge', 'left, mid, right')
    makeArray('temp', '8', functionNested1);
    makeVariable('i, j, k', functionNested1);

    makeNothing(1, functionNested1);

    makeAssignment('i', 'left', functionNested1);
    makeAssignment('j', 'mid + 1', functionNested1);
    makeAssignment('k', 'left', functionNested1);

    makeNothing(1, functionNested1);

    const whileBlock1 = makeBlock('while', functionNested1);
    whileBlock1.querySelector('.code-input').value = 'i <= mid and j <= right';
    const whileNested1 = whileBlock1.querySelector('.nested-workspace');

    const ifBlock1 = makeBlock('if', whileNested1);
    ifBlock1.querySelector('.code-input').value = 'arr[i] <= arr[j]';
    const ifNested1 = ifBlock1.querySelector('.nested-workspace');

    makeAssignment('temp[k]', 'arr[i]', ifNested1);
    makeAssignment('i', 'i + 1', ifNested1);

    const elseBlock = makeBlock('else', whileNested1);
    const elseNested = elseBlock.querySelector('.nested-workspace');
    makeAssignment('temp[k]', 'arr[j]', elseNested);
    makeAssignment('j', 'j + 1', elseNested);

    makeAssignment('k', 'k + 1', whileNested1);

    makeNothing(1, functionNested1);

    const whileBlock2 = makeBlock('while', functionNested1);
    whileBlock2.querySelector('.code-input').value = 'i <= mid';
    const whileNested2 = whileBlock2.querySelector('.nested-workspace');
    
    makeAssignment('temp[k]', 'arr[i]', whileNested2);
    makeAssignment('i', 'i + 1', whileNested2);
    makeAssignment('k', 'k + 1', whileNested2);

    makeNothing(1, functionNested1);

    const whileBlock3 = makeBlock('while', functionNested1);
    whileBlock3.querySelector('.code-input').value = 'j <= right';
    const whileNested3 = whileBlock3.querySelector('.nested-workspace');

    makeAssignment('temp[k]', 'arr[j]', whileNested3);
    makeAssignment('j', 'j + 1', whileNested3);
    makeAssignment('k', 'k + 1', whileNested3);

    makeNothing(1, functionNested1);

    makeVariable('idx', functionNested1);
    makeAssignment('idx', 'left', functionNested1);

    makeNothing(1, functionNested1);

    const whileBlock4 = makeBlock('while', functionNested1);
    whileBlock4.querySelector('.code-input').value = 'idx <= right';
    const whileNested4 = whileBlock4.querySelector('.nested-workspace');

    makeAssignment('arr[idx]', 'temp[idx]', whileNested4);
    makeAssignment('idx', 'idx + 1', whileNested4);

    makeNothing(2);

    const functionNested2 = makeFunction('MergeSort', 'left, right');
    makeVariable('mid', functionNested2);
    
    const ifBlock2 = makeBlock('if', functionNested2);
    ifBlock2.querySelector('.code-input').value = 'left < right';
    const ifNested2 = ifBlock2.querySelector('.nested-workspace');

    makeAssignment('mid', '(left + right) // 2', ifNested2);
    makeCall('MergeSort(left, mid)', ifNested2);
    makeCall('MergeSort(mid + 1, right)', ifNested2);
    makeCall('Merge(left, mid, right)', ifNested2);

    makeNothing(2);

    makeCall('MergeSort(0, 7)');

    makeNothing(1);

    const nested2 = makeFor('i = 0', 'i < 8', 'i + 1');

    makeOutput('arr[i]', nested2);

    sortBlocks();
}

document.getElementById('preset-merge-sort').addEventListener('click', presetMergeSort);
document.getElementById('preset-bubble-sort').addEventListener('click', presetBubbleSort);
document.getElementById('preset-gcd').addEventListener('click', presetGCD);