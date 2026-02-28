import { Interpretator } from './interpretator.js';
import { logger } from './ConsoleLogger.js';

function runProgram() {
    logger.clear();
    logger.log("Запуск программы...", "success");
    // const blocks = document.querySelectorAll('.workspace .block');
    const workspace = document.querySelector('.workspace');
    
    const globalVariables = {};
    const interpretator = new Interpretator(globalVariables);

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

    // try{
    //     interpretator.executeAll(workspace);
    //     logger.log("Программа завершена.", "success");
    // }
    // catch(err){
    //     logger.error(err);
    // }


    interpretator.executeAll(workspace);

    logger.log("Программа завершена.", "success");
}

document.getElementById('run-btn').addEventListener('click', runProgram);