import {CodeBlock} from './CodeBlock.js';
import {createHTMLInstructionBlock} from './CreateHTMLInstructionBlock.js';

export const blocks = new Map();

export function addBlock(type) {
    const id = crypto.randomUUID()
    const workspace = document.querySelector(".workspace");

    const codeBlock = new CodeBlock(id, type);
    blocks.set(id, codeBlock);

    const htmlBlock = createHTMLInstructionBlock(codeBlock);
    addEvents(codeBlock, htmlBlock);
    workspace.append(htmlBlock);
}

export function addBlockAtPosition(type, targetPlaceholder) {
    const id = crypto.randomUUID();
    const codeBlock = new CodeBlock(id, type);
    blocks.set(id, codeBlock);

    const htmlBlock = createHTMLInstructionBlock(codeBlock);
    addEvents(codeBlock, htmlBlock);

    targetPlaceholder.replaceWith(htmlBlock);

    updateNestedContainer(htmlBlock.parentElement);
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
    const deleteButton = htmlBlock.querySelector('.delete_button');
    const workspace = document.querySelector('.workspace');

    input.addEventListener('input', function(e) {
        block.parameters['value'] = e.target.value;
        console.log(block.parameters['value']);
    })

    deleteButton.addEventListener('click', function() {
        const parentContainer = htmlBlock.parentElement;
        htmlBlock.remove();
        blocks.delete(block.id);
        updateNestedContainer(parentContainer);
    })
}

export function clearAllBlocks() {
    const workspace = document.querySelector(".workspace");
    if (workspace) {
        workspace.innerHTML = '';
    }
    blocks.clear();
}