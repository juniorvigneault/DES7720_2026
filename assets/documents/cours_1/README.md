# Cours 1 — Mon aide-mémoire pour la démo

Je garde VS Code et le navigateur côte à côte. À chaque essai, je change une chose, je fais **⌘S** et je montre le résultat. Le petit point dans l’onglet de VS Code disparaît quand le fichier est enregistré.

## Exercice 1 — Introduction à p5.js

### Ouvrir le projet

1. **Télécharger et décompresser le ZIP.** Je glisse le dossier `cours 1` dans le dépôt cloné. Dans GitHub Desktop, je fais le commit « Commencer l’exercice ». Le titre suffit ici.
2. **Expliquer le premier commit.** « C’est une photo du projet sur mon ordinateur. Je peux en garder plusieurs et les envoyer sur GitHub avec un push. Quand je fais un choix de design, j’utilise la description pour dire pourquoi. »
3. **Ouvrir le dépôt au complet dans VS Code.** Je déplie `cours 1`. `assets/` contient les images et les sons, `index.html` donne la structure de la page, `css/style.css` son apparence. Notre code va dans `js/exercice_1.js`.
4. **Montrer la bibliothèque.** Matter.js fournit des fonctions pour la physique. p5.js en fournit pour dessiner et interagir. Sur le site de p5, je montre un exemple, la référence, puis le lien CDN sous *Download*. Dans `index.html`, je pointe la ligne de p5.js 1.x, juste avant celle de notre script. [Site p5.js 1.x](https://v1.p5js.org/) · [Download](https://v1.p5js.org/download/)
5. **Lancer l’aperçu local.** Dans VS Code, j’installe l’extension **Live Server** si nécessaire. Clic droit sur le `index.html` du cours 1 → **Open with Live Server**. Pour l’instant, la page est vide.

### Faire apparaître un carré

1. **Montrer les accolades** dans `js/exercice_1.js`. `preload()` charge les médias avant le départ. `setup()` roule une fois. `draw()` dessine en boucle et vise 60 images par seconde.
2. **Créer le canevas rouge.** Dans `setup()`, j’écris `createCanvas(640, 640);`. Dans `draw()`, j’écris `background(255, 0, 0);`. J’enregistre. Tadam, un carré rouge ! J’essaie une autre valeur de vert, puis une autre largeur. Je reviens au carré rouge de 640 × 640. En RVB, chaque canal va de 0 à 255.
3. **Faire le premier push.** Commit « Créer un canevas rouge » → **Push origin** → j’ouvre GitHub et je montre les deux commits dans l’historique.
4. **Placer le rectangle.** Sous le fond dans `draw()`, j’ajoute `rect(0, 0, 250, 250);`. Je lis les paramètres dans l’ordre : x, y, largeur, hauteur. Le carré apparaît en haut à gauche.
5. **Changer son point d’ancrage.** Juste avant `rect()`, j’ajoute `rectMode(CENTER);`. Une partie du carré sort du canevas. Je remplace `0, 0` par `320, 320`. Son centre est maintenant à la moitié de 640.
6. **Chercher une fonction en direct.** « Comment enlever le contour ? » Je cherche *p5.js rectangle border width*. Je vérifie `noStroke()` dans la référence, je le tape avant `rect()` et je regarde le contour disparaître. Même principe avec une IA : essayer la ligne et vérifier son effet. [Référence p5.js](https://v1.p5js.org/reference/)

### Donner le contrôle à la souris

1. **Position.** J’essaie `rect(mouseX, mouseY, 250, 250);`. Le carré suit la souris. Une variable contient une valeur qui peut changer. Ici, p5 met les coordonnées à jour.
2. **Traces.** Je mets `//` devant `background(...)`, j’enregistre et je bouge. Les carrés s’accumulent. Je retire `//` et je refais le geste. Le fond recouvre chaque position précédente.
3. **Taille, puis couleur.** J’essaie `rect(320, 320, mouseX, mouseY);`, puis `mouseX / 2` pour réduire la largeur. J’essaie ensuite `background(mouseX / 3, 0, 0);`. Je garde ce fond et le carré de 250 × 250 qui suit la souris. Commit « Faire réagir la position du carré et la couleur du fond à la souris ».

### Changer la taille de la fenêtre

1. **Centrer et redimensionner.** J’essaie `rect(width / 2, height / 2, 250, 250);`, puis `createCanvas(windowWidth, windowHeight);` dans `setup()`. Je réduis la fenêtre. J’ajoute ensuite cette fonction après `draw()` et je refais le geste. Cette fois, le canevas s’ajuste et le carré reste au centre.

   ```js
   function windowResized() {
     resizeCanvas(windowWidth, windowHeight);
   }
   ```

2. **Nommer ma couleur.** En haut du script, je déclare `let backgroundColorR = 0;`. Je fais pareil pour `backgroundColorG` et `backgroundColorB`. Dans `draw()`, j’essaie `background(backgroundColorR, backgroundColorG, backgroundColorB);`. Le fond devient noir.
3. **Changer la couleur au redimensionnement.** Juste après `resizeCanvas(...)`, j’écris `backgroundColorR = random(255);`. Je répète pour le vert et le bleu. Je redimensionne, puis j’arrête. La dernière couleur reste affichée. Dernier commit de l’intro, puis **Push origin**.

## Exercice 2 — Dessiner avec une photo

**Passer au deuxième script.** Dans le même `index.html`, je commente la ligne de l’exercice 1 et je décommente celle de l’exercice 2. J’enregistre. J’ouvre `js/exercice_2.js`. On repart d’une page vide.

```html
<!-- <script src="js/exercice_1.js"></script> -->
<script src="js/exercice_2.js"></script>
```

### Voir la photo et faire une première copie

1. **Faire apparaître le noir.** Dans `setup()`, j’écris `createCanvas(windowWidth, windowHeight);`, puis `background(0);`. J’enregistre. Le canevas est noir.
2. **Charger la photo.** Je montre `assets/images/reflet.jpg`. En haut du script, je déclare `let reflectionImage;`. Avant `setup()`, j’ajoute une fonction `preload()`. Dedans, j’écris `reflectionImage = loadImage("./assets/images/reflet.jpg");`.
3. **Faire de la place à droite.** Dans `setup()`, j’essaie `createCanvas(reflectionImage.width, reflectionImage.height);`. Après le fond noir, j’ajoute `image(reflectionImage, 0, 0);`. La photo remplit le canevas. Je multiplie seulement sa largeur par deux dans `createCanvas()`. J’obtiens la photo à gauche et du noir à droite.
4. **Construire `copy()` ensemble.** À la fin de `setup()`, j’écris une ligne à la fois. On enregistre quand la parenthèse est fermée.

   ```js
   copy(reflectionImage,    // Dans quelle image ?
     0, 0,                 // Où prendre le détail ?
     100, 100,             // Sur quelle largeur et quelle hauteur ?
     width / 2, height / 2, // Où le déposer sur le canevas ?
     100, 100);            // À quelle taille ?
   ```

   **Premier essai** — Je retrouve le ciel du coin supérieur gauche sur le fond noir. Je change le premier `0` pour `315`. Le détail change.  
   **Deuxième essai** — Je change `width / 2` pour `width / 2 + 50`. Le même détail se déplace. Je remets les valeurs de départ.

### Passer du détail fixe au geste

1. **Choisir un détail.** Dans `copy()`, je remplace les deux coordonnées de départ par `mouseX, mouseY`. Je bouge sur la photo. Rien ne suit : `setup()` a déjà fini. Je déplace `copy()` dans `draw()`. Du ciel au trottoir, le carré reste au même endroit à droite et son contenu change.
2. **Comparer trois gestes.** Je déplace la même ligne de `copy()` dans une seule fonction à la fois. Dans `mouseMoved()`, je survole la photo. Dans `mousePressed()`, je clique. Dans `mouseDragged()`, je garde le bouton enfoncé et je glisse. Je garde ce dernier geste pour la suite.
3. **Dessiner à droite.** En haut, je déclare `let copyPosX;` et `let copyPosY;`. Dans `mouseDragged()`, juste avant `copy()`, j’ajoute les deux lignes ci-dessous. Dans `copy()`, la destination devient `copyPosX, copyPosY`. Je trace une diagonale sur la photo. Elle apparaît à droite.

   ```js
   copyPosX = mouseX + reflectionImage.width;
   copyPosY = mouseY;
   ```

4. **Garder aussi le clic.** Je déplace ces deux calculs et `copy()` dans `mousePressed()`. Je clique pour déposer un fragment. Dans `mouseDragged()`, j’écris simplement `mousePressed();`. J’essaie un clic, puis un trait continu.

### Viser avec le cadre rouge

1. **Dessiner le cadre.** En haut, je déclare `let copyWidth = 100;` et `let copyHeight = 100;`. Dans `copy()`, ces variables remplacent les deux paires de dimensions. Dans `draw()`, j’ajoute `stroke(255, 0, 0);`, `noFill();`, puis `rect(mouseX, mouseY, copyWidth, copyHeight);`. Je bouge. Les cadres s’accumulent.
2. **Garder un seul cadre.** Je déplace `image(reflectionImage, 0, 0);` de `setup()` au début de `draw()`, avant le cadre. Je bouge à gauche. La photo recouvre l’ancien cadre et mon dessin reste à droite.
3. **Centrer le curseur.** Je vise l’œil sur la photo. Pour que l’œil soit au centre du morceau, je recule le coin d’une demi-largeur et d’une demi-hauteur. Dans `mousePressed()`, j’ajuste les deux calculs :

   ```js
   copyPosX = mouseX - copyWidth / 2 + reflectionImage.width;
   copyPosY = mouseY - copyHeight / 2;
   ```

   Dans `copy()`, le départ devient `mouseX - copyWidth / 2, copyPosY`. L’arrivée reste `copyPosX, copyPosY`. Dans `draw()`, je fais commencer `rect()` à `mouseX - copyWidth / 2, mouseY - copyHeight / 2`. Je vise l’œil, je clique, puis je glisse. Le détail encadré est celui qui s’imprime.

### Laisser le groupe explorer, puis fermer la séance

1. **Essayer avant de modifier.** « Prenez deux minutes pour jouer avec le sketch. Qu’est-ce que vous aimeriez changer dans le geste ? Notez une piste dans votre journal. »
2. **Choisir une modification.** Si quelqu’un cherche un départ : remplacer la photo, changer la taille des fragments ou imprimer une bande à partir d’un carré. Dès qu’une version vaut la peine d’être retrouvée, faire un commit. Exemple : « Imprimer des bandes au glisser ». Dans la description, dire pourquoi on garde cet essai.
3. **Journal, puis push.** « Qu’avez-vous remarqué en essayant votre version ? Qu’est-ce que ça vous donne envie d’explorer ? » Garder une note ou une capture, faire un commit pour le journal, puis **Push origin**. Vérifier le sketch sur GitHub Pages. On regardera les essais au début du prochain cours.
