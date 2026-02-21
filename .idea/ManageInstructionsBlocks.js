import {CodeBlock} from './CodeBlock.js';
import {createHTMLInstructionBlock} from './CreateHTMLInstructionBlock.js';

export const blocks = new Map();

export function addBlock(type) {
    const id = crypto.randomUUID()
    const workspace = document.querySelector(".workspace");

    const codeBlock = new CodeBlock(id, type);
    blocks.set(id, codeBlock);

    // const htmlBlock = createHTMLInstructionBlock(id, type);
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

    return htmlBlock;

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
        htmlBlock.remove();
        blocks.delete(block.id);
    })
}