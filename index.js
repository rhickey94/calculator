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
    const key = e.target;
    Array.from(key.parentNode.parentNode.children).forEach(group => {
        Array.from(group.children).forEach(button => {
            button.classList.remove("pressed");
        });
    });

    display.textContent = 0;
    calculator.dataset.firstValue = "";
    calculator.dataset.previousKeyType = "";
}

const calculator = document.querySelector(".calculator");
const display = document.querySelector(".display");

calculator.addEventListener("click", e => {
    const key = e.target;
    const action = key.dataset.action;
    const keyContent = key.textContent;
    const displayedNum = display.textContent;
    const previousKeyType = calculator.dataset.previousKeyType;

    if (key.matches("button")) {
        if (!action) {
            if (displayedNum === "0" || previousKeyType === "operator") {
                display.textContent = keyContent;
            } else {
                if (displayedNum.length < 8) {
                    display.textContent += keyContent;
                }
            }
            calculator.dataset.previousKeyType = "number";
            Array.from(key.parentNode.parentNode.children).forEach(group => {
                Array.from(group.children).forEach(button => {
                    button.classList.remove("pressed");
                });
            });
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
        } else if (action === "decimal") {
            if (!displayedNum.includes(".") && !previousKeyType === "operator") {
                display.textContent += keyContent;
            } else if (previousKeyType === "operator") {
                display.textContent = "0.";
            }
            calculator.dataset.previousKeyType = "decimal";
        } else if (action === "clear") {
            clear(e);
            calculator.dataset.previousKeyType = "clear";
        } else if (action === "operate") {
            const firstValue = calculator.dataset.firstValue;
            const secondValue = displayedNum;
            const operator = calculator.dataset.operator;
            const value = operate(operator, firstValue, secondValue);

            console.log(value, typeof value)

            if (operator === "divide" && secondValue == 0) {
                display.textContent = "ERROR";
            } else {
                if (value.toString().length > 8) {
                    display.textContent = "overflow";
                } else {
                    display.textContent = parseFloat((value).toFixed(5));
                }
            }

            calculator.dataset.previousKeyType = "operator";
        } else if (action === "back") {
            display.textContent = displayedNum.slice(0, -1);
        }
    }
});

window.addEventListener("keydown", e => {
    const key = e.key;
    const displayedNum = display.textContent;
    const previousKeyType = calculator.dataset.previousKeyType;
    const operations = {
        "+":"add",
        "-":"subtract",
        "/":"divide",
        "*":"multiply"
    }

    if (parseInt(key) || key === "0") {
        if (displayedNum === "0" || previousKeyType === "operator") {
            display.textContent = key;
            calculator.dataset.previousKeyType = "number";
        } else {
            if (displayedNum.length < 8) {
                display.textContent += key;
            }
        }
        Array.from(calculator.children).forEach(group => {
            Array.from(group.children).forEach(button => {
                button.classList.remove("pressed");
            });
        });
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
            
            const button = document.querySelector(`[data-action=${operations[key]}]`);
            button.classList.add("pressed");
            calculator.dataset.previousKeyType = "operator";
            calculator.dataset.firstValue = displayedNum;
            calculator.dataset.operator = operations[key];
    } else if (key === ".") {
        if (!displayedNum.includes(".")) {
            display.textContent += key;
        }
        calculator.dataset.previousKeyType = "decimal";
    } else if (key === "Delete") {
        clear(e);
    } else if (key === "Enter") {
        const firstValue = calculator.dataset.firstValue;
        const secondValue = displayedNum;
        const operator = calculator.dataset.operator;
        const value = operate(operator, firstValue, secondValue);

        if (operator === "divide" && secondValue == 0) {
            display.textContent = "ERROR";
        } else {
            if (value.toString().length > 8) {
                display.textContent = "overflow";
            } else {
                display.textContent = parseFloat((value).toFixed(5));
            }
        }

        calculator.dataset.previousKeyType = "operator";
    } else if (key === "Backspace") {
        display.textContent = displayedNum.slice(0, -1);
    }
});