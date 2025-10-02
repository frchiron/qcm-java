let examData;
let currentQuestion = 0;
let score = 0;
let timer;
let mode = "exam"; // exam ou train
let userAnswers = []; // Stocker les réponses de l'utilisateur
let startTime; // Pour calculer le temps passé
let currentExamId; // ID de l'examen en cours

// Fonction pour échapper les caractères HTML dans tous les blocs de code
function fixJavaCodeBlocks(text) {
    if (!text) return text;

    // Échapper d'abord les blocs <code class='language-java'>
    let result = text.replace(/<code class=['"]language-java['"]>(.*?)<\/code>/gs, (match, codeContent) => {
        const escapedContent = codeContent
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        return `<code class='language-java'>${escapedContent}</code>`;
    });

    // Échapper ensuite les balises < et > dans les balises <code> simples (pour les génériques Java)
    result = result.replace(/<code>(.*?)<\/code>/gs, (match, codeContent) => {
        const escapedContent = codeContent
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        return `<code>${escapedContent}</code>`;
    });

    return result;
}

async function loadExam() {
    const urlParams = new URLSearchParams(window.location.search);
    const examFile = urlParams.get("exam") || "exam1.json";
    mode = urlParams.get("mode") || "exam";
    currentExamId = examFile; // Stocker l'ID de l'examen
    startTime = Date.now(); // Enregistrer l'heure de début

    const res = await fetch(`assets/data/${examFile}`);
    examData = await res.json();

    document.getElementById("exam-title").textContent = examData.title;

    if (mode === "exam") {
        startTimer(examData.duration);
        setupNavigationButtons();
    }

    // Masquer les boutons par défaut en mode entraînement
    if (mode === "train") {
        document.getElementById("next-btn").style.display = "none";
        document.getElementById("prev-btn").style.display = "none";
    }

    showQuestion();
    if (mode === "exam") {
        createQuestionIndicator();
    }
}

function createQuestionIndicator() {
    const indicator = document.getElementById("question-indicator");
    if (!indicator) return;

    indicator.innerHTML = '';
    for (let i = 0; i < examData.questions.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'question-dot';
        dot.setAttribute('data-question', i + 1);  // +1 pour afficher le bon numéro
        dot.title = `Question ${i + 1}`;

        // Permettre de cliquer sur le point pour aller à la question
        dot.addEventListener('click', () => {
            if (mode === "exam") {
                saveCurrentAnswer();
                currentQuestion = i;
                showQuestion();
            }
        });

        indicator.appendChild(dot);
    }
    updateQuestionIndicator();
}

function updateQuestionIndicator() {
    const dots = document.querySelectorAll('.question-dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('current', 'answered', 'unanswered');

        if (index === currentQuestion) {
            dot.classList.add('current');
        } else if (userAnswers[index] !== null && userAnswers[index] !== undefined) {
            dot.classList.add('answered');
        } else {
            dot.classList.add('unanswered');
        }
    });
}

function setupNavigationButtons() {
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            prevQuestion();
        });
    }

    if (nextBtn) {
        // L'event listener pour next-btn sera ajouté plus bas dans le script
        // On garde juste la configuration ici
    }
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

function saveCurrentAnswer() {
    const q = examData.questions[currentQuestion];
    const isMultiple = q.type === "multiple" || Array.isArray(q.answer);
    const selectedOptions = document.querySelectorAll(".option.selected");

    if (selectedOptions.length > 0) {
        if (isMultiple) {
            const userResponse = Array.from(selectedOptions).map(opt => parseInt(opt.dataset.index));
            userAnswers[currentQuestion] = userResponse;
        } else {
            const chosen = parseInt(selectedOptions[0].dataset.index);
            userAnswers[currentQuestion] = chosen;
        }
    } else {
        userAnswers[currentQuestion] = null; // Pas de réponse
    }
}

function loadSavedAnswer() {
    const savedAnswer = userAnswers[currentQuestion];
    if (savedAnswer !== null && savedAnswer !== undefined) {
        const q = examData.questions[currentQuestion];
        const isMultiple = q.type === "multiple" || Array.isArray(q.answer);

        if (isMultiple && Array.isArray(savedAnswer)) {
            savedAnswer.forEach(index => {
                const option = document.querySelector(`.option[data-index="${index}"]`);
                if (option) option.classList.add("selected");
            });
        } else if (!isMultiple && typeof savedAnswer === 'number') {
            const option = document.querySelector(`.option[data-index="${savedAnswer}"]`);
            if (option) option.classList.add("selected");
        }
    }
}

function showQuestion() {
    const q = examData.questions[currentQuestion];
    let container = document.getElementById("question-container");
    const isMultiple = q.type === "multiple" || Array.isArray(q.answer);

    document.getElementById("progress").textContent =
        `Question ${currentQuestion + 1} / ${examData.questions.length}`;

    container.innerHTML = `
    <p class="topic">Topic : <strong>${q.topic}</strong></p>
    <h3>${fixJavaCodeBlocks(q.question)}</h3>
    ${isMultiple ? '<p style="color: #666; font-style: italic; margin-bottom: 10px;">📝 Plusieurs réponses possibles</p>' : ''}
    ${q.options.map((opt, i) => `
      <div class="option ${isMultiple ? 'multiple' : ''}" data-index="${i}">${fixJavaCodeBlocks(opt)}</div>
    `).join("")}
    ${mode === "train" ? '<button id="check-btn" class="btn">Valider</button>' : ""}
  `;

    Prism.highlightAll();

    // Charger la réponse sauvegardée s'il y en a une
    loadSavedAnswer();

    document.querySelectorAll(".option").forEach(opt => {
        opt.addEventListener("click", () => {
            if (isMultiple) {
                opt.classList.toggle("selected");
            } else {
                document.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
                opt.classList.add("selected");
            }
            // Sauvegarder automatiquement la réponse en mode examen
            if (mode === "exam") {
                saveCurrentAnswer();
            }
        });
    });

    // Mettre à jour les boutons de navigation et l'indicateur
    updateNavigationButtons();
    if (mode === "exam") {
        updateQuestionIndicator();
    }

    if (mode === "train") {
        document.getElementById("check-btn").addEventListener("click", checkAnswerImmediate);
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    if (prevBtn) {
        prevBtn.disabled = currentQuestion === 0;
        prevBtn.style.opacity = currentQuestion === 0 ? "0.5" : "1";
    }

    if (nextBtn) {
        if (mode === "exam") {
            nextBtn.textContent = currentQuestion === examData.questions.length - 1 ? "Terminer l'examen" : "Question suivante";
        }
    }
}

function checkAnswerImmediate() {
    const q = examData.questions[currentQuestion];
    const isMultiple = q.type === "multiple" || Array.isArray(q.answer);
    const selectedOptions = document.querySelectorAll(".option.selected");

    if (selectedOptions.length === 0) return;

    let isCorrect = false;
    let userResponse = null;

    if (isMultiple) {
        userResponse = Array.from(selectedOptions).map(opt => parseInt(opt.dataset.index));
        const correctAnswers = Array.isArray(q.answer) ? q.answer : [q.answer];

        // Sauvegarder la réponse de l'utilisateur
        userAnswers[currentQuestion] = userResponse;

        // Vérifier si les réponses correspondent exactement
        isCorrect = userResponse.length === correctAnswers.length &&
                   userResponse.every(ans => correctAnswers.includes(ans));

        // Marquer toutes les options
        document.querySelectorAll(".option").forEach(opt => {
            const index = parseInt(opt.dataset.index);
            if (correctAnswers.includes(index)) {
                opt.classList.add("correct");
            } else if (userResponse.includes(index)) {
                opt.classList.add("incorrect");
            }
        });
    } else {
        userResponse = parseInt(selectedOptions[0].dataset.index);
        const correctAnswer = Array.isArray(q.answer) ? q.answer[0] : q.answer;

        // Sauvegarder la réponse de l'utilisateur
        userAnswers[currentQuestion] = userResponse;

        isCorrect = userResponse === correctAnswer;

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
            `<p style="margin-top:10px;color:#555"><strong>Explication :</strong> ${fixJavaCodeBlocks(q.explanation)}</p>`;
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

function calculateScore() {
    let newScore = 0;

    for (let i = 0; i < examData.questions.length; i++) {
        const q = examData.questions[i];
        const userResponse = userAnswers[i];

        if (userResponse !== null && userResponse !== undefined) {
            const isMultiple = q.type === "multiple" || Array.isArray(q.answer);
            const correctAnswers = Array.isArray(q.answer) ? q.answer : [q.answer];

            if (isMultiple) {
                const userArray = Array.isArray(userResponse) ? userResponse : [userResponse];
                const isCorrect = userArray.length === correctAnswers.length &&
                                userArray.every(ans => correctAnswers.includes(ans));
                if (isCorrect) newScore++;
            } else {
                if (correctAnswers.includes(userResponse)) newScore++;
            }
        }
    }

    score = newScore;
}

function nextQuestion() {
    if (mode === "exam") {
        saveCurrentAnswer();
    }

    if (currentQuestion < examData.questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        // C'est la dernière question, terminer l'examen
        if (mode === "exam") {
            calculateScore(); // Recalculer le score final
        }
        endExam();
    }
}

function prevQuestion() {
    if (mode === "exam") {
        saveCurrentAnswer();
    }

    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

document.getElementById("next-btn").addEventListener("click", () => {
    if (mode === "train") return;
    nextQuestion();
});

// Event listener pour next-btn maintenu pour compatibilité

function endExam() {
    clearInterval(timer);

    const total = examData.questions.length;
    const percent = Math.round((score / total) * 100);

    // Calculer le temps passé en secondes
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    // Sauvegarder la progression (seulement si progressManager est disponible)
    if (typeof progressManager !== 'undefined') {
        const examProgress = progressManager.saveExamResult(currentExamId, score, total, timeSpent, mode);
        console.log('Progression sauvegardée:', examProgress);
    }

    let cssClass = "success";
    if (percent < 67) cssClass = "danger";
    else if (percent <= 80) cssClass = "warning";

    const angle = (percent * 360) / 100;

    document.querySelector("main").innerHTML = `
    <div class="card result ${cssClass}">
      <h2>Examen terminé ✅</h2>
      <div class="pie-chart ${cssClass}" style="--success-angle: ${angle}deg;">
        ${percent}%
      </div>
      <p>Score : <strong>${score}</strong> / ${total}</p>
      <p>Résultat : <strong>${percent}%</strong></p>
      <p style="font-size: 0.9rem; color: #666;">Temps passé : <strong>${Math.round(timeSpent / 60)} min</strong></p>
      <div style="margin-top: 20px;">
        <button id="review-btn" class="btn btn-outline" style="margin-right: 10px;">Réviser mes réponses</button>
        <a href="index.html" class="btn">Retour à l'accueil</a>
      </div>
    </div>
  `;

    document.getElementById("next-btn").style.display = "none";

    // Ajouter l'event listener pour le bouton de révision
    document.getElementById("review-btn").addEventListener("click", showReview);
}

function showReview() {
    document.querySelector("main").innerHTML = `
        <div class="card">
            <h2>Révision de l'examen</h2>
            <div id="review-container"></div>
            <div style="margin-top: 20px; text-align: center;">
                <button id="export-pdf-btn" class="btn btn-outline" style="margin-right: 10px;">📄 Exporter en PDF</button>
                <a href="index.html" class="btn">Retour à l'accueil</a>
            </div>
        </div>
    `;

    const container = document.getElementById("review-container");
    let reviewHtml = "";

    examData.questions.forEach((q, index) => {
        const isMultiple = q.type === "multiple" || Array.isArray(q.answer);
        const correctAnswers = Array.isArray(q.answer) ? q.answer : [q.answer];
        const userResponse = userAnswers[index];

        let isCorrect = false;
        if (userResponse !== null && userResponse !== undefined) {
            if (isMultiple) {
                const userArray = Array.isArray(userResponse) ? userResponse : [userResponse];
                isCorrect = userArray.length === correctAnswers.length &&
                           userArray.every(ans => correctAnswers.includes(ans));
            } else {
                isCorrect = correctAnswers.includes(userResponse);
            }
        }

        reviewHtml += `
            <div class="review-question ${isCorrect ? 'correct-answer' : 'incorrect-answer'}" style="border: 2px solid ${isCorrect ? '#10b981' : '#ef4444'}; background: ${isCorrect ? '#f0fdf4' : '#fef2f2'};">
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <span style="font-size: 1.2em; margin-right: 10px;">${isCorrect ? '✅' : '❌'}</span>
                    <h4>Question ${index + 1} - ${q.topic}</h4>
                </div>
                <div class="question-content">${fixJavaCodeBlocks(q.question)}</div>

                <div style="margin: 15px 0;">
                    ${q.options.map((opt, i) => {
                        let optionClass = "";
                        let optionStyle = "";

                        if (correctAnswers.includes(i)) {
                            optionClass = "correct";
                            optionStyle = "background: #d1fae5; border: 1px solid #10b981; color: #065f46;";
                        }

                        if (userResponse !== null && userResponse !== undefined) {
                            const userSelected = isMultiple ?
                                (Array.isArray(userResponse) && userResponse.includes(i)) :
                                (userResponse === i);

                            if (userSelected && !correctAnswers.includes(i)) {
                                optionStyle = "background: #fee2e2; border: 1px solid #ef4444; color: #991b1b;";
                            }
                        }

                        const prefix = isMultiple ?
                            (correctAnswers.includes(i) ? '☑️' : '☐') :
                            (correctAnswers.includes(i) ? '🔘' : '⚪');

                        return `<div class="option-review" style="padding: 8px; margin: 5px 0; border-radius: 5px; ${optionStyle}">${prefix} ${fixJavaCodeBlocks(opt)}</div>`;
                    }).join("")}
                </div>

                <div style="margin-top: 15px;">
                    <p><strong>Votre réponse :</strong> ${
                        userResponse === null || userResponse === undefined ?
                        '<span style="color: #ef4444;">Aucune réponse</span>' :
                        isMultiple ?
                        `Options ${Array.isArray(userResponse) ? userResponse.map(i => i + 1).join(', ') : userResponse + 1}` :
                        `Option ${userResponse + 1}`
                    }</p>
                    <p><strong>Bonne(s) réponse(s) :</strong> Options ${correctAnswers.map(i => i + 1).join(', ')}</p>
                    ${q.explanation ? `<p style="margin-top: 10px; color: #555;"><strong>Explication :</strong> ${fixJavaCodeBlocks(q.explanation)}</p>` : ''}
                </div>
            </div>
        `;
    });

    container.innerHTML = reviewHtml;
    Prism.highlightAll();

    // Ajouter l'event listener pour le bouton d'export PDF
    document.getElementById("export-pdf-btn").addEventListener("click", exportToPDF);
}

function exportToPDF() {
    // Afficher un indicateur de chargement
    const exportBtn = document.getElementById("export-pdf-btn");
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = "⏳ Génération...";
    exportBtn.disabled = true;

    // Obtenir le titre de l'examen pour le nom du fichier
    const examTitle = examData.title || "Revision-Examen";
    const fileName = examTitle.replace(/[^a-zA-Z0-9]/g, '_') + '_revision.pdf';

    // Configuration pour html2pdf
    const opt = {
        margin: [15, 15, 15, 15], // marges en mm: top, right, bottom, left
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2, // Améliorer la qualité
            useCORS: true,
            letterRendering: true
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        }
    };

    // Créer un élément temporaire avec le contenu à exporter
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">${examData.title}</h1>
            <h2 style="color: #666; font-size: 18px;">Révision de l'examen</h2>
            <p style="color: #888; font-size: 14px;">Score obtenu: ${score}/${examData.questions.length} (${Math.round((score / examData.questions.length) * 100)}%)</p>
            <hr style="margin: 20px 0; border: 1px solid #ddd;">
        </div>
        ${document.getElementById("review-container").innerHTML}
    `;

    // Appliquer des styles pour l'impression PDF
    const style = document.createElement('style');
    style.textContent = `
        .review-question {
            page-break-inside: avoid;
            margin-bottom: 25px !important;
            border: 2px solid #ddd !important;
            border-radius: 8px !important;
            padding: 15px !important;
        }
        .option-review {
            margin: 8px 0 !important;
            padding: 8px !important;
            border-radius: 4px !important;
            border: 1px solid #ddd !important;
        }
        code {
            background: #f5f5f5 !important;
            padding: 2px 4px !important;
            border-radius: 3px !important;
            font-family: "Courier New", monospace !important;
            color: #333 !important;
        }
        pre {
            background: #f8f9fa !important;
            padding: 15px !important;
            border-radius: 6px !important;
            border: 1px solid #e9ecef !important;
            overflow-x: auto !important;
        }
    `;
    element.appendChild(style);

    // Générer le PDF
    html2pdf().from(element).set(opt).save().then(() => {
        // Restaurer le bouton
        exportBtn.innerHTML = originalText;
        exportBtn.disabled = false;
    }).catch((error) => {
        console.error('Erreur lors de la génération du PDF:', error);
        alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
        exportBtn.innerHTML = originalText;
        exportBtn.disabled = false;
    });
}



loadExam();
