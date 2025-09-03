let questions = [];
let filteredQuestions = [];

// Load questions from JSON file
async function loadQuestions() {
  try {
    const response = await fetch('questions.json');
    const data = await response.json();
    questions = data;
    filteredQuestions = questions;
    renderStats();
    renderQuestions();
  } catch (error) {
    console.error('Error loading questions:', error);
    // Fallback - show error message in the container
    document.getElementById("questionsContainer").innerHTML = 
      '<div class="no-questions">Chyba při načítání otázek. Zkuste obnovit stránku.</div>';
  }
}

function renderStats() {
  const total = questions.length;
  const cards = questions.filter((q) => q.category === "cards").length;
  const integrity = questions.filter(
    (q) => q.category === "integrity"
  ).length;
  const subsidiary = questions.filter(
    (q) => q.category === "subsidiary"
  ).length;

  document.getElementById("totalQuestions").textContent = total;
  document.getElementById("cardQuestions").textContent = cards;
  document.getElementById("integrityQuestions").textContent = integrity;
  document.getElementById("subsidiaryQuestions").textContent = subsidiary;
}

function renderQuestions() {
  const container = document.getElementById("questionsContainer");

  if (filteredQuestions.length === 0) {
    container.innerHTML =
      '<div class="no-questions">Žádné otázky nevyhovují zadaným filtrům.</div>';
    return;
  }

  container.innerHTML = filteredQuestions
    .map(
      (question) => `
            <div class="question-card">
                <div class="question-header">
                    <div class="question-meta">
                        <span class="tag">${getCategoryName(
                          question.category
                        )}</span>
                        <span class="difficulty ${
                          question.difficulty
                        }">${getDifficultyName(question.difficulty)}</span>
                    </div>
                </div>
                <div class="question-text">${question.question}</div>
                <div class="answer-section">
                    <button class="toggle-answer" onclick="toggleAnswer(${
                      question.id
                    })">
                        Zobrazit odpověď
                    </button>
                    <div class="answer" id="answer-${question.id}">
                        <strong>Odpověď:</strong><br>
                        ${question.answer}
                        <br><br>
                        <strong>Tagy:</strong> ${question.tags
                          .map(
                            (tag) =>
                              `<span class="tag" style="margin-right: 5px;">${tag}</span>`
                          )
                          .join("")}
                    </div>
                </div>
            </div>
        `
    )
    .join("");
}

function getCategoryName(category) {
  const names = {
    cards: "Platební karty",
    integrity: "Integrita plateb",
    subsidiary: "Dceřiné společnosti",
  };
  return names[category] || category;
}

function getDifficultyName(difficulty) {
  const names = {
    easy: "Snadné",
    medium: "Střední",
    hard: "Těžké",
  };
  return names[difficulty] || difficulty;
}

function toggleAnswer(questionId) {
  const answer = document.getElementById(`answer-${questionId}`);
  const button = answer.parentElement.querySelector(".toggle-answer");

  if (answer.classList.contains("show")) {
    answer.classList.remove("show");
    button.textContent = "Zobrazit odpověď";
  } else {
    answer.classList.add("show");
    button.textContent = "Skrýt odpověď";
  }
}

function applyFilters() {
  const categoryFilter = document.getElementById("categoryFilter").value;
  const difficultyFilter =
    document.getElementById("difficultyFilter").value;
  const searchFilter = document
    .getElementById("searchFilter")
    .value.toLowerCase();

  filteredQuestions = questions.filter((question) => {
    const categoryMatch =
      categoryFilter === "all" || question.category === categoryFilter;
    const difficultyMatch =
      difficultyFilter === "all" ||
      question.difficulty === difficultyFilter;
    const searchMatch =
      searchFilter === "" ||
      question.question.toLowerCase().includes(searchFilter) ||
      question.answer.toLowerCase().includes(searchFilter) ||
      question.tags.some((tag) =>
        tag.toLowerCase().includes(searchFilter)
      );

    return categoryMatch && difficultyMatch && searchMatch;
  });

  renderQuestions();
}

// Event listeners
document
  .getElementById("categoryFilter")
  .addEventListener("change", applyFilters);
document
  .getElementById("difficultyFilter")
  .addEventListener("change", applyFilters);
document
  .getElementById("searchFilter")
  .addEventListener("input", applyFilters);

// Initialize - load questions from JSON file
loadQuestions();