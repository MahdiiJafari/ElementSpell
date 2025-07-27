const ipnutText = document.getElementById("word-input");
const ipnutBtn = document.getElementById("input-button");
const resultBox = document.getElementById("result");

const symbols = [];
const elementData = [];

fetch("assets/PeriodicTableJSON.json")
  .then((response) => response.json())
  .then((data) => {
    const elements = data.elements || [];
    elements.forEach((element) => {
      const elementObject = {
        symbol: element.symbol,
        name: element.name,
        atomicNumber: element.number,
        atomicMass: element.atomic_mass,
      };
      elementData.push(elementObject);
      symbols.push(element.symbol);
    });
  })
  .catch((error) => console.error("Error loading data:", error));

console.log(symbols);
console.log(e);

function spellIt() {
  resultBox.innerHTML = "";

  const inputWord = inputText.value.toLowerCase().trim();

  if (!inputWord) {
    resultBox.innerHTML = "<p>Please enter a word</p>";
    return;
  }

  const foundElements = findElementsForWord(inputWord);
  if (foundElements.length === 0) {
    resultBox.innerHTML = "<p>Error</p>";
  } else {
    displayElements(foundElements);
  }
}


