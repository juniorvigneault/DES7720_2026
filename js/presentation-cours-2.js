const dateCours = "23 novembre";
const dateProchainCours = "30 novembre";
const mots = ["Cours 2", ":", "Friction", "et", "résistance", "—", "23", "novembre"];
const etapes = [
  "Retour sur l’exercice dessin : discussion",
  "Designing Friction",
  "Projet final",
  "Pause — 15 minutes",
  "Retour sur le synthé main",
  "Retour dans le code",
  "Atelier : une variation du synthé",
  "Journal et semaine prochaine"
].map((etape, i) => `${i + 1}. ${etape}`);
const consignesFin = [
  "Arrivez avec une idée de départ pour le projet : un principe de friction parmi les cinq, une interaction et une technologie à explorer.",
  "Regardez la vidéo de la semaine et réalisez l’exercice proposé.",
  "Si ce n’est pas déjà fait, envoyez vos liens GitHub et GitHub Pages à vigneault.junior@uqam.ca.",
  "Nous commencerons le travail en atelier sur le projet final."
];

const diapositives = [
  { dessiner: accueil, afficherSigle: true },
  { dessiner: deroulement, afficherSigle: true },
  { modele: "retour-exercices" },
  { dessiner: titreFriction },
  { modele: "friction-intro" },
  { modele: "performance" },
  { modele: "discussion-performance" },
  { modele: "principes-friction" },
  { modele: "projet-eyecam" },
  { modele: "projet-tourmente" },
  { modele: "projet-as-slow-as-possible" },
  { modele: "projet-artist-is-present" },
  { modele: "projet-heart-from-space" },
  { modele: "projet-tear-gun" },
  { modele: "projet-say-one-more-thing" },
  { modele: "projet-do-not-draw" },
  { modele: "projet-piano-stairs" },
  { modele: "projet-final" },
  { modele: "technologies" },
  { modele: "carte-ux" },
  { modele: "carte-collage" },
  { modele: "carte-sensible" },
  { modele: "carte-face-machine" },
  { modele: "test-observation" },
  { modele: "journal-commits" },
  { modele: "remise" },
  { dessiner: pauseTissu, preparer: preparerTissu },
  { modele: "retour-synthe" },
  { modele: "retour-code" },
  { modele: "atelier-friction" },
  { modele: "journal" },
  { modele: "ressources-fin" },
  { dessiner: finAtelier, preparer: preparerBye }
];
const sigleCours = "DES7720";
const extraTitleSpace = 10;
let diapo = 0;
let marge;
let murs = [];
let policePrete = false;
const scenesPhysiques = [Matter.Composite.create(), Matter.Composite.create()];
scenesPhysiques[diapositives.findIndex(page => page.dessiner === finAtelier)] = sceneBye;
const cadre = document.getElementById("canevas");

function preload() {
  policeBilles = loadFont("../fonts/Habitus-Regular.otf");
  perle = loadImage("../assets/images/perle.png");
}

function setup() {
  createCanvas(cadre.clientWidth, cadre.clientHeight).parent(cadre);
  textAlign(LEFT, TOP);
  textFont("Habitus");
  fill(0);
  noStroke();
  marge = parseFloat(getComputedStyle(cadre).getPropertyValue("--marge"));
  Matter.Runner.run(simulation, moteur);
  document.fonts.load("20px Habitus").then(() => {
    policePrete = true;
    preparerScenes();
  });
}

function draw() {
  background(255);
  if (prise) {
    prise.pointA = { x: constrain(mouseX, 0, width), y: constrain(mouseY, 0, height) };
  }
  const page = diapositives[diapo];
  if (page.dessiner) page.dessiner();
  if (page.afficherSigle !== false) {
    push();
    textSize(20);
    textStyle(NORMAL);
    textAlign(RIGHT, TOP);
    text(sigleCours, width - marge, marge + 2);
    pop();
  }
  push();
  fill(0);
  noStroke();
  textSize(14);
  textStyle(NORMAL);
  textAlign(RIGHT, BOTTOM);
  text(diapo + 1, width - marge, height - marge);
  pop();
}

function windowResized() {
  mouseReleased();
  resizeCanvas(cadre.clientWidth, cadre.clientHeight, true);
  marge = parseFloat(getComputedStyle(cadre).getPropertyValue("--marge"));
  preparerScenes();
  diapositives[diapo].preparer?.();
  activerScene();
}

function preparerScenes() {
  if (!policePrete) return;
  mouseReleased();
  creerChaine();
  creerPile();
  const fixe = { isStatic: true };
  murs = [
    Matter.Bodies.rectangle(width / 2, -50, width + 200, 100, fixe),
    Matter.Bodies.rectangle(width / 2, height + 50, width + 200, 100, fixe),
    Matter.Bodies.rectangle(-50, height / 2, 100, height, fixe),
    Matter.Bodies.rectangle(width + 50, height / 2, 100, height, fixe)
  ];
  activerScene();
}

function activerScene() {
  const scene = scenesPhysiques[diapo];
  moteur.gravity.y = scene === sceneBye ? 0 : 1;
  Matter.Composite.clear(moteur.world, false);
  Matter.Engine.clear(moteur);
  simulation.enabled = Boolean(scene);
  if (scene) {
    Matter.Composite.add(moteur.world, murs);
    Matter.Composite.add(moteur.world, scene);
  }
}

function afficherExemple() {
  const exemple = document.getElementById("exemple");
  const modele = diapositives[diapo].modele;
  exemple.replaceChildren();
  if (modele) exemple.append(document.getElementById(modele).content.cloneNode(true));
  exemple.scrollTop = 0;
}

function changerDiapo(pas) {
  mouseReleased();
  diapo = constrain(diapo + pas, 0, diapositives.length - 1);
  diapositives[diapo].preparer?.();
  activerScene();
  afficherExemple();
  document.getElementById("precedente").disabled = diapo === 0;
  document.getElementById("suivante").disabled = diapo === diapositives.length - 1;
}

function reinitialiserDiapo() {
  mouseReleased();
  const page = diapositives[diapo];
  if (page.modele) {
    afficherExemple();
    return;
  }
  if (page.preparer) page.preparer();
  if (page.dessiner === accueil) creerChaine();
  if (page.dessiner === deroulement) creerPile();
  activerScene();
}

function titreDiapo(titre) {
  textSize(20);
  textStyle(BOLD);
  let y = marge + 2;
  if (diapositives[diapo].afficherSigle !== false &&
      textWidth(titre) + textWidth(sigleCours) + 10 > width - 2 * marge) {
    y += 25;
  }
  textLeading(25);
  text(titre, marge, y, width - 2 * marge);
  textStyle(NORMAL);
  return y;
}

function accueil() {
  textSize(20);
  textStyle(NORMAL);
  textLeading(25);
  dessinerChaine();
  text("Junior Vigneault", marge, height - marge - 25);
}

function titreFriction() {
  push();
  fill(0);
  noStroke();
  textSize(72);
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  text("Designing Friction", width / 2, height / 2);
  pop();
}
