const inputText = document.getElementById("word-input");
const inputBtn = document.getElementById("input-button");
const resultBox = document.getElementById("result");

const elementsData = [];

fetch("assets/PeriodicTableJSON.json")
  .then((response) => response.json())
  .then((data) => {
    const elements = data.elements || [];
    elements.forEach((element) => {
      elementsData.push({
        symbol: element.symbol,
        name: element.name,
        number: element.number,
        atomicMass: element.atomic_mass,
      });
    });
  })
  .catch((error) => {
    console.error("Error loading data:", error);
    resultBox.innerHTML =
      "<p>Failed to load element data. Please try again later.</p>";
  });

function spellIt() {
  resultBox.innerHTML = "";
  const inputWord = inputText.value.trim();

  if (!inputWord) {
    resultBox.innerHTML = "<p>Please enter a word to spell</p>";
    return;
  }

  const foundElements = findElementsForWord(inputWord.toLowerCase());

  if (foundElements.some((item) => item.type === "text")) {
    resultBox.innerHTML =
      "<p>Could not spell the entire word with elements</p>";
    displayElements(foundElements);
  } else if (foundElements.length === 0) {
    resultBox.innerHTML = "<p>No matching elements found</p>";
  } else {
    displayElements(foundElements);
  }
}

function findElementsForWord(word) {
  const found = [];
  let remainingWord = word;

  while (remainingWord.length > 0) {
    if (remainingWord[0] === " ") {
      found.push({ type: "space" });
      remainingWord = remainingWord.substring(1);
      continue;
    }

    let foundElement = null;
    const maxSymbolLength = 2;

    for (let len = maxSymbolLength; len > 0; len--) {
      if (remainingWord.length >= len) {
        const symbolPart = remainingWord.substring(0, len);
        const element = elementsData.find(
          (e) => e.symbol.toLowerCase() === symbolPart
        );
        if (element) {
          foundElement = element;
          remainingWord = remainingWord.substring(len);
          break;
        }
      }
    }

    if (foundElement) {
      found.push(foundElement);
    } else {
      found.push({
        type: "text",
        character: remainingWord[0],
        symbol: remainingWord[0].toUpperCase(),
      });
      remainingWord = remainingWord.substring(1);
    }
  }
  return found;
}

function displayElements(elements) {
  elements.forEach((item) => {
    const elementBox = document.createElement("div");

    if (item.type === "space") {
      elementBox.className = "element-box space";
      elementBox.innerHTML = "&nbsp;";
    } else if (item.type === "text") {
      elementBox.className = "element-box text";
      elementBox.innerHTML = `<span class="element-sign">${item.symbol}</span>`;
    } else {
      elementBox.className = "element-box";
      elementBox.innerHTML = `
        <span class="atomic-number">${item.number}</span>
        <span class="element-sign">${item.symbol}</span>
        <span class="element-name">${item.name}</span>
        <span class="atomic-weight">${item.atomicMass?.toFixed(3) || ""}</span>
      `;
    }

    resultBox.appendChild(elementBox);
  });
}

inputBtn.addEventListener("click", spellIt);
inputText.addEventListener("keypress", (e) => {
  if (e.key === "Enter") spellIt();
});
