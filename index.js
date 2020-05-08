function add(...operands) {
    let numbers = operands.map(num => parseFloat(num));
    return numbers.reduce((acc, current) => {
        return acc += current;
    });
}

function subtract(...operands) {
    let numbers = operands.map(num => parseFloat(num));
    return numbers.reduce((acc, current) => {
        return acc -= current;
    });
}

function multiply(...operands) {
    let numbers = operands.map(num => parseFloat(num));
    return numbers.reduce((acc, current) => {
        return acc *= current;
    });
}

function divide(...operands) {
    let numbers = operands.map(num => parseFloat(num));
    return numbers.reduce((acc, current) => {
        return acc /= current;
    });
}

function operate(operator, ...operands) {
    const fn = window[operator];
    return fn(...operands);
}

function clear(e) {
}

const calculator = document.querySelector(".calculator");
const display = document.querySelector(".display");

calculator.addEventListener("click", e => {
    const key = e.target;
    const action = key.dataset.action;
    const keyContent = key.textContent;
    const displayedNum = display.textContent;
    const previousKeyType = calculator.dataset.previousKeyType;
    const clearButton = calculator.querySelector("[data-action=clear]");

    if (key.matches("button")) {
        // Number keys
        if (!action) {
            if (displayedNum === "0" || previousKeyType === "operator") {
                display.textContent = keyContent;
            } else {
                if (displayedNum.length < 8) {
                    display.textContent += keyContent;
                }
            }

            calculator.dataset.previousKeyType = "number";
            clearButton.textContent = "CE";

            Array.from(key.parentNode.parentNode.children).forEach(group => {
                Array.from(group.children).forEach(button => {
                    button.classList.remove("pressed");
                });
            });

        // Operation keys
        } else if (
            action === "add" ||
            action === "subtract" ||
            action === "multiply" ||
            action === "divide"
            ) {
                Array.from(key.parentNode.parentNode.children).forEach(group => {
                    Array.from(group.children).forEach(button => {
                        button.classList.remove("pressed");
                    });
                });

                const firstValue = calculator.dataset.firstValue;
                const operator = calculator.dataset.operator;
                const secondValue = displayedNum;

                if (firstValue && operator && previousKeyType !== "operator") {
                    const calcValue = operate(operator, firstValue, secondValue);       
                    display.textContent = calcValue;
                    
                    calculator.dataset.firstValue = calcValue;
                } else {
                    calculator.dataset.firstValue = displayedNum;
                }

                key.classList.add("pressed");
                calculator.dataset.previousKeyType = "operator";
                calculator.dataset.operator = action;
                clearButton.textContent = "CE";

        // Decimal key
        } else if (action === "decimal") {
            if (!displayedNum.includes(".")) {
                display.textContent += keyContent;
            } else if (previousKeyType === "operator") {
                display.textContent = "0.";
            }

            calculator.dataset.previousKeyType = "decimal";
            clearButton.textContent = "CE";

        // Clear key
        } else if (action === "clear") {
            if (key.textContent === "AC") {
                calculator.dataset.firstValue = "";
                calculator.dataset.previousKeyType = "";
                calculator.dataset.modValue = "";
                calculator.dataset.operator = "";
                Array.from(key.parentNode.parentNode.children).forEach(group => {
                    Array.from(group.children).forEach(button => {
                        button.classList.remove("pressed");
                    });
                });
            } else {
                key.textContent = "AC";
            }
        
            display.textContent = 0;
            calculator.dataset.previousKeyType = "clear";

        // Equals key
        } else if (action === "operate") {
            let firstValue = calculator.dataset.firstValue;
            const operator = calculator.dataset.operator;
            let secondValue = displayedNum;

            if (operator === "divide" && secondValue === "0") {
                display.textContent = "error";
            } else {
                if (firstValue) {
                    if (previousKeyType === "operator") {
                        firstValue = displayedNum
                        secondValue = calculator.dataset.modValue;
                    }
                }
    
                const value = operate(operator, firstValue, secondValue);
                
                if (value.toString().length > 8) {
                    display.textContent = "overflow";
                } else {
                    const parsedValue = parseFloat((value).toFixed(5));
                    display.textContent = parsedValue;
                }
            }

            calculator.dataset.modValue = secondValue;
            calculator.dataset.previousKeyType = "operator";
            clearButton.textContent = "CE";

        // Back key
        } else if (action === "back") {
            if (displayedNum.length > 1) {
                display.textContent = displayedNum.slice(0, -1);
            }
        }
    }
});

window.addEventListener("keydown", e => {
    const key = e.key;
    const displayedNum = display.textContent;
    const previousKeyType = calculator.dataset.previousKeyType;
    const clearButton = calculator.querySelector("[data-action=clear]");
    const operations = {
        "+":"add",
        "-":"subtract",
        "/":"divide",
        "*":"multiply"
    }

    if (parseInt(key) || key === "0") {
        // Number keys
        if (displayedNum === "0" || previousKeyType === "operator") {
            display.textContent = key;
        } else {
            if (displayedNum.length < 8) {
                display.textContent += key;
            }
        }

        calculator.dataset.previousKeyType = "number";
        clearButton.textContent = "CE";

        Array.from(calculator.children).forEach(group => {
            Array.from(group.children).forEach(button => {
                button.classList.remove("pressed");
            });
        });

    // Operation keys
    } else if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
        ) {
            Array.from(calculator.children).forEach(group => {
                Array.from(group.children).forEach(button => {
                    button.classList.remove("pressed");
                });
            });
            
            const firstValue = calculator.dataset.firstValue;
            const operator = calculator.dataset.operator;
            const secondValue = displayedNum;

            if (firstValue && operator && previousKeyType !== "operator") {
                const calcValue = operate(operator, firstValue, secondValue);       
                display.textContent = calcValue;
                
                calculator.dataset.firstValue = calcValue;
            } else {
                calculator.dataset.firstValue = displayedNum;
            }
            
            const button = document.querySelector(`[data-action=${operations[key]}]`);
            button.classList.add("pressed");
            calculator.dataset.previousKeyType = "operator";
            calculator.dataset.operator = operations[key];
            clearButton.textContent = "CE";

    // Decimal key
    } else if (key === ".") {
        if (!displayedNum.includes(".")) {
            display.textContent += key;
        } else if (previousKeyType === "operator") {
            display.textContent = "0.";
        }

        calculator.dataset.previousKeyType = "decimal";
        clearButton.textContent = "CE";

    } else if (key === "Delete") {
        if (clearButton.textContent === "AC") {
            calculator.dataset.firstValue = "";
            calculator.dataset.previousKeyType = "";
            calculator.dataset.modValue = "";
            calculator.dataset.operator = "";
            Array.from(key.parentNode.parentNode.children).forEach(group => {
                Array.from(group.children).forEach(button => {
                    button.classList.remove("pressed");
                });
            });
        } else {
            clearButton.textContent = "AC";
        }
    
        display.textContent = 0;
        calculator.dataset.previousKeyType = "clear";

    // Equals key
    } else if (key === "Enter") {
        let firstValue = calculator.dataset.firstValue;
        const operator = calculator.dataset.operator;
        let secondValue = displayedNum;

        if (operator === "divide" && secondValue === "0") {
            display.textContent = "error";
        } else {
            if (firstValue) {
                if (previousKeyType === "operator") {
                    firstValue = displayedNum
                    secondValue = calculator.dataset.modValue;
                }
            }
    
            const value = operate(operator, firstValue, secondValue);
            
            if (value.toString().length > 8) {
                display.textContent = "overflow";
            } else {
                const parsedValue = parseFloat((value).toFixed(5));
                display.textContent = parsedValue;
            }
        }

        calculator.dataset.modValue = secondValue;
        calculator.dataset.previousKeyType = "operator";
        clearButton.textContent = "CE";

    // Back key
    } else if (key === "Backspace") {
        if (displayedNum.length > 1) {
            display.textContent = displayedNum.slice(0, -1);
        }
    }
});