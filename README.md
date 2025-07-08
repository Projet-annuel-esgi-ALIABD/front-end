# EcoSense - Plateforme Environnementale pour Ville Intelligente

EcoSense est une plateforme web front-end conçue pour la surveillance environnementale en temps réel et l'analyse prédictive pour les villes intelligentes. Elle offre une interface utilisateur riche et interactive pour visualiser des données complexes telles que la qualité de l'air, le trafic routier, les conditions météorologiques et les alertes critiques.

## Fonctionnalités

-   **Tableau de Bord Intuitif** : Une vue d'ensemble centralisée de toutes les données environnementales pertinentes.
    
-   **Indicateurs de Pollution** : Suivi en temps réel de divers polluants comme le PM2.5, NO₂, O₃ et le CO₂.
    
-   **Graphiques Interactifs** : Visualisation des données historiques et en temps réel pour la qualité de l'air et le trafic.
    
-   **Widget Météo** : Informations météorologiques actuelles et prévisions.
    
-   **Flux d'Alertes** : Notifications en temps réel sur les événements critiques et les avertissements.
    
-   **Prédictions par IA** : Des prévisions basées sur l'intelligence artificielle pour anticiper les futurs événements environnementaux.
    
-   **Authentification des Utilisateurs** : Un système d'authentification sécurisé pour l'accès à la plateforme.
    
-   **Interface Adaptative** : Une conception entièrement responsive qui s'adapte aux appareils mobiles et de bureau.
    

## Technologies Utilisées

Ce projet est construit avec les technologies et bibliothèques modernes suivantes :

-   **Framework** : Vue 3
    
-   **Langage** : TypeScript
    
-   **Build Tool** : Vite
    
-   **Style** : Tailwind CSS avec le mode sombre
    
-   **Composants UI** : shadcn-vue, une collection de composants réutilisables.
    
-   **Routing** : Vue Router
    
-   **Requêtes HTTP** : Axios 
    
-   **Gestion de Données Asynchrones** : VueQuery (TanStack Query) 
    
-   **Graphiques** : Recharts, Chart.js, et Unovis 
    
-   **Validation de Formulaires** : Vee-Validate avec Zod 
    
-   **Conteneurisation** : Docker et Docker Compose 
    

## Structure du Projet

Le projet est organisé comme suit :

```
/
├── src/
│ ├── assets/ # Ressources statiques
│ ├── components/ # Composants Vue réutilisables
│ │ ├── dashboard/ # Composants spécifiques au tableau de bord
│ │ └── ui/ # Composants d'interface utilisateur génériques
│ ├── pages/ # Pages principales de l'application
│ ├── services/ # Services (ex: authentification)
│ ├── hooks/ # Hooks personnalisés
│ ├── lib/ # Fonctions utilitaires
│ ├── router/ # Configuration du routage
│ └── ...
├── public/ # Fichiers statiques publics
├── Dockerfile # Instructions pour construire l'image Docker de production
├── docker-compose.yml # Configuration pour lancer l'application avec Docker
├── package.json # Dépendances et scripts du projet
└── vite.config.ts # Configuration de Vite

```

## Installation et Lancement

Pour lancer ce projet en local, suivez ces étapes :

1.  **Clonez le dépôt**
    
    Bash
    
    ```
    git clone https://github.com/Projet-annuel-esgi-ALIABD/front-end.git
    cd front-end
    
    ```
    
2.  **Installez les dépendances**
    
    Bash
    
    ```
    npm install
    
    ```
    
3.  **Configurez les variables d'environnement**
    
    Créez un fichier `.env` à la racine du projet et ajoutez-y les variables nécessaires, comme l'URL de votre API.
    
    ```
    VITE_API_URL=http://localhost:8000
    
    ```
    
4.  **Lancez le serveur de développement**
    
    Bash
    
    ```
    npm run dev
    
    ```
    
    L'application sera accessible à l'adresse
    
    `http://localhost:8080`.
    

### Utilisation avec Docker

Vous pouvez également lancer l'application en utilisant Docker :

Bash

```
docker-compose up --build

```

L'application sera accessible à l'adresse

`http://localhost:80`.

## Scripts Disponibles

-   `npm run dev` : Lance le serveur de développement avec Hot-Reload.
    
-   `npm run build` : Compile et optimise l'application pour la production.
    
-   `npm run lint` : Analyse le code pour détecter les erreurs et les problèmes de style.
    
-   `npm run preview` : Lance un serveur local pour prévisualiser la version de production.
    

## Déploiement

Pour le déploiement en production, une image Nginx est utilisée pour servir les fichiers statiques construits. Le

`Dockerfile` définit un build en plusieurs étapes pour créer une image optimisée et légère. Le serveur Nginx est configuré pour rediriger toutes les requêtes vers

`index.html`, ce qui est nécessaire pour les applications à page unique (SPA).
