import { Interpretator } from './interpretator.js';
import { logger } from './ConsoleLogger.js';

let interpretator = null;

function updateVar(variables) {
    const var_list = document.getElementById('var-list');
    const var_names = Object.keys(variables);

    if (var_names.length === 0) {
        var_list.innerHTML = 'Empty';
        return
    }

    var_list.innerHTML = var_names.map(name => {
        let value = variables[name];



        return `<div class="var">${name}:${value}</div>`
    }).join('');
}

async function debug() {
    showVariablesPanel();
    interpretator = null;
    logger.clear();
    logger.log("Отладка запущена. Нажмите кнопку 'Следующий шаг ", "success");
    const workspace = document.querySelector('.workspace');
    document.querySelectorAll('.block.error').forEach(block => block.classList.remove('error', 'debug'));

    const globalVariables = {};
    interpretator = new Interpretator(globalVariables);
    interpretator.step = (variables) => {updateVar(variables);};
    try {
        await interpretator.executeDebug(workspace);
        logger.log("Программа завершена.", "success")
        updateVar(globalVariables);
    }
    catch (error) {
        logger.error(error);
        console.error(error);
    }
    finally {
        interpretator = null
    }
}

function NextStep() {
    if (interpretator && interpretator.stepPermit) {
        interpretator.stepPermit();
    }
    else {
        logger.log("Снчала запустите режи отладки!")
    }
}

function runProgram() {
    hideVariablesPanel();
    interpretator = null;
    logger.clear();
    logger.log("Запуск программы...", "success");
    // const blocks = document.querySelectorAll('.workspace .block');
    const workspace = document.querySelector('.workspace');
    
    const globalVariables = {};
    interpretator = new Interpretator(globalVariables);

    document.querySelectorAll('.block.error').forEach(block => block.classList.remove('error'));

    try{
        interpretator.executeAll(workspace);
        logger.log("Программа завершена.", "success");
    }
    catch(err){
        logger.error(err);
        // console.error(err);
    }
    finally {
        interpretator = null;
    }
}

function showVariablesPanel() {
    const varStates = document.querySelector('.var-states');
    if (varStates) {
        varStates.classList.add('visible');
    }
}

function hideVariablesPanel() {
    const varStates = document.querySelector('.var-states');
    if (varStates) {
        varStates.classList.remove('visible');
    }
}

document.getElementById('run-btn').addEventListener('click', runProgram);
document.getElementById('debug-button').addEventListener('click', debug);
document.getElementById('step-button').addEventListener('click', NextStep);