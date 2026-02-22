import {addBlockAtPosition, clearAllBlocks} from './ManageInstructionsBlocks.js'
import { createHTMLInstructionBlock } from './CreateHTMLInstructionBlock.js';

document.addEventListener('dragstart', (e) => {
    e.preventDefault();
})

const instructionsbuttons = document.querySelectorAll('.instruction');
const workspace = document.querySelector('.workspace')
const placeholder = document.createElement('div');
placeholder.className = 'placeholder';

const clearButton = document.getElementById('clear-workspace');
if (clearButton) {
    clearButton.addEventListener('click', () => {
        if (confirm("Вы уверены, что хотите удалить все блоки?")) {
            clearAllBlocks();
        }
    });
}

let ghost = null;
let currentType = null;

let draggingMode = null;
let draggedBlock = null;

instructionsbuttons.forEach(button => {
    button.addEventListener('mousedown', (e) => {

        if (e.button !== 0) return;

        e.preventDefault();
        
        document.body.classList.add('dragging');
        draggingMode = 'new';

        currentType = button.dataset.blockType;

        ghost = createHTMLInstructionBlock({type: currentType}, true)
        setupGhost(ghost, e.pageX, e.pageY);

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
});

workspace.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;

    const block = e.target.closest('.block');
    if (!block) return;

    e.preventDefault();
    document.body.classList.add('dragging');

    draggingMode = 'move';
    draggedBlock = block;
    currentType = block.dataset.type;

    ghost = block.cloneNode(true);
    setupGhost(ghost, e.pageX, e.pageY);

    block.style.display = 'none';
    block.parentNode.insertBefore(placeholder, block);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});


function getDragAfterElement(container, y) {
    const draggableElements = [... container.querySelectorAll('.block:not(.ghost)')]
        .filter(el => el.style.display !== 'none');

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return {offset: offset, element: child };
        } else {
            return closest;
        }
    }, {offset: Number.NEGATIVE_INFINITY }).element;
}


function setupGhost(ghostElement, x, y) {
    ghostElement.classList.add('ghost');
    ghostElement.style.position = 'fixed';
    ghostElement.style.pointerEvents = 'none';
    ghostElement.style.opacity = '0.6';
    ghostElement.style.zIndex = '1000';

    document.body.appendChild(ghostElement);
    moveAt(x, y);
}

function moveAt(x, y) {
    if (!ghost) return;
    ghost.style.left = x + 5 + 'px';
    ghost.style.top = y + 5 + 'px';
}

function onMouseMove(e) {
    moveAt(e.pageX, e.pageY);

    const workspaceRect = workspace.getBoundingClientRect();

    if (
        e.clientX > workspaceRect.left && e.clientX < workspaceRect.right &&
        e.clientY > workspaceRect.top && e.clientY < workspaceRect.bottom
    ) {
        const afterElement = getDragAfterElement(workspace, e.clientY);
        if (afterElement == null) {
            workspace.appendChild(placeholder);
        } else {
            workspace.insertBefore(placeholder, afterElement);
        }
    } else {
        if (placeholder.parentNode === workspace) {
            placeholder.remove();
        }
    }
}

function onMouseUp(e) {
    document.body.classList.remove('dragging');

    if (draggingMode === 'new') {
        if (placeholder.parentNode === workspace) {
            addBlockAtPosition(currentType, placeholder);
        } else {
            placeholder.remove();
        }
    } else if (draggingMode === 'move') {
        if (placeholder.parentNode === workspace) {
            workspace.insertBefore(draggedBlock, placeholder);
        }

        draggedBlock.style.display = '';
        placeholder.remove();
    }

    if (ghost) {
        ghost.remove();
        ghost = null;
    }

    draggedBlock = null;
    draggingMode = null;

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

