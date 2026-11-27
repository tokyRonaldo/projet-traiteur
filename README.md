# Kali Tao — Plateforme de mise en relation clients / traiteurs

Kali Tao (nom du paquet : `katerera`) permet à des clients de décrire un événement, de recevoir des devis de traiteurs, de les comparer, puis de confirmer une réservation. Les traiteurs gèrent leur activité (demandes, devis, réservations, disponibilités) et un espace d'administration modère la plateforme. Des assistants IA (Gemini) aident chaque profil dans ses tâches.

## Sommaire

1. [Fonctionnalités](#fonctionnalités)
2. [Stack technique](#stack-technique)
3. [Architecture](#architecture)
4. [Installation en local](#installation-en-local)
5. [Variables d'environnement](#variables-denvironnement)
6. [Assistants IA](#assistants-ia)
7. [API : endpoints notables](#api--endpoints-notables)
8. [Authentification et rôles](#authentification-et-rôles)
9. [Déploiement](#déploiement)
10. [Feuille de route](#feuille-de-route)

## Fonctionnalités

### Site public
- Page d'accueil avec traiteurs en vedette.
- Fiche détaillée d'un traiteur (`/caterers/[id]`), carte entièrement cliquable.
- Inscription et connexion (e-mail / mot de passe, ou compte Google).

### Espace client (`/client/*`)
- Envoi de demandes d'événement à un traiteur.
- Réception des devis avec recherche, filtres (prix, type d'événement) et onglets de statut.
- **Comparaison de 2 à 4 devis par l'IA**, acceptation ou refus d'un devis avec motif optionnel.
- Réservations et notifications.
- **Recherche de traiteurs en langage naturel** (« mariage en juin, 80 personnes, budget 4000 € »).

### Espace traiteur (`/caterer/*`)
- Tableau de bord, profil, services, galerie, calendrier de disponibilité.
- Demandes reçues, création / modification / retrait de devis.
- **Rédaction assistée du message de devis** (bouton « Rédiger avec l'IA »).
- Réservations : filtres (date, acompte), annulation / réactivation, export CSV du planning.
- Recherche globale dans l'en-tête, cloche de notifications avec compteur de non lus.
- **Assistant de chat** pour résumer l'activité (devis en attente, réservations à venir…).

### Espace administrateur (`/admin/*`)
- Gestion des utilisateurs, traiteurs (en attente / validés), services, catégories.
- Suivi des demandes, devis, réservations, paiements et avis.
- Statistiques et paramètres de la plateforme.
- **Aide à la modération par l'IA** : analyse d'un profil de traiteur en attente, repérage d'avis suspects (l'administrateur décide toujours).

### Transverses
- Barre de chargement globale (navigation et appels API).
- Notifications dans l'application et par e-mail à chaque étape du flux demande → devis → réservation.
- Layouts centralisés (sidebar, en-tête, modal de déconnexion) pour les espaces traiteur et admin.

## Stack technique

| Couche | Technologies |
|---|---|
| Front-end | Next.js 15 (App Router, dossier `src/app`), React, TypeScript, Tailwind CSS, lucide-react |
| Polices | Inter et Rubik auto-hébergées via `next/font/local` (aucune dépendance à Google Fonts au build) |
| Back-end | Laravel (API REST), authentification par jeton Bearer |
| Base de données | MySQL |
| IA | API Gemini (appelée uniquement depuis Laravel) |
| Automatisation | n8n (webhook d'envoi de l'e-mail du devis) |
| E-mails en local | Mailpit |
| Connexion sociale | Google OAuth |

## Architecture

```
projet-traiteur/
├── front-end/                # Application Next.js
│   ├── src/
│   │   ├── app/              # Routes : public, /client, /caterer, /admin
│   │   ├── components/       # ui/, shared/, caterer/, client/, admin/, home/
│   │   ├── context/          # AuthContext, LoadingContext
│   │   ├── hooks/            # useLogout, …
│   │   └── lib/              # api.ts (client HTTP), loadingEvents.ts, exportCsv.ts
│   └── middleware.ts         # Protection des routes par rôle
└── <dossier-backend>/        # API Laravel
    ├── app/Http/Controllers/ # Caterer/, Client/, Admin/
    ├── app/Services/         # NotificationService, Ai/ (GeminiClient, assistants)
    └── routes/api.php
```

Flux principal : **demande d'événement** (client) → **devis** (traiteur) → **acceptation** (client) → **réservation** confirmée → avis. Chaque étape crée une notification pour l'autre partie.

## Installation en local

### Prérequis
- Node.js 18.18 ou plus (20 LTS recommandé)
- PHP et Composer compatibles avec votre version de Laravel
- MySQL
- Optionnel : Mailpit (e-mails de test), n8n (envoi des devis)

### 1. Back-end (Laravel)

```bash
cd <dossier-backend>
composer install
cp .env.example .env
php artisan key:generate
# Renseigner la base de données dans .env, puis :
php artisan migrate
php artisan serve        # http://localhost:8000
```

### 2. Front-end (Next.js)

```bash
cd front-end
npm install
cp .env.example .env.local   # ou créer le fichier à la main (voir ci-dessous)
npm run dev                  # http://localhost:3000
```

Build de production :

```bash
npm run build
npm run start
```

## Variables d'environnement

> Ne jamais committer les fichiers `.env`. Si une clé ou un secret a été exposé, le régénérer immédiatement.

### Front-end (`.env.local`)

| Variable | Rôle | Exemple |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL de l'API Laravel | `http://localhost:8000/api` |

### Back-end (`.env`)

| Variable | Rôle |
|---|---|
| `APP_KEY`, `APP_URL` | Clé et URL de l'application |
| `DB_*` | Connexion MySQL |
| `FRONTEND_URL` | URL du front (liens dans les e-mails, redirection Google) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` | Connexion Google |
| `MAIL_*` | Envoi d'e-mails (Mailpit en local) |
| `GEMINI_API_KEY` | Clé Gemini (ne jamais l'exposer au front) |
| `GEMINI_MODELS` | Liste de modèles séparés par des virgules, essayés dans l'ordre |
| `GEMINI_TIMEOUT` | Délai maximal d'un appel, en secondes |
| `N8N_SEND_DEVIS_URL` | Webhook n8n d'envoi du devis (`/webhook/…` en production, `/webhook-test/…` pour les essais) |

## Assistants IA

Toutes les fonctions IA passent par **Laravel** : la clé Gemini ne quitte jamais le serveur, chaque route est limitée en débit, et l'IA ne reçoit que les données nécessaires (jamais d'e-mail ni de téléphone).

| Profil | Fonction | Principe |
|---|---|---|
| Traiteur | Assistant de chat | Appel d'outils en lecture seule (devis, réservations, résumé), filtrés sur le traiteur connecté |
| Traiteur | Rédaction du message d'un devis | Un brouillon est proposé, rien n'est envoyé sans validation |
| Client | Recherche de traiteurs | L'IA extrait des critères en JSON, le classement est fait par Laravel |
| Client | Comparaison de devis | Les chiffres sont calculés par Laravel, l'IA rédige l'analyse |
| Admin | Modération | Vérifications automatiques + avis de l'IA, **aide à la décision uniquement** |

Remarques :
- Le quota de l'offre gratuite Gemini est faible (de l'ordre de quelques dizaines de requêtes par jour et par modèle). Prévoir plusieurs modèles dans `GEMINI_MODELS` ou activer la facturation.
- Les noms de modèles évoluent : vérifier ceux disponibles pour votre clé dans Google AI Studio.

## API : endpoints notables

| Méthode | Route | Description |
|---|---|---|
| GET | `user` | Utilisateur connecté et ses rôles |
| GET | `caterer/profile` | Profil du traiteur |
| GET | `caterer/quotes` | Devis du traiteur |
| POST / PUT / DELETE | `caterer/quote/store` · `update/{id}` · `delete/{id}` | Création, modification, retrait d'un devis |
| GET | `caterer/bookings` | Réservations du traiteur |
| PUT | `caterer/booking/status/{id}` | Annuler ou réactiver une réservation |
| GET | `caterer/notifications/unread-count` | Compteur de notifications non lues |
| GET | `caterer/search?q=` | Recherche globale du traiteur |
| POST | `caterer/assistant/chat` | Assistant de chat |
| POST | `caterer/assistant/draft-quote-message` | Brouillon du message d'un devis |
| GET | `client/quotes` | Devis reçus par le client |
| POST | `client/quote/{id}/accept` · `reject` | Accepter (crée la réservation) ou refuser un devis |
| POST | `client/assistant/find-caterers` | Recherche de traiteurs en langage naturel |
| POST | `client/assistant/compare-quotes` | Comparaison de devis |
| POST | `admin/assistant/check-caterer/{id}` | Analyse d'un profil de traiteur |
| POST | `admin/assistant/scan-reviews` | Repérage d'avis suspects |

## Authentification et rôles

- Rôles : `client`, `traiteur`, `admin`.
- Le jeton est envoyé en `Authorization: Bearer …` par `lib/api.ts`. En cas de réponse 401, la session est nettoyée et l'utilisateur est renvoyé vers `/login`.
- Le fichier `middleware.ts` s'exécute avant l'affichage des pages : il lit les cookies `token` et `role`, redirige les visiteurs non connectés vers `/login`, renvoie un utilisateur connecté qui ouvre `/login` ou `/register` vers son espace, et refuse l'accès à un espace qui n'est pas celui de son rôle.
- Les cookies `token` et `role` doivent être supprimés à la déconnexion, en plus du jeton local.
- Le middleware protège l'**affichage** ; la protection des **données** doit être assurée côté Laravel (voir la feuille de route).

## Déploiement

- **Back-end** : Laravel hébergé sur Render (`https://projet-traiteur.onrender.com/api`).
- **Base de données** : MySQL hébergée chez Enzonic.
- **Front-end** : `npm run build` doit passer sans erreur de type avant tout déploiement.
- En production : utiliser l'URL `/webhook/` de n8n (et non `/webhook-test/`), définir `FRONTEND_URL` avec l'URL publique du front, et configurer un vrai service d'e-mail à la place de Mailpit.

## Feuille de route

**Sécurité**
- [ ] Middleware de rôle côté API Laravel (un client ne doit pas atteindre les routes traiteur ou admin).
- [ ] Policies Laravel : chaque traiteur ne lit et ne modifie que ses propres devis et réservations.
- [ ] Vérifier que le groupe de routes admin est réservé aux administrateurs (les routes IA y sont rattachées).

**Produit**
- [ ] Choisir un prestataire de paiement et gérer les webhooks.
- [ ] Pré-remplir le formulaire de demande à partir de la recherche IA (paramètres `?type=&guests=&budget=&date=`).
- [ ] Colonne `link` sur les notifications pour ouvrir directement la page concernée.
- [ ] Recherche publique avec filtres et pagination.

**Technique**
- [ ] Passer `CatererLayout` dans `app/caterer/layout.tsx` et créer le layout de l'espace client.
- [ ] Rendre la sidebar traiteur responsive (menu mobile comme côté admin).
- [ ] Diagnostiquer et corriger le blocage de `POST /api/login` en production.
- [ ] Tests automatisés (API Laravel et parcours clés du front).

---

Projet en cours de développement.
