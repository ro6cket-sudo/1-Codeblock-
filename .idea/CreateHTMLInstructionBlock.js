export function createHTMLInstructionBlock(codeBlock, isGhost = false) {
    const block = document.createElement("div");
    block.className = "block";
    block.dataset.id = codeBlock.id;

    block.dataset.type = codeBlock.type;


    if (codeBlock.type === 'if' || codeBlock.type === 'while') {
        block.classList.add('container-block');

        block.innerHTML = `
        <div class="block-header condition-header">
            <span class="condition-label">${codeBlock.type}</span>
            <div class="input-container condition-input-frame">
                <input class="code-input">
            </div>
        </div>
        ${!isGhost ? 
            '<div class="nested-workspace"></div>' +
            '<div class="block-footer"></div>' : ''}
        `;
    } else if (codeBlock.type === 'else') {
        block.classList.add('container-block');
        
        block.innerHTML = `
        <div class="block-header condition-header">
            <span class="condition-label">else</span>
        </div>
        ${!isGhost ? 
            '<div class="nested-workspace"></div>' +
            '<div class="block-footer"></div>' : ''}
        `;

    } else if (codeBlock.type === 'for') {
    block.classList.add('container-block');
    block.innerHTML = `
        <div class="block-header condition-header">
            <span class="condition-label">for</span>
            <div class="for-inputs-container">
                <input class="for-input for-init" placeholder="переменная">
                <input class="for-input for-cond" placeholder="условие">
                <input class="for-input for-step" placeholder="шаг"> 
            </div>
        </div>
        ${!isGhost ? 
            '<div class="nested-workspace"></div>' +
            '<div class="block-footer"></div>' : ''} `;
    } 
    
    else if (codeBlock.type === 'variable') {
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