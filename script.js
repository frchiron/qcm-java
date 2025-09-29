let examData;
let currentQuestion = 0;
let score = 0;
let timer;
let mode = "exam"; // exam ou train

async function loadExam() {
    const urlParams = new URLSearchParams(window.location.search);
    const examFile = urlParams.get("exam") || "exam1.json";
    mode = urlParams.get("mode") || "exam";

    const res = await fetch(`data/${examFile}`);
    examData = await res.json();

    document.getElementById("exam-title").textContent = examData.title;

    if (mode === "exam") startTimer(examData.duration);

    // Masquer le bouton par défaut en mode entraînement
    if (mode === "train") {
        document.getElementById("next-btn").style.display = "none";
    }

    showQuestion();
}

function startTimer(minutes) {
    let seconds = minutes * 60;
    timer = setInterval(() => {
        let min = Math.floor(seconds / 60);
        let sec = seconds % 60;
        document.getElementById("timer").textContent =
            `⏱ ${min}:${sec < 10 ? '0' : ''}${sec}`;
        if (seconds-- <= 0) {
            clearInterval(timer);
            endExam();
        }
    }, 1000);
}

function showQuestion() {
    const q = examData.questions[currentQuestion];
    let container = document.getElementById("question-container");
    const isMultiple = q.type === "multiple" || Array.isArray(q.answer);

    document.getElementById("progress").textContent =
        `Question ${currentQuestion + 1} / ${examData.questions.length}`;

    container.innerHTML = `
    <p class="topic">Topic : <strong>${q.topic}</strong></p>
    <h3>${q.question}</h3>
    ${isMultiple ? '<p style="color: #666; font-style: italic; margin-bottom: 10px;">📝 Plusieurs réponses possibles</p>' : ''}
    ${q.options.map((opt, i) => `
      <div class="option ${isMultiple ? 'multiple' : ''}" data-index="${i}">${opt}</div>
    `).join("")}
    ${mode === "train" ? '<button id="check-btn" class="btn">Valider</button>' : ""}
  `;

    Prism.highlightAll();

    document.querySelectorAll(".option").forEach(opt => {
        opt.addEventListener("click", () => {
            if (isMultiple) {
                opt.classList.toggle("selected");
            } else {
                document.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
                opt.classList.add("selected");
            }
        });
    });

    if (mode === "train") {
        document.getElementById("check-btn").addEventListener("click", checkAnswerImmediate);
    }
}

function checkAnswerImmediate() {
    const q = examData.questions[currentQuestion];
    const isMultiple = q.type === "multiple" || Array.isArray(q.answer);
    const selectedOptions = document.querySelectorAll(".option.selected");

    if (selectedOptions.length === 0) return;

    let isCorrect = false;

    if (isMultiple) {
        const userAnswers = Array.from(selectedOptions).map(opt => parseInt(opt.dataset.index));
        const correctAnswers = Array.isArray(q.answer) ? q.answer : [q.answer];

        // Vérifier si les réponses correspondent exactement
        isCorrect = userAnswers.length === correctAnswers.length &&
                   userAnswers.every(ans => correctAnswers.includes(ans));

        // Marquer toutes les options
        document.querySelectorAll(".option").forEach(opt => {
            const index = parseInt(opt.dataset.index);
            if (correctAnswers.includes(index)) {
                opt.classList.add("correct");
            } else if (userAnswers.includes(index)) {
                opt.classList.add("incorrect");
            }
        });
    } else {
        const chosen = parseInt(selectedOptions[0].dataset.index);
        const correctAnswer = Array.isArray(q.answer) ? q.answer[0] : q.answer;

        isCorrect = chosen === correctAnswer;

        if (isCorrect) {
            selectedOptions[0].classList.add("correct");
        } else {
            selectedOptions[0].classList.add("incorrect");
            document.querySelector(`.option[data-index="${correctAnswer}"]`)
                .classList.add("correct");
        }
    }

    if (isCorrect) score++;

    // explication
    if (q.explanation) {
        document.getElementById("question-container").innerHTML +=
            `<p style="margin-top:10px;color:#555"><strong>Explication :</strong> ${q.explanation}</p>`;
    }

    document.getElementById("check-btn").style.display = "none";

    // bouton suivant
    document.getElementById("question-container").innerHTML +=
        `<button id="next-train-btn" class="btn">Question suivante</button>`;

    document.getElementById("next-train-btn").addEventListener("click", () => {
        currentQuestion++;
        if (currentQuestion < examData.questions.length) {
            showQuestion();
        } else {
            endExam();
        }
    });
}

document.getElementById("next-btn").addEventListener("click", () => {
    if (mode === "train") return;

    const q = examData.questions[currentQuestion];
    const isMultiple = q.type === "multiple" || Array.isArray(q.answer);
    const selectedOptions = document.querySelectorAll(".option.selected");

    if (selectedOptions.length > 0) {
        if (isMultiple) {
            const userAnswers = Array.from(selectedOptions).map(opt => parseInt(opt.dataset.index));
            const correctAnswers = Array.isArray(q.answer) ? q.answer : [q.answer];

            const isCorrect = userAnswers.length === correctAnswers.length &&
                             userAnswers.every(ans => correctAnswers.includes(ans));
            if (isCorrect) score++;
        } else {
            const chosen = parseInt(selectedOptions[0].dataset.index);
            const correctAnswer = Array.isArray(q.answer) ? q.answer[0] : q.answer;
            if (chosen === correctAnswer) score++;
        }
    }

    currentQuestion++;
    if (currentQuestion < examData.questions.length) {
        showQuestion();
    } else {
        endExam();
    }
});

function endExam() {
    clearInterval(timer);

    const total = examData.questions.length;
    const percent = Math.round((score / total) * 100);

    let cssClass = "success";
    if (percent < 50) cssClass = "danger";
    else if (percent < 75) cssClass = "warning";

    document.querySelector("main").innerHTML = `
    <div class="card result ${cssClass}">
      <h2>Examen terminé ✅</h2>
      <p>Score : <strong>${score}</strong> / ${total}</p>
      <p>Résultat : <strong>${percent}%</strong></p>
      <div style="margin-top: 20px;">
        <a href="index.html" class="btn">Retour à l'accueil</a>
      </div>
    </div>
  `;

    document.getElementById("next-btn").style.display = "none";
}



loadExam();
