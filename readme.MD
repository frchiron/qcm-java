# QCM Java 21

Application web de QCM (Questionnaires à Choix Multiples) pour la préparation à la certification Java 21 avec **système de chargement dynamique** des examens.

## 🚀 Démarrage rapide

1. Ouvrez `index.html` dans votre navigateur
2. Les examens se chargent automatiquement
3. Choisissez un examen et un mode (Examen ou Entraînement)
4. Commencez votre préparation !

## 📁 Structure du projet

```
qcm-java/
├── README.md               # Documentation utilisateur
├── index.html              # Page d'accueil (génération dynamique)
├── exam.html               # Interface d'examen
├── assets/
│   ├── css/
│   │   └── style.css       # Styles principaux
│   ├── js/
│   │   ├── script.js       # Logique principale
│   │   ├── progressManager.js  # Gestion progression
│   │   └── examLoader.js   # 🆕 Chargement dynamique
│   ├── data/               # Examens JSON (auto-détection)
│   │   ├── exam1.json      # Test/développement
│   │   ├── exam5-7.json    # Héritage & Polymorphisme
│   │   ├── exam8-11.json   # Collections & Streams
│   │   ├── exam-12*.json   # Examens avancés
│   │   └── ...             # Nouveaux examens
│   └── favicon.svg         # 🆕 Logo Java
├── docs/
│   └── CLAUDE.md          # Documentation technique
└── tests/
    └── test_reset.html    # Tests progression
```

## ✨ Fonctionnalités

- **🆕 Chargement automatique** : Nouveaux examens détectés automatiquement
- **Deux modes** : Examen chronométré et Entraînement avec correction
- **Navigation flexible** : Retour aux questions précédentes en mode examen
- **Suivi de progression** : Scores, moyennes et statistiques sauvegardées
- **Coloration syntaxique** : Code Java parfaitement formaté
- **Design responsive** : Interface adaptée mobile et desktop
- **🆕 Logo Java** : Favicon personnalisé

## 🎯 Examens disponibles

### 🛠️ Développement & Test
- 1 examen de test et développement

### 🏗️ Héritage & Polymorphisme
- 5 examens de 20 questions
- Sujets : Héritage, Polymorphisme, Encapsulation, Overriding, Sealed Classes

### 📊 Collections & Streams
- 5 examens de 20 questions
- Sujets : Collections, Arrays, Streams, Lambda, reduce(), Parallel Streams

## 🆕 Ajouter un nouvel examen

**Plus besoin de modifier index.html !** Créez simplement un nouveau fichier JSON dans `assets/data/` :

```json
{
  "metadata": {
    "id": "exam-nouveau.json",
    "mainTopic": "Collections & Streams",
    "category": "collections",
    "examNumber": "C6",
    "examName": "Examen blanc 9",
    "questionsCount": 20,
    "description": "20 questions • Nouveau sujet"
  },
  "title": "Titre de votre examen",
  "duration": 50,
  "questions": [ /* vos questions */ ]
}
```

**Catégories disponibles :**
- `dev` : Développement & Test
- `heritage` : Héritage/Polymorphisme
- `collections` : Collections & Streams

L'examen apparaîtra **automatiquement** sur la page d'accueil !

## 💾 Données de progression

Toutes vos statistiques sont sauvegardées localement dans votre navigateur :
- Scores et moyennes par examen
- Temps d'étude total
- Badges de progression
- Historique complet des tentatives

## 🔧 Pour les développeurs

Consultez `docs/CLAUDE.md` pour la documentation technique complète.

## 📱 Compatibilité

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile : iOS 14+, Android Chrome 88+