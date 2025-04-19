const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '';
let expression = '';
let isEvaluated = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');

        if (button.id === 'clear') {
            clearCalculator();
        } else if (button.id === 'backspace') {
            handleBackspace();
        } else if (button.id === 'equals') {
            calculateResult();
        } else {
            if (isEvaluated) {
                clearCalculator();
                isEvaluated = false;
            }
            handleInput(value, button.id);
        }
    });
});

function handleInput(value, id) {
    // Special Cases for Advanced Functions
    if (id === 'sqrt') {
        expression += `Math.sqrt(${currentInput})`;
        currentInput = '';
    } else if (id === 'log') {
        expression += `Math.log10(${currentInput})`;
        currentInput = '';
    } else if (id === 'ln') {
        expression += `Math.log(${currentInput})`;
        currentInput = '';
    } else if (id === 'factorial') {
        expression += factorial(parseInt(currentInput));
        currentInput = '';
    } else if (id === 'sin') {
        expression += `Math.sin(toRadians(${currentInput}))`;
        currentInput = '';
    } else if (id === 'cos') {
        expression += `Math.cos(toRadians(${currentInput}))`;
        currentInput = '';
    } else if (id === 'tan') {
        expression += `Math.tan(toRadians(${currentInput}))`;
        currentInput = '';
    } else if (id === 'sin-1') {
        expression += `toDegrees(Math.asin(${currentInput}))`;
        currentInput = '';
    } else if (id === 'cos-1') {
        expression += `toDegrees(Math.acos(${currentInput}))`;
        currentInput = '';
    } else if (id === 'tan-1') {
        expression += `toDegrees(Math.atan(${currentInput}))`;
        currentInput = '';
    } else if (value === 'π') {
        currentInput = Math.PI.toString();
    } else if (value === 'e') {
        currentInput = Math.E.toString();
    } else if (value === '^') {
        expression += `${currentInput}**`;
        currentInput = '';
    } else if (value === 'mod') {
        expression += `${currentInput}%`;
        currentInput = '';
    } else if (value === '10^') {
        expression += `10**(${currentInput})`;
        currentInput = '';
    } else {
        currentInput += value;
        expression += value;
    }
    updateDisplay();
}

function handleBackspace() {
    if (currentInput) {
        currentInput = currentInput.slice(0, -1);
    } else {
        expression = expression.slice(0, -1);
    }
    updateDisplay();
}

function calculateResult() {
    try {
        // Replace symbols with JavaScript syntax
        const sanitizedExpression = expression
            .replace(/÷/g, '÷')
            .replace(/×/g, '×')
            .replace(/π/g, Math.PI)
            .replace(/e/g, Math.E);

        const result = eval(sanitizedExpression);
        currentInput = result.toString();
        expression = currentInput;
        isEvaluated = true;
    } catch (error) {
        currentInput = 'Error';
        expression = '';
    }
    updateDisplay();
}

function clearCalculator() {
    currentInput = '';
    expression = '';
    updateDisplay();
}

function updateDisplay() {
    const maxLength = 15; // Limit the length of the display text
    let displayText = currentInput || expression || '0';

    // Truncate if too long
    if (displayText.length > maxLength) {
        displayText = displayText.substring(0, maxLength) + '...';
    }
    display.textContent = displayText;
}

/**
 * Helper functions for advanced operations
 */
function factorial(n) {
    if (n < 0) return 'Error';
    if (n === 0) return 1;
    return n * factorial(n - 1);
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
    return radians * (180 / Math.PI);
}
