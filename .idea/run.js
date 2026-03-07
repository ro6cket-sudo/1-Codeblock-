import { Interpretator } from './interpretator.js';
import { logger } from './ConsoleLogger.js';

let interpretator = null;

async function debug() {
    interpretator = null;
    logger.clear();
    logger.log("Отладка запущена. Нажмите кнопку 'Следующий шаг ", "success");
    const workspace = document.querySelector('.workspace');
    document.querySelectorAll('.block.error').forEach(block => block.classList.remove('error', 'debug'));

    const globalVariables = {};
    interpretator = new Interpretator(globalVariables);

    try {
        await interpretator.executeDebug(workspace);
        logger.log("Программа завершена.", "success")
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
    interpretator = null;
    logger.clear();
    logger.log("Запуск программы...", "success");
    // const blocks = document.querySelectorAll('.workspace .block');
    const workspace = document.querySelector('.workspace');
    
    const globalVariables = {};
    interpretator = new Interpretator(globalVariables);

    document.querySelectorAll('.block.error').forEach(block => block.classList.remove('error'));

    // blocks.forEach((block, index) => {
        // try {
        //     let code = "";
        //
        //     if (block.classList.contains('block-output')) {
        //         const inputVal = block.querySelector('.output-input').value;
        //         code += `output ${inputVal} `;
        //         code = `output ${inputVal}`;
        //     }
        //     else if (block.classList.contains('block-variable')) {
        //         const name = block.querySelector('.var-name').value;
        //         const value = block.querySelector('.var-value').value;
        //         code = `${name} = ${value}`;
        //     }
        //
        //     if (code) {
        //         const lexer = new Lexer(code);
        //         const tokens = lexer.Analys();
        //
        //         const parser = new Parser(tokens);
        //         const ast = parser.parse();
        //
        //         interpretator.evaluate(ast);
        //     }
        //
        // } catch (error) {
        //     logger.error(`Ошибка в блоке #${index + 1}: ${error.message}`);
        // }
    // });

    try{
        interpretator.executeAll(workspace);
        logger.log("Программа завершена.", "success");
    }
    catch(err){
        logger.error(err);
        console.error(err);
    }
    finally {
        interpretator = null;
    }


    // interpretator.executeAll(workspace);
    //
    // logger.log("Программа завершена.", "success");
}

document.getElementById('run-btn').addEventListener('click', runProgram);
document.getElementById('debug-button').addEventListener('click', debug);
document.getElementById('step-button').addEventListener('click', NextStep);