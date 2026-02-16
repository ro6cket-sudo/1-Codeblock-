export function createHTMLInstructionBlock(id, type) {
    const block = document.createElement("div");
    block.className = "block";
    block.dataset.id = id;
    block.style.width = "30px";
    block.style.height = "30px";

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete_button";
    deleteButton.textContent = 'x';

    const input = document.createElement("input");
    input.className = "code-input";

    block.appendChild(input);
    block.appendChild(deleteButton);
    return block;
}