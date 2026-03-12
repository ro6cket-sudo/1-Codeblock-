export function createHTMLInstructionBlock(codeBlock, isGhost = false) {
    const block = document.createElement("div");
    block.className = "block";
    block.dataset.id = codeBlock.id;

    block.dataset.type = codeBlock.type;


    switch (codeBlock.type) {
        case 'if':
        case 'while': {
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
            break;
        }
        case 'else': {
            block.classList.add('container-block');
        
            block.innerHTML = `
            <div class="block-header condition-header">
                <span class="condition-label">else</span>
            </div>
            ${!isGhost ? 
                '<div class="nested-workspace"></div>' +
                '<div class="block-footer"></div>' : ''}
            `;
            break;
        }
        case 'for': {
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
                    '<div class="block-footer"></div>' : ''}
            `;
            break;
        }
        case 'variable': {
            block.classList.add('block-variable');
            if (isGhost) block.classList.add('ghost');
        
            block.innerHTML = `
                <span class="variable-label">numeric variable</span>
                <div class="input-container">
                    <input type="text" class="variable-input">
                </div>
            `;
            break;
        }
        case 'boolean_variable': {
            block.classList.add('block-boolean');
            if (isGhost) block.classList.add('ghost');

            block.innerHTML = `
                <span class="variable-label">boolean variable</span>
                <div class="input-container">
                    <input type="text" class="variable-input">
                </div>
            `;
            break;
        }
        case 'string_variable': {
            block.classList.add('block-string');
            if (isGhost) block.classList.add('ghost');

            block.innerHTML = `
                <span class="variable-label">string variable</span>
                <div class="input-container">
                    <input type="text" class="variable-input">
                </div>
            `;
            break;
        }
        case 'assignment': {
            block.classList.add('block-assignment');
            if (isGhost) block.classList.add('ghost');
        
            block.innerHTML = `
                <span class="assignment-label">assignment</span>
                <div class="input-container var-name-frame">
                    <input type="text" class="variable-input assignment-var-input" autocomplete="off" list="variables-list">
                </div>
                <div class="input-container var-value-frame">
                    <input type="text" class="variable-input">
                </div>
            `;
            break;
        }

        case 'floor': {
            block.classList.add('block-floor');
            block.style.backgroundColor = '#ffffff';
            block.style.borderColor = "#7e807e";
            block.innerHTML =  `
                <span class="floor-label">Floor</span>
                <div class="input-container var-name-frame">
                    <input type="text" class="variable-input floor-var-input" autocomplete="off" list="variables-list">
                </div>`;
            break;
        }

        case 'ceil': {
            block.classList.add('block-ceil');
            block.style.backgroundColor = '#ffffff';
            block.style.borderColor = "#7e807e";
            block.innerHTML =  `
                <span class="ceil-label">Ceil</span>
                <div class="input-container var-name-frame">
                    <input type="text" class="variable-input ceil-var-input" autocomplete="off" list="variables-list">
                </div>`;
            break;
        }

        case 'round': {
            block.classList.add('block-round');
            block.style.backgroundColor = '#ffffff';
            block.style.borderColor = "#7e807e";
            block.innerHTML =  `
                <span class="round-label">Round</span>
                <div class="input-container var-name-frame">
                    <input type="text" class="variable-input round-var-input" autocomplete="off" list="variables-list">
                </div>`;
            break;
        }

        case 'tu_number': {
            block.classList.add('block-convertor');
            block.style.backgroundColor = '#b2f2bb';
            block.style.borderColor = "#51cf66";
            block.innerHTML =  `
                <span class="tu_number-label">Convert To Number</span>
                <div class="input-container var-name-frame">
                    <input type="text" class="variable-input convector-var-input" autocomplete="off" list="variables-list">
                </div>`;
            break;
        }

        case 'tu_string': {
            block.classList.add('block-convertor');
            block.style.backgroundColor = '#d550fd';
            block.style.borderColor = "#9939b7";
            block.innerHTML =  `
                <span class="tu_number-label">Convert To String </span>
                <div class="input-container var-name-frame">
                    <input type="text" class="variable-input convector-var-input" autocomplete="off" list="variables-list">
                </div>`;
            break;
        }

        case 'tu_boolean': {
            block.classList.add('block-convertor');
            block.style.backgroundColor = '#ff00dd';
            block.style.borderColor = "#bd03a4";
            block.innerHTML =  `
                <span class="tu_number-label">Convert To Bool</span>
                <div class="input-container var-name-frame">
                    <input type="text" class="variable-input convector-var-input" autocomplete="off" list="variables-list">
                </div>`;
            break;
        }

        case 'output': {
            block.classList.add('block-output');
            block.innerHTML = `
                <span class="label">output</span>
                <div class="input-container"> 
                    <input type="text" class="output-input">
                </div>
            `;
            break;
        }
        case 'array': {
            block.classList.add('block-array');
            block.innerHTML = `
                <span class="label">array</span>
                <div class="input-container">
                    <input type="text" class="array-name-input" placeholder="имя">
                </div>
                <div class="input-container">
                    <input type="text" class="array-size-input" placeholder="размер">
                </div>
            `;
            break;
        }
        case 'nothing': {
            block.classList.add('block-nothing');
            block.innerHTML = ``;
            break;
        }
        case 'function': {
            block.classList.add('container-block');
            block.innerHTML = `
                <div class="block-header condition-header" style="background-color: #ff9800; border-color: #e65100;">
                    <h4 class="blockName">function</h4>
                    <input class="function-name-input" placeholder="имя">
                    <input class="function-params-input" placeholder="параметры через запятую">
                </div>
                ${!isGhost ? 
                    '<div class="nested-workspace"></div>' +
                    '<div class="block-footer" style="background-color: #ff9800"></div>' : ''}
            `;
            break;
        }
        case 'return': {
            block.classList.add('block-return');
            block.innerHTML = `
                <span class="label">return</span>
                <div class="input-container">
                    <input type="text" class="return-input">
                </div>
            `;
            break;
        }
        case 'call': {
            block.classList.add('block-call');
            block.innerHTML = `
                <span class="label">call</span>
                <div class="input-container">
                    <input type="text" class="call-input">
                </div>
            `;
            break;
        }
    }
    
    return block;
}