# Mairie du Comté de Blaine - Guide de Modification

Ce guide explique comment administrer et modifier le site officiel de la mairie.

## 1. Panel d'Administration (Recommandé)

Les Super Admins peuvent modifier le site directement via le panel d'administration sans toucher au code.

### Paramètres de la Page d'Accueil
- **Admin > Paramètres > Page d'Accueil**: Modifiez le titre principal (Hero), le sous-titre et l'image de fond.
- **Admin > Paramètres > Maire**: Modifiez le nom du maire, sa photo, le titre de sa vision et son message.
- **Admin > Paramètres > Sections**: Activez ou désactivez l'affichage des sections (Maire, Actualités, Urgence) sur la page d'accueil.

### Contenu Dynamique
- **Actualités**: Gérez les articles via **Admin > Actualités**.
- **Événements**: Gérez le calendrier via **Admin > Événements**.
- **Services**: Gérez les démarches en ligne via **Admin > Services**.
- **Organigramme**: Gérez les membres de l'équipe via **Admin > Paramètres > Organigramme**.
- **Candidatures**: Gérez les recrutements via **Admin > Candidatures**.

---

## 2. Structure Technique

### Dossiers Clés
- `src/app/`: Contient toutes les pages du site.
- `src/components/`: Contient les composants réutilisables (Navbar, Footer, etc.).
- `src/lib/supabase.ts`: Configuration de la connexion à la base de données.

### Base de Données (Supabase)
Le site utilise Supabase pour le stockage des données. Les tables principales sont :
- `settings`: Clé/Valeur pour les paramètres du site (titres, images, toggles).
- `profiles`: Comptes utilisateurs et rôles.
- `news`: Articles d'actualité.
- `team_members`: Membres affichés dans l'organigramme.
- `departments`: Les 4 services principaux (NOOSE, LSSD, SAMS, DOJ).

---

## 3. Maintenance et Déploiement

### Déploiement
Le déploiement est automatisé. À chaque modification poussée sur le dépôt, le site est reconstruit.
**Note**: Les erreurs de "circular structure" dans ESLint ont été corrigées pour ne plus bloquer le déploiement.

### Commandes Utiles
```bash
bun dev          # Lancer en mode développement
bun run lint     # Vérifier les erreurs de code
```

### Webhooks Discord
Pour configurer les notifications sur votre serveur Discord (Candidatures et Messages), allez dans **Admin > Intégrations** et renseignez les URLs de vos webhooks.
