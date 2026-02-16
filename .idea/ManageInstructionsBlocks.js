import {CodeBlock} from './CodeBlock';
import {CreateHtmInstructionlBlock} from './CreateHtmInstructionlBlock';

export const blocks = Map;

export function addBlock(type) {
    const id = crypto.randomUUID()
    const worckspace = document.querySelector(".worckspace");

    const codeBlock = new CodeBlock(id, worckspace);
    blocks.set(id, codeBlock);

    const htmlBlock = CreateHtmInstructionlBlock(id, type);
    addBlock(htmlBlock);
    worckspace.append(htmlBlock);
}

function addEvents(block, htmlBlock) {
    const input = htmlBlock.querySelector('input');
    const deleteButton = htmlBlock.querySelector('.delete_button');

    input.addEventListener('input', function(e) {
        block.parameters['value'] = e.target.value;
    })

    deleteButton.addEventListener('click', function() {
        htmlBlock.remove();
        blocks.delete(block.id);
    })
}