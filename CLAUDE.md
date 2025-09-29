# QCM Java 21 - Documentation Claude

## 📋 Vue d'ensemble du projet

Application web de QCM (Questionnaires à Choix Multiples) pour la préparation à la certification Java 21.

### Structure du projet
```
qcm-java/
├── index.html              # Page d'accueil avec sélection d'examens
├── exam.html               # Interface d'examen/entraînement
├── script.js               # Logique principale de l'application
├── style.css               # Styles CSS complets
├── progressManager.js      # Gestion de la progression et LocalStorage
├── test_reset.html         # Page de test pour les fonctions de reset
└── data/                   # Fichiers JSON des examens
    ├── exam1.json          # Examen de test/développement
    ├── exam5.json          # Héritage/Polymorphisme - Examen 1
    ├── exam6.json          # Héritage/Polymorphisme - Examen 2
    ├── exam7.json          # Héritage/Polymorphisme - Examen 3
    ├── exam-12-heritage_and_co.json  # Héritage/Polymorphisme - Examen 4
    ├── exam8.json          # Collections/Streams - Examen 1
    ├── exam9.json          # Collections/Streams - Examen 2
    ├── exam10.json         # Collections/Streams - Examen 3
    └── exam11.json         # Collections/Streams - Examen 4 (spécial reduce)
```

## 🎯 Fonctionnalités principales

### 1. Système d'examens
- **Deux modes** : Examen (chronométré) et Entraînement (avec correction immédiate)
- **Navigation flexible** en mode examen (précédent/suivant)
- **Questions à choix unique et multiple**
- **Coloration syntaxique** du code Java (Prism.js)
- **Timer automatique** en mode examen

### 2. Système de progression (LocalStorage)
- **Suivi automatique** des scores et performances
- **Statistiques globales** : examens réussis, score moyen, temps d'étude, meilleur score
- **Badges de statut** : Nouveau ⚪, En cours 🟡, À revoir 🔄, Réussi ✅
- **Moyenne et meilleur score** affichés par examen
- **Fonctions de reset** : global et par examen individuel

### 3. Interface utilisateur
- **Design responsive** (mobile + desktop)
- **Organisation par catégories** : Développement/Test, Héritage & Polymorphisme, Collections & Streams
- **Indicateur visuel** des questions (points numérotés en mode examen)
- **Page de révision** complète avec formatage du code

## 🛠 Commandes de développement

### Tests et débogage
- Ouvrir `test_reset.html` pour tester les fonctions de progression
- Console développeur : `progressManager.getGlobalStats()` pour voir les stats
- Console développeur : `progressManager.resetAllProgress()` pour reset complet

### Structure JSON des examens
```json
{
  "title": "Nom de l'examen",
  "duration": 60,  // durée en minutes
  "questions": [
    {
      "topic": "Nom du sujet",
      "question": "Énoncé de la question avec <pre><code>code</code></pre>",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": 0,  // ou [0, 2] pour choix multiples
      "type": "multiple",  // optionnel, pour questions à choix multiples
      "explanation": "Explication de la réponse"
    }
  ]
}
```

## 🎨 Architecture CSS

### Classes principales
- `.exam-card.compact` : Cartes d'examens sur la page d'accueil
- `.question-indicator` : Barre de points de navigation des questions
- `.question-dot` : Points individuels (`.current`, `.answered`, `.unanswered`)
- `.navigation-buttons` : Container pour boutons Précédent/Suivant
- `.review-question` : Style pour la page de révision
- `.option-review` : Options dans la page de révision (`.correct`, `.incorrect`, `.neutral`)

### Variables importantes
- Code formatting : Utilise Consolas/Monaco pour le code
- Couleurs principales : Bleu #3b82f6, Vert #10b981, Rouge #ef4444
- Responsive breakpoint : 768px

## 📊 Système de progression

### LocalStorage structure
```javascript
{
  "userProgress": {
    "exam1.json": {
      "attempts": 3,
      "bestScore": 18,
      "bestPercentage": 90,
      "averagePercentage": 75,
      "status": "passed",  // new, in-progress, needs-review, passed
      "allScores": [
        { "score": 16, "percentage": 80, "date": "2024-01-01", "timeSpent": 300 }
      ]
    }
  },
  "globalStats": {
    "totalExamsCompleted": 5,
    "averageScore": 78,
    "bestScore": 95,
    "totalStudyTime": 7200
  }
}
```

### Statuts des examens
- ⚪ `new` : Jamais tenté
- 🟡 `in-progress` : <80% première tentative
- 🔄 `needs-review` : <80% après 2+ tentatives
- ✅ `passed` : ≥80%

## 🔧 Fonctions JavaScript importantes

### Navigation (script.js)
- `nextQuestion()` / `prevQuestion()` : Navigation entre questions
- `saveCurrentAnswer()` : Sauvegarde automatique des réponses
- `loadSavedAnswer()` : Restauration des réponses lors du retour
- `updateQuestionIndicator()` : Mise à jour des points de progression

### Progression (progressManager.js)
- `saveExamResult(examId, score, total, timeSpent, mode)` : Sauvegarde résultat
- `getExamBadgeInfo(examId)` : Retourne badge et infos d'un examen
- `resetExamProgress(examId)` : Reset stats d'un examen
- `resetAllProgress()` : Reset complet

### Révision (script.js)
- `showReview()` : Génère la page de révision avec formatage du code
- `checkAnswerImmediate()` : Correction immédiate en mode entraînement

## 🚀 Points d'extension possibles

1. **Nouvelles fonctionnalités**
   - Export/import des données de progression
   - Graphiques de progression détaillés
   - Mode révision intelligente (questions ratées uniquement)
   - Système de bookmarks pour questions difficiles

2. **Optimisations techniques**
   - Service Worker pour mode hors-ligne
   - Compression des données JSON
   - Lazy loading des examens
   - Cache des résultats Prism.js

3. **UX améliorations**
   - Raccourcis clavier (1-4 pour sélection, Espace pour suivant)
   - Animations de transition entre questions
   - Son de notification fin d'examen
   - Mode sombre

## 🐛 Points d'attention

- **Prism.js** doit être appelé après insertion dynamique de HTML (`Prism.highlightAll()`)
- **LocalStorage** : Vérifier la disponibilité avant utilisation
- **Questions multiples** : Bien distinguer `Array.isArray(answer)` vs `type === "multiple"`
- **Responsive** : Tailles de police du code adaptées mobile/desktop
- **Navigation** : Sauvegarde automatique avant changement de question en mode examen

## 📱 Support navigateurs

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile : iOS 14+, Android Chrome 88+

## 🔄 Workflow de développement recommandé

1. **Nouveaux examens** : Ajouter JSON dans `/data/` + mapping dans `index.html`
2. **Nouvelles fonctionnalités** : Tester d'abord avec `test_reset.html`
3. **Styles** : Utiliser les classes existantes, éviter les styles inline
4. **Debug** : Console + LocalStorage viewer du navigateur