# QCM Java 21

Application web de QCM (Questionnaires à Choix Multiples) pour la préparation à la certification Java 21.

## 🚀 Démarrage rapide

1. Ouvrez `index.html` dans votre navigateur
2. Choisissez un examen et un mode (Examen ou Entraînement)
3. Commencez votre préparation !

## 📁 Structure du projet

```
qcm-java/
├── README.md               # Documentation utilisateur
├── index.html              # Page d'accueil
├── exam.html               # Interface d'examen
├── assets/
│   ├── css/
│   │   └── style.css       # Styles principaux
│   ├── js/
│   │   ├── script.js       # Logique principale
│   │   └── progressManager.js  # Gestion progression
│   └── data/               # Examens JSON
│       ├── exam1.json      # Test/développement
│       ├── exam5-7.json    # Héritage & Polymorphisme
│       └── exam8-11.json   # Collections & Streams
├── docs/
│   └── CLAUDE.md          # Documentation technique
└── tests/
    └── test_reset.html    # Tests progression
```

## ✨ Fonctionnalités

- **Deux modes** : Examen chronométré et Entraînement avec correction
- **Navigation flexible** : Retour aux questions précédentes en mode examen
- **Suivi de progression** : Scores, moyennes et statistiques sauvegardées
- **Coloration syntaxique** : Code Java parfaitement formaté
- **Design responsive** : Interface adaptée mobile et desktop

## 🎯 Examens disponibles

### 🏗️ Héritage & Polymorphisme
- 4 examens de 20 questions
- Sujets : Héritage, Polymorphisme, Encapsulation, Overriding

### 📊 Collections & Streams
- 4 examens de 20 questions
- Sujets : Collections, Arrays, Streams, Lambda, reduce()

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