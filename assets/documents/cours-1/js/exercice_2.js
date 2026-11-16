// DES7720 — EXERCICE 2 — dessin_souris
// Dans cet exercice, nous allons créer un sketch interactif où une image deviendra matière à dessiner.
// Nous utiliserons les fonctions et les variables intégrées à p5.js pour explorer différents gestes de la souris.
// Une fois les étapes principales terminées, vous aurez du temps pour explorer une variation de votre choix
// et noter vos réflexions sur les changements apportés à votre sketch.
// Nous présenterons brièvement les sketchs au début du cours suivant.

function setup() {
}

function draw() {
}

/*
DESSINER AVEC UNE PHOTO

1. Partir de la base
   On ouvre index.html avec Live Server. La page est vide. On a déjà setup() et draw().
   On commence dans setup() avec createCanvas(windowWidth, windowHeight), puis background(0).
   On enregistre. 

2. Poser la photo à gauche
   On va voir reflet.jpg dans assets/images. En haut du sketch, je déclare let reflectionImage;
   On ajoute function preload() { } avant setup(). Dedans, on écrit :
     reflectionImage = loadImage("./assets/images/reflet.jpg");
   Le truc pratique, c’est qu’une fois la photo chargée, on a accès à sa
   largeur et à sa hauteur : reflectionImage.width et reflectionImage.height.
   Dans setup(), on essaie createCanvas(reflectionImage.width, reflectionImage.height).
   Après le fond noir, on ajoute image(reflectionImage, 0, 0). La photo remplit le canevas.
   Là, je veux du papier à droite. Je multiplie seulement la largeur du canevas par 2.
   On enregistre : photo à gauche, noir à droite.

3. Faire une première copie
   À la fin de setup(), on écrit copy( et on construit la ligne dans cet ordre :
     Quelle image ?              reflectionImage,
     Où je prends le morceau ?   0, 0,
     Quelle surface je prends ?  100, 100,
     Où je le dépose ?           width / 2, height / 2,
     À quelle taille ?           100, 100);
   On ferme la parenthèse, on enregistre. On devrait retrouver le ciel du coin supérieur
   gauche sur le papier noir. Premier essai : on change juste le premier 0 pour 315.
   Le contenu change. Maintenant, on change juste width / 2 pour width / 2 + 50.
   Cette fois, c’est le morceau qui se déplace. On remet les valeurs de départ.

4. Choisir le morceau avec la souris
   On remplace les deux 0 du prélèvement par mouseX et mouseY. On enregistre, on bouge…
   ça suit pas. Pourquoi ? Parce que copy() est dans setup(), qui a déjà fini de rouler.
   On déplace juste cette ligne dans draw(). Là, si on passe du ciel au trottoir,
   le carré à droite reste sur place, mais on voit son contenu changer.

5. Essayer trois gestes avec la même ligne
   On crée les fonctions suivantes une à la fois. On sort copy() de draw() et on garde une
   seule copie de la ligne et on essaie le geste après chaque changement :
     mouseMoved()   — je bouge la souris sur la photo et le détail change.
     mousePressed() — je dois cliquer pour choisir un autre détail.
     mouseDragged() — je garde le bouton enfoncé et je glisse pour changer de détail.
   On garde mouseDragged() pour la suite.

6. Dessiner de l’autre côté
   Pour l’instant, tout se dépose au même endroit. Je veux que ma main dessine à droite
   pendant que je parcours la photo à gauche. En haut, je déclare copyPosX et copyPosY
   avec let. Dans mouseDragged(), juste avant copy(), je leur donne une valeur :
     copyPosX = mouseX + reflectionImage.width;
     copyPosY = mouseY;
   Dans copy(), je mets copyPosX et copyPosY à la place des deux valeurs de destination.
   On essaie une diagonale sur la photo. On devrait retrouver le même geste à droite.
   Là, si je clique sans bouger, il se passe quoi ? Rien. Je veux garder les deux gestes.
   Je déplace le calcul des positions et le copy() dans mousePressed(). Je teste un clic.
   Puis dans mouseDragged(), j’écris juste mousePressed(); Le glisser répète le dépôt du clic.

7. Voir ce qu’on prélève
   Là, on dessine, mais j’aimerais voir ce que je prends. En haut, je déclare copyWidth
   et copyHeight avec let et je leur donne 100 chacun. Dans copy(), je remplace les quatre
   100 par ces variables : largeur, hauteur au départ, puis largeur, hauteur à l’arrivée.
   Dans draw(), j’ajoute stroke(255, 0, 0), noFill(), puis rect(mouseX, mouseY, copyWidth, copyHeight).
   On peut aussi utiliser fill(0, 0, 0, 0) : le dernier 0 rend l’intérieur transparent.
   Je bouge sur la photo. Là, les carrés se répètent partout. C’est beau, ça !
   Si ça vous donne une idée, c’est un bon moment pour un commit, une capture d’écran
   et une petite note : « J’aime les cadres qui s’accumulent. À explorer. »
   Pour garder un seul cadre, on déplace image(reflectionImage, 0, 0) de setup() au début de
   draw(), avant rect(). La photo recouvre l’ancien cadre. Le dessin à droite reste en place.

8. Mettre la souris au centre du cadre
   Pour l’instant, la pointe touche le coin du carré. Pour viser avec le centre, je recule
   d’une demi-largeur en x et d’une demi-hauteur en y. Avec 100 × 100, ça fait 50 de chaque côté.
   Dans mousePressed(), j’ajuste les deux positions qu’on utilise déjà :
     copyPosX = mouseX - copyWidth / 2 + reflectionImage.width;
     copyPosY = mouseY - copyHeight / 2;
   Dans copy(), je prends le morceau à mouseX - copyWidth / 2, copyPosY,
   puis je le dépose à copyPosX, copyPosY. La hauteur est la même des deux côtés.
   Dans draw(), je recule aussi le coin du cadre d’une demi-largeur et d’une demi-hauteur.
   On vise l’œil, on clique, puis on glisse : est-ce que c’est bien le détail cadré qui s’imprime ?

À vous de choisir une variation. Quand vous avez une version que vous voulez garder,
faites un commit. Dans le journal, notez ce que vous avez changé, ce qui s’est passé
quand vous l’avez essayé et ce que ça vous donne envie de faire ensuite. Puis on push.

Références p5.js
https://v1.p5js.org/reference/p5/loadImage/
https://v1.p5js.org/reference/p5/copy/
*/
