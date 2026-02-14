(function() {
    const instructions = document.querySelectorAll('.instruction[data-block-type]');
    const workspace = document.querySelector('.workspace');
    const workspaceBloksConfig = {
        variable: {
            title: "Переменная",
            color: "#03ff10",
            parameters: [{type: "text", placeholder: "Переменная" , value: none}]
        },
        assignment:{
            title: "Присваивание",
            color: "#034aff",
            parameters: [{type: "text", value: "x"}, {type: "text", value: "x"}]
        },
        output:{
            title: "Вывод",
            color: "#ffb700",
            parameters: [{type: "text", value: "x"}]
        }
    };

    function CreateInstructionBlock(type) {
        const config = workspaceBloksConfig[type];
        if (!config) return; // если тип не найден

        const blockDiv = document.createElement("div");
        blockDiv.className = 'workspace_instruction';
        blockDiv.dataset.block_type = type;

        // Заголовок с названием блока и кнопкой удаления
        const header = document.createElement("div");
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '5px';
        header.style.fontWeight = 'bold';

        const titleSpan = document.createElement("span");
        titleSpan.textContent = config.title;
        header.appendChild(titleSpan);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = '✖';
        deleteBtn.style.background = 'none';
        deleteBtn.style.border = 'none';
        deleteBtn.style.color = 'red';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.fontSize = '16px';
        deleteBtn.title = 'Удалить блок';
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            blockDiv.remove();
        });
        header.appendChild(deleteBtn);
        blockDiv.appendChild(header);

        // Поля ввода из параметров
        config.parameters.forEach(param => {
            const input = document.createElement("input");
            input.type = param.type;
            input.value = param.value;
            input.style.display = 'block';
            input.style.marginBottom = '5px';
            input.style.width = '100%';
            input.style.padding = '4px';
            input.style.border = '1px solid #ccc';
            input.style.borderRadius = '3px';
            blockDiv.appendChild(input);
        });

        // Оформление блока
        blockDiv.style.backgroundColor = config.color + '33'; // полупрозрачный фон
        blockDiv.style.border = `2px solid ${config.color}`;
        blockDiv.style.borderRadius = '5px';
        blockDiv.style.padding = '10px';
        blockDiv.style.marginBottom = '10px';
        blockDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        blockDiv.style.width = '10%';

        workspace.appendChild(blockDiv);
    }

    instructions.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.blockType; // используем data-атрибут
            CreateInstructionBlock(type);
        });
    });

})();