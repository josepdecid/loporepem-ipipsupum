const vowels = "aeiouáéíóúAEIOUÁÉÍÓÚüÜ";

const seeds = [
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
  "vivamus placerat sapien sed justo volutpat quis faucibus mauris facilisis",
  "curabitur blandit arcu non mi fringilla at tincidunt leo gravida",
  "maecenas pulvinar orci nec massa fermentum nec vehicula est interdum",
  "integer posuere nisi vel augue aliquet a feugiat erat congue",
  "pellentesque habitant morbi tristique senectus et netus et malesuada",
  "praesent finibus tortor in lectus cursus non commodo urna fermentum",
  "quisque ullamcorper ligula quis magna volutpat in convallis justo viverra",
  "suspendisse potenti donec eleifend diam sit amet mi placerat dapibus",
  "nam sagittis libero non eros suscipit id viverra arcu commodo"
];

const paragraphCountInput = document.querySelector("#paragraphCount");
const generateBtn = document.querySelector("#generateBtn");
const translateBtn = document.querySelector("#translateBtn");
const copyBtn = document.querySelector("#copyBtn");
const copyFeedback = document.querySelector("#copyFeedback");
const output = document.querySelector("#output");
const sourceText = document.querySelector("#sourceText");
const tabButtons = document.querySelectorAll(".tab-button");
const modePanels = document.querySelectorAll(".mode-panel");

let activeMode = "lorem";
let copyFeedbackTimeout;

function isVowel(char) {
  return vowels.includes(char);
}

function transformWord(word) {
  let result = "";

  for (let index = 0; index < word.length; index += 1) {
    const char = word[index];
    const lowerChar = char.toLowerCase();
    const nextChar = word[index + 1];
    const lowerNextChar = nextChar?.toLowerCase();

    result += char;

    if (
      lowerChar === "u" &&
      index > 0 &&
      word[index - 1].toLowerCase() === "q" &&
      (lowerNextChar === "e" || lowerNextChar === "i")
    ) {
      continue;
    }

    if (isVowel(char)) {
      result += `p${lowerChar}`;
    }
  }

  return result;
}

function jerigonza(text) {
  return text.replace(/[A-Za-zÁÉÍÓÚáéíóúÜüÑñ]+/g, transformWord);
}

function sentenceCase(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function resizeOutput() {
  output.style.height = "auto";
  output.style.height = `${output.scrollHeight}px`;
}

function resizeTextarea(textarea) {
  if (!textarea) {
    return;
  }

  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

function showCopyFeedback(message) {
  clearTimeout(copyFeedbackTimeout);
  copyFeedback.textContent = message;
  copyFeedback.classList.add("is-visible");

  copyFeedbackTimeout = window.setTimeout(() => {
    copyFeedback.textContent = "";
    copyFeedback.classList.remove("is-visible");
  }, 1500);
}

function buildParagraph(index) {
  const parts = [];

  if (index === 0) {
    parts.push(seeds[0]);
  }

  while (parts.join(" ").split(" ").length < 48) {
    const seed = seeds[(index + parts.length) % seeds.length];
    parts.push(seed);
  }

  const base = `${parts.join(" ")}.`
    .replace(/\s+/g, " ")
    .replace(/\s\./g, ".")
    .trim();

  return sentenceCase(jerigonza(base));
}

function generateLorem() {
  const count = Math.max(1, Math.min(12, Number(paragraphCountInput.value) || 1));
  const paragraphs = Array.from({ length: count }, (_, index) => buildParagraph(index));
  output.value = paragraphs.join("\n\n");
  resizeOutput();
}

async function copyOutput() {
  if (!output.value.trim()) {
    showCopyFeedback("Nothing to copy");
    return;
  }

  try {
    await navigator.clipboard.writeText(output.value);
    showCopyFeedback("Copied!");
  } catch {
    output.select();
    document.execCommand("copy");
    showCopyFeedback("Copied!");
  }
}

function setMode(mode) {
  activeMode = mode;

  tabButtons.forEach((button) => {
    const isActive = button.dataset.mode === mode;
    button.classList.toggle("is-active", isActive);
  });

  modePanels.forEach((panel) => {
    const isActive = panel.dataset.modePanel === mode;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

function translateText() {
  output.value = jerigonza(sourceText.value.trim());
  resizeOutput();
}

generateBtn.addEventListener("click", generateLorem);
translateBtn.addEventListener("click", translateText);
copyBtn.addEventListener("click", copyOutput);
sourceText.addEventListener("input", () => resizeTextarea(sourceText));
tabButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

generateLorem();
resizeTextarea(sourceText);
setMode(activeMode);
