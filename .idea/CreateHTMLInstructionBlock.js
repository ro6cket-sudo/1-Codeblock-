export function createHTMLInstructionBlock(codeBlock, isGhost = false) {
    const block = document.createElement("div");
    block.className = "block";
    block.dataset.id = codeBlock.id;

    block.dataset.type = codeBlock.type;
    
    block.innerHTML = `<h4 class="blockName">${codeBlock.type}</h4>`;

    if (!isGhost) {
        block.innerHTML +=`
            <input class="code-input">
            <button class="delete_button">X</button>`;
    }
    
    return block;
}