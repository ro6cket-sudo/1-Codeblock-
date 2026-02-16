import {addBlock} from './ManageInstructionsBlocks.js'

const instructionsbuttons = document.querySelectorAll('.instruction');
instructionsbuttons.forEach(button => {
    button.addEventListener('click', () => {
        const type = button.dataset.blockType;
        const text = button.textContent;

        addBlock(type, text);
    })
});