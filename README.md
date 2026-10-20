# Les 22 ans de Bebou

Site pour **ASSOUA EBAH NANCY-ERINE FLORELLE**, alias Bebou. HTML, CSS, JavaScript et Three.js 0.180.0 (fichiers locaux dans `vendor/`, licence MIT incluse). Aucune compilation ni installation npm nécessaire.

## Ouvrir le site

Pour profiter de la 3D sans dépendre d’Internet, lancer depuis ce dossier :

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Puis ouvrir http://127.0.0.1:8080. Arrêter avec Ctrl+C. Le double-clic sur `index.html` fonctionne également avec Internet pour charger la 3D depuis un CDN. Les polices Google utilisent Internet ; une police de remplacement s’affiche sinon.

## Personnaliser les médias

1. Copier les vidéos et photos dans `assets/` (par exemple `francais.mp4`, `anglais.mp4`, `souvenir-1.jpg`).
2. Ouvrir `content.js`.
3. Compléter `videos.fr` et `videos.en` avec `assets/francais.mp4` et `assets/anglais.mp4`.
4. Compléter le champ `src` de chaque souvenir avec le chemin de sa photo.

Les vidéos sont présentées en **16:9**, sans recadrage. Les boutons pour choisir un fichier dans la page permettent un aperçu temporaire ; ils n’enregistrent pas les fichiers dans le projet et les aperçus disparaissent au rechargement. Ces boutons disparaissent lorsque les chemins permanents sont renseignés.

## Les mots et la lettre

- `content.js` contient **28 mots proposés**, suivant les 28 lettres de **ASSOUA EBAH NANCY ERINE FLORELLE**, sans espaces ni tiret. Modifier ces propositions pour décrire sa vraie personnalité. « Yin », pour Y, évoque la douceur et l’équilibre ; il peut être remplacé.
- Le texte de la lettre est un brouillon dans `index.html`, dans le bloc `personal-message`. Remplacer ce texte par ton propre message.
- Les trois liens contenant `data-memory="0"`, `"1"` et `"2"` ouvrent chacun une photo ou une vidéo en modal, au-dessus de la lettre. Modifier leur texte sans retirer cet attribut.
- Les titres, légendes et descriptions des photos se modifient dans `content.js`.

## Couleurs

Palette définie dans `sections.css` : fond **#E2E0D1**, textes **#7C614B**, accents **#DE8FF2**. Les couleurs naturelles du poulet et des flammes restent dorées.

## Gâteau 3D

Modèle procédural de gâteau trompe-l’œil en forme de pilon de poulet frit : panure, os, glaçage, assiette et bougies en volume « 22 ». Tourner avec la souris, le doigt ou les deux boutons. « Souffler mes bougies » éteint les flammes et lance des confettis ; « Rallumer les bougies » rétablit les flammes. L’animation automatique respecte la préférence système de réduction des animations. Un message de remplacement apparaît si la 3D n’est pas disponible.

Le site est local et n’a pas été publié en ligne.

## Photo d’accueil et sons personnalisés

Dans `content.js`, renseigner :

```js
portrait: 'assets/florelle.jpg',
audio: {
  background: 'assets/musique.mp3',
  celebration: 'assets/message-apres-bougies.mp3'
},
```

La musique de fond démarre avec le bouton « Activer la musique », puis tourne en boucle. Le clic sur « Souffler mes bougies » coupe la musique de fond et lance immédiatement l’enregistrement, sans boucle. Un nouveau clic recommence cet enregistrement au début. Aucun son de remplacement n’est généré si tes fichiers ne sont pas encore renseignés. La lecture d’une vidéo met les sons en pause pour laisser entendre le message.

Les boutons « Choisir sa photo » et « Les sons de cette journée » permettent des aperçus temporaires depuis ton ordinateur. Pour une intégration permanente, utiliser les chemins ci-dessus. Les sélecteurs disparaissent une fois leurs fichiers permanents configurés.

## Photo ou vidéo dans la lettre

Chaque lien de la lettre ouvre un souvenir indépendant. Le sélecteur accepte une photo ou une vidéo. Les vidéos ont leurs contrôles et s’arrêtent lorsque le modal se ferme (y compris avec Échap). Leur lecture met la musique de fond en pause.

Pour intégrer durablement une vidéo, renseigner son chemin dans `memories` de `content.js` et ajouter `type: 'video'` :

```js
{ title: 'Notre souvenir', caption: 'Un moment à nous.',
  src: 'assets/souvenir.mp4', type: 'video', alt: 'Vidéo de nous deux' }
```

Pour une photo, utiliser `type: 'image'`. En l’absence de `type`, les extensions vidéo courantes sont reconnues automatiquement. Les choix faits depuis le sélecteur restent des aperçus temporaires jusqu’au rechargement.

## Version découverte et préparation

La page normale est la version destinée à Bebou : écran « Découvrir », musique démarrée par ce clic si elle est configurée, et aucun bouton de sélection de fichier. Chaque mot révèle une pensée au clic ; après les bougies, un dernier message apparaît. Les pensées sont des propositions à personnaliser dans `wordNotes` de `content.js` ou dans un tableau `notes` de chaque groupe.

Pour afficher les outils de préparation et passer l’écran de découverte, ouvrir `http://127.0.0.1:8080/?edit=1` (ou ajouter `?edit=1` à l’adresse du fichier local). Ce mode sert à tester tes fichiers ; il ne les enregistre toujours pas dans le projet. La version à partager est l’adresse sans `?edit=1`.

Avant l’envoi, intégrer définitivement la photo, les deux vidéos, les souvenirs et l’enregistrement final. Adapter la lettre et les pensées avec tes propres détails. Les vidéos ne préchargent pas leur contenu et le gâteau 3D se charge seulement à l’approche de sa section. Compresser les photos et exporter les vidéos dans un format lisible sur téléphone avant leur ajout ; aucun fichier personnel existant n’a été recompressé automatiquement.

Le site n’a pas encore été publié : un hébergement et un test du lien sur téléphone resteront nécessaires avant l’envoi du 20 octobre.

## Vidéos Google Drive et iframes

Dans Drive, règle l’accès des vidéos sur « Tous les utilisateurs disposant du lien » (lecture), puis copie leur lien. Aucun fichier vidéo lourd n’a besoin d’être ajouté dans `assets/`.

Dans `content.js`, pour les deux messages :

```js
videos: {
  fr: 'https://drive.google.com/file/d/ID_VIDEO_FR/view?usp=sharing',
  en: 'https://drive.google.com/file/d/ID_VIDEO_EN/preview'
},
```

Les liens Drive `/file/d/…/view`, `/file/d/…/preview` et les liens avec `?id=…` sont automatiquement convertis vers `/preview`. Pour les souvenirs de la lettre, remplace simplement le `src` du souvenir concerné :

```js
{ title: 'Nos souvenirs préférés', caption: 'Un moment à nous.',
  src: 'https://drive.google.com/file/d/ID_VIDEO/preview',
  type: 'iframe', alt: 'Vidéo de nous deux' }
```

Pour un autre hébergeur autorisant l’intégration, utilise son URL HTTPS de lecteur :

```js
videos: { fr: { src: 'https://exemple.com/embed/video', type: 'iframe' }, en: '' },
```

Colle uniquement l’URL, pas le code HTML `<iframe>`. Les chemins locaux restent utilisables comme avant. Les lecteurs des messages sont chargés après un clic sur « Voir la vidéo » ; la musique du site se met alors en pause. Ouvrir un souvenir intégré met également les sons en pause ; fermer le souvenir retire le lecteur et arrête son contenu. Un lien « Ouvrir la vidéo » permet d’accéder au lecteur dans un autre onglet si l’intégration est bloquée.

Les commandes de lecture des iframes distantes sont gérées par leur hébergeur : le site ne peut pas détecter leur lecture ni les mettre en pause automatiquement quand un autre son est lancé. Vérifie l’accès avec une fenêtre privée avant de partager le site ; Drive peut aussi nécessiter un délai de traitement après l’envoi d’une vidéo.
