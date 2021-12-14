# Projet 7 - Groupomania

7ème et dernier projet de la formation développeur web d'Openclassrooms.
Créer un réseau social d'entreprise.
La stack utilisée pour ce projet:

- VueJs + vuex + vuetify
- NodeJs + express + sequelize
- Mysql

Requis pour ce projet:

- version NodeJs a partir de 14
- Recommandé : MySQL Workbench ( Interface de gestion de votre base de données)

## Base de données

Se connecter au serveur **MySql** de votre choix.
Exécuter la commande: `CREATE DATABASE groupomania;`
Compléter vos identifiants dans le fichier config.json du dossier Backend

au lancement du backend un compte administrateur sera automatiquement créé
(les identifiants vous on été fourni dans le fichier admin_config.js présent dans le dossier "Config").

## Frontend

Ouvrir le dossier Frontend dans le terminal de votre éditeur puis exécuter la commande:

    npm install

puis

    npm run serve

Ce message devrait s'afficher :

App running at:

- Local: http://localhost:8080/

## Backend

A partir du dossier Backend dans un nouveau terminal de votre éditeur exécuter la commande:

    npm install

puis

    node server (ou nodemon serve si il est présent dans votre machine)

    Un message devrait vous annoncer  :

Listening on port 3000
{ message: 'compte admin créé !' }

## Utilisation

Pour s'inscrire sur le social network de Groupomania, il vous faut renseigner :

- Un pseudo (entre 3 et 30 caractères)
- Une adresse mail valide
- Un mot de passe (au minimum 8 caractères, 1 majuscule et 1 chiffre, pas de symboles).
  Vous pouvez par la suite modifier votre profil (pseudo, avatar) en allant sur votre profil. Votre compte peut être supprimé.

Une fois connecté vous pouvez voir les publications des utilisateurs et publier au choix:

- un post
- un post + un lien (gifs ok, pas de vidéos youtube)
- un post + une image
  Ces publications peuvent être likées, commentées, modifiées, supprimées.
  L' administrateur peut supprimer un post ou un commentaire.
