import {addBlockAtPosition, clearAllBlocks, blocks, updateNestedContainer} from './ManageInstructionsBlocks.js'
import { createHTMLInstructionBlock } from './CreateHTMLInstructionBlock.js';

document.addEventListener('dragstart', (e) => {
    e.preventDefault();
})

const instructionsbuttons = document.querySelectorAll('.instruction');
const workspace = document.querySelector('.workspace')
const placeholder = document.createElement('div');
placeholder.className = 'placeholder';

const trashBin = document.getElementById('trash-bin');

const clearButton = document.getElementById('clear-workspace');
if (clearButton) {
    clearButton.addEventListener('click', () => {
        clearAllBlocks();
    });
}

let ghost = null;
let currentType = null;

let draggingMode = null;
let draggedBlock = null;
let origContainer = null;

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
    origContainer = block.parentElement;
    currentType = block.dataset.type;

    ghost = block.cloneNode(true);
    setupGhost(ghost, e.pageX, e.pageY);

    block.style.display = 'none';
    block.parentNode.insertBefore(placeholder, block);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});


function getDragAfterElement(container, y) {
    const draggableElements = [... container.children]
        .filter(el =>
            el.classList.contains('block') &&
            !el.classList.contains('ghost') &&
            el.style.display !== 'none'
        );

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


function setupGhost(ghostEl, x, y) {
    ghostEl.classList.add('ghost');
    ghostEl.style.position = 'fixed';
    ghostEl.style.pointerEvents = 'none';
    ghostEl.style.opacity = '0.6';
    ghostEl.style.zIndex = '1000';

    document.body.appendChild(ghostEl);
    moveAt(x, y);
}

function moveAt(x, y) {
    if (!ghost) return;
    ghost.style.left = x + 5 + 'px';
    ghost.style.top = y + 5 + 'px';
}

function onMouseMove(e) {
    moveAt(e.pageX, e.pageY);

    const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
    const activeContainer = elementUnderCursor ? elementUnderCursor.closest('.workspace, .nested-workspace') : null;

    const trashRect = trashBin.getBoundingClientRect();

    const isOverTrash = (
        e.clientX > trashRect.left && e.clientX < trashRect.right &&
        e.clientY > trashRect.top && e.clientY < trashRect.bottom
    );

    if (isOverTrash) {
        trashBin.classList.add('hover');
        if (placeholder.parentNode) placeholder.remove();
    } else {
        trashBin.classList.remove('hover');
        
        if (activeContainer) {
            const afterElement = getDragAfterElement(activeContainer, e.clientY);
            
            if (afterElement == null) {
                activeContainer.appendChild(placeholder);
            } else {
                activeContainer.insertBefore(placeholder, afterElement);
            }
        } else {
            if (placeholder.parentNode) {
                placeholder.remove();
            }
        }  
    } 
}

function onMouseUp(e) {
    document.body.classList.remove('dragging');
    
    if (trashBin.classList.contains('hover')) {
        if (draggingMode === 'move' && draggedBlock) {
            const id = draggedBlock.dataset.id;
            blocks.delete(id);
            draggedBlock.remove();
        }
        if (placeholder.parentNode) placeholder.remove();
    }
    else {
        if (draggingMode === 'new') {
            if (placeholder.parentNode) {
                addBlockAtPosition(currentType, placeholder);
            }
        } else if (draggingMode === 'move') {
            if (placeholder.parentNode) {
                const newContainer = placeholder.parentNode;
                newContainer.insertBefore(draggedBlock, placeholder);

                updateNestedContainer(origContainer);
                updateNestedContainer(newContainer);
            }

            draggedBlock.style.display = '';
            placeholder.remove();
        }
    }

    trashBin.classList.remove('hover');

    if (ghost) {
        ghost.remove();
        ghost = null;
    }

    draggedBlock = null;
    draggingMode = null;
    origContainer = null;

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

