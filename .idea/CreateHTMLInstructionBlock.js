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
            ${!isGhost ? '<input class="code-input">' : ''}
        </div>
        <div class="nested-workspace"></div>
        <div class="block-footer"></div>
        `;
    } else if (codeBlock.type === 'variable') {
        block.classList.add('block-variable');
        if (isGhost) block.classList.add('ghost');
        
        block.innerHTML = `
            <span class="variable-label">variable</span>
            <div class="input-container">
                <input type="text" class="variable-input" ${isGhost ? 'disabled' : ''}>
            </div>
        `;
    } else if (codeBlock.type === 'assignment'){
        block.classList.add('block-assignment');
        if (isGhost) block.classList.add('ghost');
        
        block.innerHTML = `
            <span class="assignment-label">assignment</span>
            <div class="input-container var-name-frame">
                <input type="text" class="variable-input" ${isGhost ? 'disabled' : ''}>
            </div>
            <div class="input-container var-value-frame">
                <input type="text" class="variable-input" ${isGhost ? 'disabled' : ''}>
            </div>
        `;
    } else if (codeBlock.type === 'output') {
    block.classList.add('block-output');
    block.innerHTML = `
        <span class="label">output</span>
        <div class="input-container"> 
            <input type="text" class="output-input" ${isGhost ? 'disabled' : ''}>
        </div>
    `;
    } else {
        block.innerHTML = `
            <h4 class="blockName">${codeBlock.type}</h4>
            `
        if (!isGhost) {
            block.innerHTML += `
                <input class="code-input">
            `;}
    }
    
    return block;
}