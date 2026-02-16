import {CodeBlock} from './CodeBlock.js';
import {createHTMLInstructionBlock} from './CreateHTMLInstructionBlock.js';

export const blocks = new Map();

export function addBlock(type) {
    const id = crypto.randomUUID()
    const workspace = document.querySelector(".workspace");

    const codeBlock = new CodeBlock(id, workspace);
    blocks.set(id, codeBlock);

    const htmlBlock = createHTMLInstructionBlock(id, type);
    addEvents(codeBlock, htmlBlock);
    workspace.append(htmlBlock);
}

function addEvents(block, htmlBlock) {
    const input = htmlBlock.querySelector('input');
    const deleteButton = htmlBlock.querySelector('.delete_button');

    input.addEventListener('input', function(e) {
        block.parameters['value'] = e.target.value;
        console.log(block.parameters['value']);
    })

    deleteButton.addEventListener('click', function() {
        htmlBlock.remove();
        blocks.delete(block.id);
    })
}