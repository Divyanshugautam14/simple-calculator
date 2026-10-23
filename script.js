const display = document.getElementById("display");
const expression = document.getElementById("expression");
let current = "0";
let stored = "";
let operator = "";
let shouldReset = false;

function render() {
  display.textContent = current;
  expression.textContent = stored && operator ? `${stored} ${operator} ${shouldReset ? "" : current}` : "";
}
function inputNumber(value) {
  if (shouldReset) { current = value === "." ? "0." : value; shouldReset = false; }
  else if (value === "." && current.includes(".")) return;
  else if (current === "0" && value !== ".") current = value;
  else current += value;
  render();
}
function chooseOperator(value) {
  if (value === "%") {
    current = String(Number(current) / 100);
    render();
    return;
  }
  if (operator && !shouldReset) calculate();
  stored = current;
  operator = value;
  shouldReset = true;
  render();
}
function calculate() {
  if (!operator || !stored) return;
  const a = Number(stored), b = Number(current);
  let result;
  if (operator === "+") result = a + b;
  if (operator === "-") result = a - b;
  if (operator === "*") result = a * b;
  if (operator === "/") result = b === 0 ? "Cannot divide by zero" : a / b;
  if (typeof result === "number") {
    result = Number.isFinite(result) ? String(Number(result.toPrecision(10))) : "Error";
  }
  expression.textContent = `${stored} ${operator} ${current} =`;
  current = String(result);
  stored = "";
  operator = "";
  shouldReset = true;
  render();
}
function clearAll() { current = "0"; stored = ""; operator = ""; shouldReset = false; render(); }
function deleteLast() {
  if (shouldReset) { current = "0"; shouldReset = false; }
  else current = current.length > 1 ? current.slice(0, -1) : "0";
  render();
}
document.querySelector(".keys").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.value !== undefined) {
    const value = button.dataset.value;
    if ("0123456789.".includes(value) && value.length === 1) inputNumber(value);
    else chooseOperator(value);
  }
  if (button.dataset.action === "clear") clearAll();
  if (button.dataset.action === "delete") deleteLast();
  if (button.dataset.action === "equals") calculate();
});
document.addEventListener("keydown", event => {
  if (/^[0-9.]$/.test(event.key)) inputNumber(event.key);
  else if (["+", "-", "*", "/"].includes(event.key)) chooseOperator(event.key);
  else if (event.key === "%") chooseOperator("%");
  else if (event.key === "Enter" || event.key === "=") { event.preventDefault(); calculate(); }
  else if (event.key === "Backspace") deleteLast();
  else if (event.key === "Escape") clearAll();
});
