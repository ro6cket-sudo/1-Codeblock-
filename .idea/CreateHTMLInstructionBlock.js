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
                <div class="input-container input-container-base">
                    <input type="text" class="variable-input input-base">
                </div>
            `;
            break;
        }
        case 'boolean_variable': {
            block.classList.add('block-boolean');
            if (isGhost) block.classList.add('ghost');

            block.innerHTML = `
                <span class="variable-label">boolean variable</span>
                <div class="input-container input-container-base">
                    <input type="text" class="variable-input input-base">
                </div>
            `;
            break;
        }
        case 'string_variable': {
            block.classList.add('block-string');
            if (isGhost) block.classList.add('ghost');

            block.innerHTML = `
                <span class="variable-label">string variable</span>
                <div class="input-container input-container-base">
                    <input type="text" class="variable-input input-base">
                </div>
            `;
            break;
        }
        case 'assignment': {
            block.classList.add('block-assignment');
            if (isGhost) block.classList.add('ghost');
        
            block.innerHTML = `
                <span class="assignment-label">assignment</span>
                <div class="input-container var-name-frame input-container-base">
                    <input type="text" class="variable-input assignment-var-input input-base" autocomplete="off" list="variables-list">
                </div>
                <div class="input-container var-value-frame input-container-base">
                    <input type="text" class="variable-input input-base">
                </div>
            `;
            break;
        }

        case 'floor': {
            block.classList.add('block-floor');
            block.innerHTML =  `
                <span class="floor-label">Floor</span>
                <div class="input-container var-name-frame input-container-base">
                    <input type="text" class="variable-input floor-var-input input-base" autocomplete="off" list="variables-list">
                </div>`;
            break;
        }

        case 'ceil': {
            block.classList.add('block-ceil');
            block.innerHTML =  `
                <span class="ceil-label">Ceil</span>
                <div class="input-container var-name-frame input-container-base">
                    <input type="text" class="variable-input ceil-var-input input-base" autocomplete="off" list="variables-list">
                </div>`;
            break;
        }

        case 'round': {
            block.classList.add('block-round');
            block.innerHTML =  `
                <span class="round-label">Round</span>
                <div class="input-container var-name-frame input-container-base">
                    <input type="text" class="variable-input round-var-input input-base" autocomplete="off" list="variables-list">
                </div>`;
            break;
        }

        case 'tu_number': {
            block.classList.add('block-convertor','type-number');
            block.innerHTML =  `
                <span class="tu_number-label">Convert To Number</span>
                <div class="input-container var-name-frame input-container-base">
                    <input type="text" class="variable-input convector-var-input input-base" autocomplete="off" list="variables-list">
                </div>`;
            break;
        }

        case 'tu_string': {
            block.classList.add('block-convertor','type-string');
            block.innerHTML =  `
                <span class="tu_number-label">Convert To String </span>
                <div class="input-container var-name-frame input-container-base">
                    <input type="text" class="variable-input convector-var-input input-base" autocomplete="off" list="variables-list">
                </div>`;
            break;
        }

        case 'tu_boolean': {
            block.classList.add('block-convertor','type-boolean');
            block.innerHTML =  `
                <span class="tu_number-label">Convert To Bool</span>
                <div class="input-container var-name-frame input-container-base">
                    <input type="text" class="variable-input convector-var-input input-base" autocomplete="off" list="variables-list">
                </div>`;
            break;
        }

        case 'output': {
            block.classList.add('block-output');
            block.innerHTML = `
                <span class="label">output</span>
                <div class="input-container input-container-base"> 
                    <input type="text" class="output-input input-base">
                </div>
            `;
            break;
        }
        case 'array': {
            block.classList.add('block-array');
            block.innerHTML = `
                <span class="label">array</span>
                <div class="input-container input-container-base">
                    <input type="text" class="array-name-input input-base" placeholder="имя">
                </div>
                <div class="input-container input-container-base">
                    <input type="number" class="array-size-input input-base" placeholder="размер">
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
            block.classList.add('container-block','block-function');
            block.innerHTML = `
                <div class="block-header condition-header function-header">
                    <h4 class="blockName">function</h4>
                    <input class="function-name-input input-base" placeholder="имя">
                    <input class="function-params-input input-base" placeholder="параметры через запятую">
                </div>
                ${!isGhost ? 
                    '<div class="nested-workspace function-nested-workspace"></div>' +
                    '<div class="block-footer function-footer"></div>' : ''}
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

        case 'slice': {
            block.classList.add('block-slice');
            block.innerHTML = `
                <span class="label">Slice</span>
                <div class="input-container">
                    <input type="text" class="slice-target" placeholder="имя (что режем)" autocomplete="off" list="variables-list">
                </div>
                
                <span class="label">[</span>
                <div class="input-container">
                    <input type="number" class="slice-start-index" placeholder="от">
                </div>
                
                <span class="label">]</span>
                <div class="input-container">
                    <input type="number" class="slice-finish-index" placeholder="до">
                </div>
                
                <span class="label">Slice</span>
                <div class="input-container">
                    <input type="text" class="slice-result" placeholder="имя (куда сохранить)" autocomplete="off" list="variables-list">
                </div>
                `;
            break;
        }

        case 'char': {
            block.classList.add('block-char');
            block.innerHTML = `
                <span class="label">chr</span>
                <div class="input-container var-name-frame input-container-base">
                    <input type="text" class="variable-input convector-var-input input-base" autocomplete="off" list="variables-list">
                </div>`;
            break;
        }

        case 'ord': {
            block.classList.add('block-ord');
            block.innerHTML = `
                <span class="label">ord</span>
                <div class="input-container var-name-frame input-container-base">
                    <input type="text" class="variable-input convector-var-input input-base" autocomplete="off" list="variables-list">
                </div>`;
            break;
        }
    }
    
    return block;
}