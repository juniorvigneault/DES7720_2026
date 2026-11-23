let policeBilles;
const sceneBye = Matter.Composite.create();
let lignesFin = [];
let diametreBilleFin = 10;

function preparerBye() {
  mouseReleased();
  lignesFin = [];
  Matter.Composite.clear(sceneBye, false);
}

function disposerFin(debut, interligne, diametre) {
  const retrait = textWidth("3. ");
  const largeur = min(620, width - 2 * marge) - retrait;
  const espace = height < 320 ? 5 : 12;
  let y = debut;

  for (const [i, phrase] of consignesFin.entries()) {
    lignesFin.push({ texte: (i + 1) + ".", x: marge, y });
    let ligne = "";
    for (const mot of phrase.split(" ")) {
      const suite = ligne ? ligne + " " + mot : mot;
      if (ligne && textWidth(suite) > largeur) {
        lignesFin.push({ texte: ligne, x: marge + retrait, y });
        y += interligne;
        ligne = mot;
      } else {
        ligne = suite;
      }
    }
    lignesFin.push({ texte: ligne, x: marge + retrait, y });
    y += interligne + espace;
  }

  const haut = y + diametre;
  const bas = height - marge - diametre / 2;
  const taille = min(width * 0.48, (bas - haut) * 0.92, 220);
  if (taille < 10) return;
  diametreBilleFin = min(diametre, taille / 18);
  const zone = policeBilles.textBounds("bye", 0, 0, taille);
  const x = (width - zone.w) / 2 - zone.x;
  const centre = (haut + bas) / 2;
  const origineY = centre - zone.h / 2 - zone.y;
  const points = policeBilles.textToPoints("bye", x, origineY, taille, { sampleFactor: 0.5 });

  for (const point of points) {
    const libre = sceneBye.bodies.every(bille =>
      dist(point.x, point.y, bille.position.x, bille.position.y) >= diametreBilleFin * 1.12
    );
    if (libre) {
      const bille = Matter.Bodies.circle(point.x, point.y, diametreBilleFin / 2, {
        frictionAir: 0,
        restitution: 0.85
      });
      Matter.Composite.add(sceneBye, bille);
    }
  }
}

function finAtelier() {
  const y = titreDiapo("Pour le " + dateProchainCours);
  const taille = min(17.33, width / 21, (height - extraTitleSpace) / 18);
  const interligne = round(taille * 1.27);
  const diametre = 10 * min(1, width / 540, height / 420);
  textSize(taille);
  if (!lignesFin.length) disposerFin(y + 30 + extraTitleSpace, interligne, diametre);
  for (const ligne of lignesFin) text(ligne.texte, ligne.x, ligne.y);

  push();
  imageMode(CENTER);
  for (const bille of sceneBye.bodies) {
    image(perle, bille.position.x, bille.position.y, diametreBilleFin, diametreBilleFin);
  }
  pop();
}
