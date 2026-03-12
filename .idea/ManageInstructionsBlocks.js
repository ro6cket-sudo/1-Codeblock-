import {CodeBlock} from './CodeBlock.js';
import {createHTMLInstructionBlock} from './CreateHTMLInstructionBlock.js';

export const blocks = new Map();

export function sortBlocks() {
    const workspace = document.querySelector('.workspace');
    const allBlocks = workspace.querySelectorAll('[data-id]');

    const sortedBlocks = new Map();
    allBlocks.forEach(el => {
        const id = el.dataset.id;
        if (blocks.has(id)) {
            sortedBlocks.set(id, blocks.get(id));
        }
    });

    blocks.clear();
    sortedBlocks.forEach((value, key) => blocks.set(key, value));
}


export function addBlock(type) {
    const id = crypto.randomUUID()
    const workspace = document.querySelector(".workspace");

    const codeBlock = new CodeBlock(id, type);
    blocks.set(id, codeBlock);

    const htmlBlock = createHTMLInstructionBlock(codeBlock);
    htmlBlock.dataset.id = id;

    
    workspace.append(htmlBlock);

    sortBlocks();
}

export function addBlockAtPosition(type, targetPlaceholder) {
    const id = crypto.randomUUID();
    const codeBlock = new CodeBlock(id, type);
    blocks.set(id, codeBlock);

    if (['if', 'while', 'for', 'else', 'function'].includes(type)) {
        const endId = crypto.randomUUID();
        const endBlock = new CodeBlock(endId, 'end');
        endBlock.parentID = id;
        blocks.set(endId, endBlock);
        codeBlock.endId = endId;
    }

    const htmlBlock = createHTMLInstructionBlock(codeBlock);
    htmlBlock.dataset.id = id;

    if (codeBlock.endId) {
        const footer = htmlBlock.querySelector('.block-footer');
        if (footer) {
            footer.dataset.id = codeBlock.endId;
        }
    }

    if (type !== 'else') {
        addEvents(codeBlock, htmlBlock);
    }

    targetPlaceholder.replaceWith(htmlBlock);
    updateNestedContainer(htmlBlock.parentElement);
    sortBlocks();
}

export function updateNestedContainer(container) {
    if (!container || !container.classList || !container.classList.contains('nested-workspace')) {
        return;
    }

    const hasBlocks = Array.from(container.children).some(child =>
        child.classList && child.classList.contains('block'));

    if (hasBlocks) {
        container.classList.add('has-blocks');
    } else {
        container.classList.remove('has-blocks');
    }
}

function addEvents(block, htmlBlock) {
    const input = htmlBlock.querySelector('input');
    if (!input) return;

    const workspace = document.querySelector('.workspace');

    input.addEventListener('input', function(e) {
        block.parameters['value'] = e.target.value;
        console.log(block.parameters['value']);
    })
}

export function clearAllBlocks() {
    const workspace = document.querySelector(".workspace");
    if (workspace) {
        workspace.innerHTML = '';
    }
    blocks.clear();
}

export function removeBlockWithNestedWorkspace(block) {
    const nestedBlocks = block.querySelectorAll('[data-id]');
    nestedBlocks.forEach(el => {
        if (el.dataset.id) {
            blocks.delete(el.dataset.id);
        }
    });

    const id = block.dataset.id;
    blocks.delete(id);
    block.remove();
}

function collectVariableNames() {
    const names = new Set();
    const selectors = [
        '.workspace .block[data-type="variable"]',
        '.workspace .block[data-type="string_variable"]',
        '.workspace .block[data-type="boolean_variable"]'
        ];

    const variableBlocks = document.querySelectorAll(selectors.join(','));
    variableBlocks.forEach(block => {
        const input = block.querySelector('.variable-input');
        if (!input) return;

        const text = input.value.trim();
        if (!text) return;

        text.split(',')
            .map(s => s.trim())
            .filter(Boolean)
            .forEach(name => names.add(name));
    });

    return Array.from(names);
}

function updateVariablesDatalist() {
    const datalist = document.getElementById('variables-list');
    if (!datalist) return;

    datalist.innerHTML = '';

    collectVariableNames().forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        datalist.appendChild(option);
    });
}

document.addEventListener('focusin', (e) => {
    if (e.target.matches('.assignment-var-input, .convector-var-input, ' +
        '.round-var-input, .floor-var-input, .ceil-var-input')) {
        updateVariablesDatalist();
    }
});

window.g = () => console.table(Array.from(blocks.values()), ['id', 'type'])