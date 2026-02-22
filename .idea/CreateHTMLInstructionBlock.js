export function createHTMLInstructionBlock(codeBlock, isGhost = false) {
    const block = document.createElement("div");
    block.className = "block";
    block.dataset.id = codeBlock.id;

    block.dataset.type = codeBlock.type;


    if (codeBlock.type === 'if-else' || codeBlock.type === 'while' || codeBlock.type === 'for') {
        block.classList.add('container-block');

        block.innerHTML = `
        <div class="block-header">
            <h4 class="blockName">${codeBlock.type}</h4>
            ${!isGhost ? '<input class="code-input"><button class="delete_button">X</button>' : ''}
        </div>
        <div class="nested-workspace"></div>
        <div class="block-footer"></div>
        `;
    } else {
        block.innerHTML = `
            <h4 class="blockName">${codeBlock.type}</h4>
            `
        if (!isGhost) {
            block.innerHTML += `
                <input class="code-input">
                <button class="delete_button">X</button>
            `;}
    }
    
    return block;
}