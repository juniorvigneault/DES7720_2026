// Réglez chaque chaîne sur une échelle de 0 à 500.
// À 0, la carte arrive sous le titre. À 500, son bas se trouve à 20 px du bord.
const seances = [
  {
    date: "16 novembre", titre: "Le code comme matière",
    description: "Initiation à p5.js et documentation",
    longueurChaine: 230
  },
  {
    date: "23 novembre", titre: "Jouer avec les règles et la friction",
    description: "Conditions, ralentir, résister, rejouer",
    longueurChaine: 500
  },
  {
    date: "30 novembre", titre: "Matérialiser une intention",
    description: "Geste, contexte, parcours",
    longueurChaine: 0
  },
  {
    date: "7 décembre", titre: "Ambiguïté et interprétation",
    description: "Observer, tester, ajuster",
    longueurChaine: 365
  },
  {
    date: "14 décembre", titre: "Atelier et présentation finale",
    description: "Démonstration, essai, discussion",
    longueurChaine: 110
  }
];

const sceneCinqSeances = Matter.Composite.create();
let formatSeances;

function lignesSeance(texte, largeur) {
  const lignes = [];
  let ligne = "";
  for (const mot of texte.split(" ")) {
    const essai = ligne ? ligne + " " + mot : mot;
    if (ligne && textWidth(essai) > largeur) {
      lignes.push(ligne);
      ligne = mot;
    } else {
      ligne = essai;
    }
  }
  lignes.push(ligne);
  return lignes;
}

function creerCinqSeances() {
  Matter.Composite.clear(sceneCinqSeances, false);
  const bord = min(marge, 12);
  const colonne = (width - 2 * bord) / seances.length;
  const largeur = colonne - 12;
  const corps = 16;
  const titre = 18;
  const retrait = 10;
  const largeurTexte = largeur - 2 * retrait;
  const espaceTitre = marge + 52 + extraTitleSpace;
  const enTete = 42;
  const contenus = [];
  let hauteur = 0;
  push();
  for (const seance of seances) {
    textStyle(BOLD);
    textSize(titre);
    const titreLignes = lignesSeance(seance.titre, largeurTexte);
    textStyle(NORMAL);
    textSize(corps);
    const descriptionLignes = lignesSeance(seance.description, largeurTexte);
    contenus.push({ titreLignes, descriptionLignes });
    hauteur = max(hauteur, enTete + titreLignes.length * (titre + 3) +
      8 + descriptionLignes.length * (corps + 3) + 10);
  }
  pop();
  const longueurMax = height - hauteur - 20;
  formatSeances = { largeur, hauteur, enTete, retrait, titre, corps, contenus };

  for (let i = 0; i < seances.length; i++) {
    const x = bord + (i + 0.5) * colonne;
    const chaine = map(seances[i].longueurChaine, 0, 500, espaceTitre, longueurMax, true);
    const panneau = Matter.Bodies.rectangle(x, chaine + hauteur / 2, largeur, hauteur, {
      label: seances[i].titre,
      
    });
    panneau.indiceSeance = i;
    const lien = Matter.Constraint.create({
      pointA: { x, y: 0 }, bodyB: panneau, pointB: { x: 0, y: -hauteur / 2 },
      length: chaine, stiffness: 1, damping: 0.06
    });
    Matter.Composite.add(sceneCinqSeances, [panneau, lien]);
  }
}

function textePanneauSeance(i, x, y) {
  const { titre, corps, contenus } = formatSeances;
  textStyle(BOLD);
  textSize(titre);
  textLeading(titre + 3);
  text(contenus[i].titreLignes.join("\n"), x, y);
  y += contenus[i].titreLignes.length * (titre + 3) + 6;
  textStyle(NORMAL);
  textSize(corps);
  textLeading(corps + 3);
  text(contenus[i].descriptionLignes.join("\n"), x, y);
}

function cinqSeances() {
  if (!formatSeances) return;
  const { largeur, hauteur, retrait, enTete } = formatSeances;
  push();
  imageMode(CENTER);
  for (const lien of sceneCinqSeances.constraints) {
    dessinerPerles(lien, diametrePerle);
    image(perle, lien.pointA.x, lien.pointA.y, diametrePerle, diametrePerle);
  }

  for (const panneau of sceneCinqSeances.bodies) {
    const i = panneau.indiceSeance;
    push();
    translate(panneau.position.x, panneau.position.y);
    rotate(panneau.angle);
    rectMode(CENTER);
    fill(255);
    stroke(0);
    strokeWeight(1);
    rect(0, 0, largeur, hauteur);
    const gauche = -largeur / 2 + retrait;
    const haut = -hauteur / 2;
    const diametre = 26;
    const xNumero = gauche + diametre / 2;
    const yNumero = haut + 20;
    circle(xNumero, yNumero, diametre);
    noStroke();
    fill(0);
    textStyle(NORMAL);
    textAlign(CENTER, CENTER);
    textSize(diametre * 0.65);
    text(String(i + 1), xNumero, yNumero);
    textAlign(RIGHT, CENTER);
    textSize(14);
    text(seances[i].date, -gauche, yNumero);
    textAlign(LEFT, TOP);
    textePanneauSeance(i, gauche, haut + enTete);
    pop();
  }
  rectMode(CORNER);
  noStroke();
  if (diapositives[diapo].afficherSigle !== false) {
    textStyle(NORMAL);
    textSize(20);
    const largeurSigle = textWidth(sigleCours);
    fill(255);
    rect(width - marge - largeurSigle - 2, marge, largeurSigle + 4, 25);
  }
  fill(0);
  stroke(255);
  strokeWeight(4);
  titreDiapo("Les cinq séances");
  pop();
}
