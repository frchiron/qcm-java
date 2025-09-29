# QCM Java 21 - Documentation Claude

## 📋 Vue d'ensemble du projet

Application web de QCM (Questionnaires à Choix Multiples) pour la préparation à la certification Java 21 avec **système de chargement dynamique** des examens.

### Structure du projet
```
qcm-java/
├── README.md               # Documentation utilisateur
├── index.html              # Page d'accueil (génération dynamique)
├── exam.html               # Interface d'examen/entraînement
├── assets/
│   ├── css/
│   │   └── style.css       # Styles CSS complets
│   ├── js/
│   │   ├── script.js       # Logique principale de l'application
│   │   ├── progressManager.js  # Gestion de la progression et LocalStorage
│   │   └── examLoader.js   # 🆕 Système de chargement dynamique
│   ├── data/               # Fichiers JSON des examens (auto-détection)
│   │   ├── exam1.json      # Test/développement
│   │   ├── exam5-7.json    # Héritage/Polymorphisme - Examens 1-3
│   │   ├── exam-12*.json   # Héritage/Polymorphisme - Examens 4-5
│   │   ├── exam8-11.json   # Collections/Streams - Examens 1-4
│   │   ├── exam-14*.json   # Collections/Streams - Examen 5
│   │   └── ...             # Nouveaux examens (ajout automatique)
│   └── favicon.svg         # 🆕 Logo Java pour navigateur
├── docs/
│   └── CLAUDE.md           # Documentation technique (ce fichier)
└── tests/
    └── test_reset.html     # Page de test pour les fonctions de reset
```

## 🎯 Fonctionnalités principales

### 1. 🆕 Système de chargement dynamique (examLoader.js)
- **Auto-détection** des fichiers JSON dans `assets/data/`
- **Génération automatique** des cartes d'examen sur index.html
- **Catégorisation intelligente** par sujet (dev/heritage/collections)
- **Tri automatique** par numéro d'examen (DEV, H1-H5, C1-C5)
- **Compatibilité** avec le système de progression existant

### 2. Système d'examens
- **Deux modes** : Examen (chronométré) et Entraînement (avec correction immédiate)
- **Navigation flexible** en mode examen (précédent/suivant)
- **Questions à choix unique et multiple**
- **Coloration syntaxique** du code Java (Prism.js)
- **Timer automatique** en mode examen

### 3. Système de progression (LocalStorage)
- **Suivi automatique** des scores et performances
- **Statistiques globales** : examens réussis, score moyen, temps d'étude, meilleur score
- **Badges de statut** : Nouveau ⚪, En cours 🟡, À revoir 🔄, Réussi ✅
- **Moyenne et meilleur score** affichés par examen
- **Fonctions de reset** : global et par examen individuel

### 4. Interface utilisateur
- **Design responsive** (mobile + desktop)
- **Organisation par catégories** : Développement/Test, Héritage & Polymorphisme, Collections & Streams
- **Indicateur visuel** des questions (points numérotés en mode examen)
- **Page de révision** complète avec formatage du code
- **🆕 Logo Java** : Favicon personnalisé

## 🛠 Commandes de développement

### Tests et débogage
- Ouvrir `tests/test_reset.html` pour tester les fonctions de progression
- Console développeur : `progressManager.getGlobalStats()` pour voir les stats
- Console développeur : `progressManager.resetAllProgress()` pour reset complet

### 🆕 Structure JSON des examens (avec metadata)
```json
{
  "metadata": {
    "id": "exam-nouveau.json",              // nom du fichier
    "mainTopic": "Collections & Streams",   // sujet principal
    "category": "collections",              // catégorie technique (dev/heritage/collections)
    "examNumber": "C6",                     // identifiant d'affichage
    "examName": "Examen blanc 9",           // nom affiché
    "questionsCount": 20,                   // nombre de questions
    "description": "20 questions • Sujet spécial"  // description optionnelle
  },
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

### Catégories disponibles
- `dev` : Développement & Test (icône 🛠️)
- `heritage` : Héritage/Polymorphisme/Encapsulation/Overriding (icône 🏗️)
- `collections` : Collections & Streams (icône 📊)

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

### 🆕 Chargement dynamique (assets/js/examLoader.js)
- `ExamLoader.discoverExams()` : Auto-détection des fichiers JSON
- `ExamLoader.getExamsByCategory()` : Groupement et tri par catégorie
- `ExamLoader.generateExamCardHTML()` : Génération HTML des cartes
- `ExamLoader.generateCategoryHTML()` : Génération HTML des sections
- `ExamLoader.generateExamMappings()` : Mappings pour progressManager
- `ExamLoader.init()` : Initialisation complète du système

### Navigation (assets/js/script.js)
- `nextQuestion()` / `prevQuestion()` : Navigation entre questions
- `saveCurrentAnswer()` : Sauvegarde automatique des réponses
- `loadSavedAnswer()` : Restauration des réponses lors du retour
- `updateQuestionIndicator()` : Mise à jour des points de progression

### Progression (assets/js/progressManager.js)
- `saveExamResult(examId, score, total, timeSpent, mode)` : Sauvegarde résultat
- `getExamBadgeInfo(examId)` : Retourne badge et infos d'un examen
- `resetExamProgress(examId)` : Reset stats d'un examen
- `resetAllProgress()` : Reset complet

### Révision (assets/js/script.js)
- `showReview()` : Génère la page de révision avec formatage du code
- `checkAnswerImmediate()` : Correction immédiate en mode entraînement

## 🆕 Comment ajouter un nouvel examen

**Plus besoin de modifier index.html !** Le système de chargement dynamique détecte automatiquement les nouveaux examens.

### Étapes simples :
1. **Créer le fichier JSON** dans `assets/data/` avec le bon format (voir structure ci-dessus)
2. **Respecter la nomenclature** : `exam-[nom].json` ou `exam[N].json`
3. **Inclure les metadata complètes** avec les champs requis
4. **Actualiser la page** : l'examen apparaît automatiquement !

### Exemple complet :
```json
{
  "metadata": {
    "id": "exam-15-async.json",
    "mainTopic": "Collections & Streams",
    "category": "collections",
    "examNumber": "C6",
    "examName": "Async & CompletableFuture",
    "questionsCount": 15,
    "description": "15 questions • Programmation asynchrone"
  },
  "title": "Java 21 - Programmation Asynchrone",
  "duration": 40,
  "questions": [
    // vos questions ici
  ]
}
```

## 🚀 Points d'extension possibles

1. **🆕 Améliorations du système dynamique**
   - API REST pour listage des fichiers (remplacement de la liste hardcodée)
   - Validation automatique des metadata
   - Support d'autres formats (YAML, XML)
   - Import/export bulk des examens

2. **Nouvelles fonctionnalités**
   - Export/import des données de progression
   - Graphiques de progression détaillés
   - Mode révision intelligente (questions ratées uniquement)
   - Système de bookmarks pour questions difficiles

3. **Optimisations techniques**
   - Service Worker pour mode hors-ligne
   - Compression des données JSON
   - Lazy loading des examens
   - Cache des résultats Prism.js

4. **UX améliorations**
   - Raccourcis clavier (1-4 pour sélection, Espace pour suivant)
   - Animations de transition entre questions
   - Son de notification fin d'examen
   - Mode sombre

## 🐛 Points d'attention

- **🆕 ExamLoader** : Liste hardcodée des fichiers possibles dans `discoverExams()` - à maintenir
- **🆕 Metadata obligatoires** : Examens sans metadata sont ignorés silencieusement
- **🆕 Compatibilité** : examMappings généré dynamiquement, ne plus le modifier manuellement
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

1. **🆕 Nouveaux examens** :
   - Créer JSON avec metadata dans `assets/data/`
   - Ajouter le nom du fichier à la liste dans `examLoader.js` si nécessaire
   - Tester le chargement automatique

2. **Nouvelles fonctionnalités** : Tester d'abord avec `tests/test_reset.html`
3. **Styles** : Utiliser les classes existantes, éviter les styles inline
4. **Debug** :
   - Console + LocalStorage viewer du navigateur
   - `examLoader.examFiles` pour voir les examens chargés
   - `examLoader.examsData` pour voir les données complètes