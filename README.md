# Optimiseur de Rémunération SASU

Une application web pour optimiser la rémunération d'un dirigeant de SASU en trouvant la meilleure répartition entre salaire et dividendes afin de minimiser les prélèvements fiscaux et sociaux.

## 🎯 Fonctionnalités

- **Optimisation automatique** : Calcule la répartition optimale entre salaire et dividendes pour une rémunération nette cible
- **Contraintes personnalisables** : Définissez un salaire brut minimal pour vos droits sociaux (PUMA, trimestres retraite, indemnités journalières)
- **Calculs fiscaux précis** :
  - Charges sociales patronales et salariales
  - Impôt sur les sociétés (taux réduit à 15% jusqu'à 42 500€)
  - CSG sur les dividendes (17,2%)
  - Impôt sur le revenu (PFU à 12,8% ou barème progressif)
- **Visualisation interactive** : Graphique en cascade montrant la décomposition des coûts
- **Simulation en temps réel** : Résultats mis à jour instantanément

## 🚀 Technologies

- [Nuxt 4](https://nuxt.com/) - Framework Vue.js full-stack
- [Nuxt UI](https://ui.nuxt.com/) - Bibliothèque de composants UI
- [ECharts](https://echarts.apache.org/) - Visualisation de données
- [TailwindCSS 4](https://tailwindcss.com/) - Framework CSS utility-first
- [TypeScript](https://www.typescriptlang.org/) - Typage statique
- [Vitest](https://vitest.dev/) - Framework de tests unitaires

## 📦 Installation

### Prérequis

- Node.js 18+ 
- pnpm 10.29.3+

### Installation des dépendances

```bash
pnpm install
```

## 💻 Utilisation

### Développement

Lancez le serveur de développement sur `http://localhost:3000` :

```bash
pnpm dev
```

### Production

Compilez l'application pour la production :

```bash
pnpm build
```

Prévisualisez la version de production :

```bash
pnpm preview
```

### Tests

Exécutez les tests unitaires :

```bash
pnpm test
```

Exécutez les tests en mode watch :

```bash
pnpm test:watch
```

### Linting et Typage

Vérifiez le code avec ESLint :

```bash
pnpm lint
```

Vérifiez les types TypeScript :

```bash
pnpm typecheck
```

## 🧮 Comment ça fonctionne ?

### Principe de l'optimisation

En SASU, deux modes de rémunération coexistent :

1. **Salaire** : 
   - Charges sociales totales : ~67% (patronales + salariales)
   - Ouvre des droits sociaux (retraite, chômage, santé)
   - Déductible du résultat imposable

2. **Dividendes** :
   - Impôt sur les sociétés : 15% jusqu'à 42 500€, puis 25%
   - CSG : 17,2% (non déductible)
   - Impôt sur le revenu : PFU à 12,8% ou barème progressif
   - Pas de charges sociales
   - Pas de droits sociaux

### Algorithme d'optimisation

L'application teste systématiquement différentes répartitions salaire/dividendes :

1. Pour chaque niveau de salaire brut (à partir du minimum défini)
2. Calcul du montant de dividendes nécessaire pour atteindre la rémunération nette cible (recherche dichotomique)
3. Calcul du taux de prélèvement global
4. Sélection de la configuration avec le taux de prélèvement le plus faible

### Suggestions de salaire minimal

- **12 560 €** : Adhésion gratuite à la PUMA (couverture santé)
- **7 128 €** : Validation de 4 trimestres de retraite
- **24 117 €** : Maximisation des indemnités journalières maladie

## 📊 Calculs implémentés

Les utilitaires de calcul se trouvent dans [`app/utils/`](app/utils/) :

- [`salaire.ts`](app/utils/salaire.ts) : Calcul du salaire net et des charges sociales
- [`impotSociete.ts`](app/utils/impotSociete.ts) : Calcul de l'IS avec taux réduit
- [`csgDividendes.ts`](app/utils/csgDividendes.ts) : Calcul de la CSG sur dividendes
- [`impotRevenu.ts`](app/utils/impotRevenu.ts) : Calcul de l'IR (PFU vs barème)
- [`coutTotalRemuneration.ts`](app/utils/coutTotalRemuneration.ts) : Calcul global
- [`optimiserRemuneration.ts`](app/utils/optimiserRemuneration.ts) : Algorithme d'optimisation

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 License

[MIT License](LICENSE) - Copyright (c) 2025

## ⚠️ Avertissement

Cet outil est fourni à titre informatif et ne constitue pas un conseil fiscal ou juridique. Les calculs sont basés sur les règles fiscales françaises en vigueur mais peuvent nécessiter des ajustements selon votre situation personnelle. Consultez un expert-comptable pour vos décisions financières.
