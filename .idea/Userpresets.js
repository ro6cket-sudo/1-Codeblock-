import { CodeBlock } from "./CodeBlock.js";
import { createHTMLInstructionBlock } from "./CreateHTMLInstructionBlock.js";
import { blocks, clearAllBlocks, sortBlocks } from "./ManageInstructionsBlocks.js";


const workspace = document.querySelector('.workspace');
const STORAGE = 'codeblock_user_presets';


function serializeContainer(container) {
    const result = [];

    for (const child of container.children) {
        if (!child.classList.contains('block')) continue;

        const node = {
            type: child.dataset.type,
            inputs: {},
            children: []
        };

        child.querySelectorAll('input').forEach(input => {
            const key = input.className || input.placeholder || 'input';
            node.inputs[key] = input.value;
        });

        const nested = child.querySelector(':scope > .nested-workspace');
        if (nested) {
            node.children = serializeContainer(nested);
        }

        result.push(node);
    }

    return result;
}

function serializeWorkspace() {
    return serializeContainer(workspace);
}


function makeBlock(type, container) {
    const id = crypto.randomUUID();
    const codeBlock = new CodeBlock(id, type);
    blocks.set(id, codeBlock);

    const htmlBlock = createHTMLInstructionBlock(codeBlock);
    htmlBlock.dataset.id = id;

    if (['if', 'while', 'for', 'else', 'function'].includes(type)) {
        const endId = crypto.randomUUID();
        const endBlock = new CodeBlock(endId, 'end');
        endBlock.parentId = id;
        blocks.set(endId, endBlock);
        codeBlock.endID = endId;
        
        const footer = htmlBlock.querySelector('.block-footer');
        if (footer) footer.dataset.id = endId;
    }

    container.appendChild(htmlBlock);
    return htmlBlock;
}


function deserializeContainer(nodes, container) {
    for (const node of nodes) {
        const htmlBlock = makeBlock(node.type, container);

        const inputs = htmlBlock.querySelectorAll('input');
        const savedValues = Object.values(node.inputs);

        inputs.forEach((input, i) => {
            if (savedValues[i] !== undefined) {
                input.value = savedValues[i];
            }
        });

        if (node.children.length > 0) {
            const nested = htmlBlock.querySelector('.nested-workspace');
            if (nested) {
                deserializeContainer(node.children, nested);
            }
        }
    }
}

function loadPresetData(data) {
    clearAllBlocks();
    deserializeContainer(data, workspace);
    sortBlocks();
}

function getAllPresets() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE)) ?? {};
    } catch {
        return {};
    }
}

function savePreset(name) {
    if (!name.trim()) return;
    
    const presets = getAllPresets();
    presets[name.trim()] = serializeWorkspace();
    localStorage.setItem(STORAGE, JSON.stringify(presets));
    renderPresetList();
}

function deletePreset(name) {
    const presets = getAllPresets();
    delete presets[name];
    localStorage.setItem(STORAGE, JSON.stringify(presets));
    renderPresetList();
}



function renderPresetList() {
    const list = document.getElementById('user-preset-list');
    if (!list) return;

    const presets = getAllPresets();
    const names = Object.keys(presets);

    if (names.length === 0) {
        list.innerHTML = '<li class="no-presets"> No presets</li>';
        return;
    }

    list.innerHTML = names.map(name => `
        <li class="user-preset-item">
            <button class="user-preset-load" data-name="${name}">${name}</button>
            <button class="user-preset-delete" data-name="${name}" title="delete">X</button>
        </li>
    `).join('');


    list.querySelectorAll('.user-preset-load').forEach(btn => {
        btn.addEventListener('click', () => {
            const data = getAllPresets()[btn.dataset.name];
            if (data) loadPresetData(data);
        });
    });

    list.querySelectorAll('.user-preset-delete').forEach(btn => {
        btn.addEventListener('click', () => deletePreset(btn.dataset.name));
    });
}

function initPresetUI() {
    const toolbar = document.querySelector('.toolbar');

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.id = 'save-button-btn';
    saveBtn.textContent = 'preset editor';
    toolbar.appendChild(saveBtn);


    const panel = document.createElement('div');
    panel.id = 'user-presets-panel';
    panel.innerHTML = `
        <div class="user-presets-header">
            <h4>my presets</h4>
            <button type="button" id="close-presets-panel">X</button>
        </div>
        <div class="user-presets-save">
            <input type="text" id="preset-name-input" placeholder="preset name">
            <button type="button" id="confirm-save-preset">save</button>
        </div>
        <ul id="user-preset-list"></ul>
    `;
    document.querySelector('.codeblock').appendChild(panel);

    saveBtn.addEventListener('click', () => {
        panel.classList.toggle('visible');
        if (panel.classList.contains('visible')) {
            renderPresetList();
            document.getElementById('preset-name-input').focus();
        }
    });

    document.getElementById('close-presets-panel').addEventListener('click', () => {
        panel.classList.remove('visible');
    });

    document.getElementById('confirm-save-preset').addEventListener('click', () => {
        const input = document.getElementById('preset-name-input');
        savePreset(input.value);
        input.value = '';
    });

    document.getElementById('preset-name-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = document.getElementById('preset-name-input');
            savePreset(input.value);
            input.value = '';
        }
    });
}

initPresetUI();