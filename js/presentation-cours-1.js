const dateCours = "16 novembre";
const dateProchainCours = "23 novembre";
const mots = ["Cours 1", ":", "Le", "code", "comme", "matière", "—", "16", "novembre"];

const etapes = [
  "Retour sur le cours et objectifs de l’atelier",
  "Plan de cours et évaluations",
  "Le code comme matière : théorie et processus",
  "Initiation à p5.js",
  "Expérimentations",
  "Journal de bord",
  "À préparer pour la semaine prochaine"
].map((etape, i) => `${i + 1}. ${etape}`);

const consignesFin = [
  "Terminez votre variation de dessin_souris, faites un commit et écrivez dans votre journal. Nous regarderons les sketchs en début de cours.",
  "Faites un push, puis envoyez-moi par courriel les liens de votre dépôt GitHub et de votre site GitHub Pages.",
  "Consultez les vidéos du cours 2 à partir du mercredi 18 novembre."
];

const diapositives = [
  { dessiner: accueil, afficherSigle: true },
  { dessiner: deroulement, afficherSigle: true },
  { dessiner: objectifAtelier, afficherSigle: true },
  { dessiner: codeCreatif, afficherSigle: true },
  { dessiner: cinqSeances, afficherSigle: true },
  { dessiner: parcoursProjet, afficherSigle: true },
  { dessiner: evaluationAtelier, afficherSigle: true },
  { dessiner: projetFinal, afficherSigle: true },
  { modele: "voxel-editor", afficherSigle: true },
  { modele: "typographie", afficherSigle: true },
  { modele: "shake-and-scroll", afficherSigle: true },
  { modele: "do-not-touch", afficherSigle: true },
  { modele: "prototyper-en-code" },
  { modele: "intention-de-design" },
  { modele: "mdm" },
  { modele: "mdm-barr-curseur" },
  { modele: "mdm-barr" },
  { modele: "mdm-atelier" },
  { dessiner: pauseTissu, preparer: preparerTissu },
  { modele: "atelier-intro" },
  { modele: "journal" },
  { dessiner: finAtelier, preparer: preparerBye }
];
const sigleCours = "DES7720";
const extraTitleSpace = 10;
let diapo = 0;

let marge;
let murs = [];
let tailleScenesAdaptatives;
let policePrete = false;
const scenesPhysiques = [Matter.Composite.create(), Matter.Composite.create(), null, null, sceneCinqSeances];
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
  Matter.Runner.run(simulation, moteur);
  marge = parseFloat(getComputedStyle(cadre).getPropertyValue("--marge"));
  document.fonts.load("20px Habitus").then(() => {
    policePrete = true;
    preparerScenes();
  });
}

function draw() {
  background(255);
  if (prise) {
    const x = scenesPhysiques[diapo] === sceneCinqSeances ? mouseX : constrain(mouseX, 0, width);
    prise.pointA = { x, y: constrain(mouseY, 0, height) };
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
}

function windowResized() {
  if (diapositives[diapo].dessiner !== cinqSeances) ajusterFormatCanevas();
}

function ajusterFormatCanevas() {
  resizeCanvas(cadre.clientWidth, cadre.clientHeight, true);
  marge = parseFloat(getComputedStyle(cadre).getPropertyValue("--marge"));
  preparerScenes();
  diapositives[diapo].preparer?.();
}

function preparerScenes() {
  if (!policePrete) return;
  mouseReleased();
  if (diapositives[diapo].dessiner === cinqSeances) {
    if (!formatSeances) creerCinqSeances();
  } else if (tailleScenesAdaptatives?.largeur !== width || tailleScenesAdaptatives?.hauteur !== height ||
             tailleScenesAdaptatives?.marge !== marge) {
    creerChaine();
    creerPile();
    tailleScenesAdaptatives = { largeur: width, hauteur: height, marge };
  }
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
    const limites = scene === sceneCinqSeances ? murs.slice(0, 2) : murs;
    Matter.Composite.add(moteur.world, limites);
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
  const fixe = diapositives[diapo].dessiner === cinqSeances;
  if (fixe !== document.body.classList.contains("vue-cinq-seances")) {
    document.body.classList.toggle("vue-cinq-seances", fixe);
    ajusterFormatCanevas();
  } else {
    activerScene();
    diapositives[diapo].preparer?.();
  }
  afficherExemple();
  document.getElementById("precedente").disabled = diapo === 0;
  document.getElementById("suivante").disabled = diapo === diapositives.length - 1;
}

function reinitialiserDiapo() {
  if (diapositives[diapo].preparer) {
    diapositives[diapo].preparer();
    return;
  }
  if (diapositives[diapo].modele) {
    afficherExemple();
    return;
  }
  if (!murs.length) return;
  mouseReleased();
  const page = diapositives[diapo].dessiner;
  if (page === accueil) creerChaine();
  if (page === deroulement) creerPile();
  if (page === cinqSeances) creerCinqSeances();
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

function texteDiapo(titre, paragraphe, largeurMax = width, taille = 17.33) {
  const y = titreDiapo(titre);
  textSize(taille);
  textLeading(round(taille * 1.27));
  text(paragraphe, marge, y + 30 + extraTitleSpace, min(largeurMax, width - 2 * marge));
}

function accueil() {
  textSize(20);
  textStyle(NORMAL);
  textLeading(25);
  dessinerChaine();
  text("Junior Vigneault", marge, height - marge - 25);
}

function texteAtelier(titre, paragraphes, paragraphBreak = "\n\n") {
  const taille = min(17.33, width / 21, (height - extraTitleSpace) / 18);
  texteDiapo(titre, paragraphes.join(paragraphBreak), 620, taille);
}

function objectifAtelier() {
  texteAtelier("Objectif de l’atelier", [
    "Au fil des cinq séances, vous découvrirez le code créatif en réalisant des sketchs interactifs avec p5.js.",
    "Vous modifiez le code, essayez l’interaction et notez ce qui change. Ces observations vous aident à préciser une intention de design et à choisir une piste.",
    "Vous situez ensuite l’interaction dans son contexte. Une carte d’expérience et des tests UX vous aident à affiner le prototype. Au dernier cours, vous en présentez une version de travail, qui peut porter sur une seule interaction."
  ]);
}

function codeCreatif() {
  texteAtelier("Code créatif", [
    "Quel que soit votre niveau en programmation, vous explorerez le code par la pratique. À chaque essai, vous mettrez en relation le comportement du sketch et l’expérience que vous souhaitez proposer.",
    "Je présenterai brièvement certaines notions techniques pour vous laisser le temps de faire fonctionner votre sketch et d’explorer vos propres idées.",
    "Pour approfondir un point de programmation, vous pouvez me poser vos questions individuellement ou consulter la bibliographie du cours."
  ]);
}

function parcoursProjet() {
  texteAtelier("Du premier sketch au prototype", [
    "Cours 1 et 2 · 16 et 23 novembre — Prendre en main p5.js, modifier un sketch et documenter ses essais.",
    "Cours 3 · 30 novembre — Choisir un concept, esquisser le parcours utilisateur, puis préciser l’expérience visée et les outils nécessaires.",
    "Cours 4 et 5 · 7 et 14 décembre — Développer, tester et ajuster le prototype. Le 14 décembre, la première moitié du cours est consacrée à la clinique technique et la seconde aux présentations.",
    "21 décembre · Remise de la documentation finale dans le dépôt GitHub."
  ]);
}

function evaluationAtelier() {
  texteAtelier("Évaluation de l’atelier", [
    "L’atelier compte pour 50 % de la note finale. Dès le premier cours, créez et clonez votre dépôt GitHub. Il réunira le prototype final et la documentation du processus.",
    "20 % · Documentation du processus — Les exercices, les commits, les captures d’écran et le journal de bord rendent compte de l’évolution du projet.",
    "10 % · Qualité du prototype — L’évaluation porte sur la recherche, le développement, l’originalité de l’interaction et le fonctionnement du prototype.",
    "20 % · Réflexion sur le design — Expliquez comment vos essais, vos tests d’expérience utilisateur et vos réflexions ont fait évoluer votre intention de design."
  ]);
}

function projetFinal() {
  texteAtelier("Projet final", [
    "À partir de vos expérimentations en code créatif, concevez un prototype d’expérience interactive numérique qu’une autre personne pourra essayer.",
    "Situez l’interaction dans un contexte précis. Pensez à un bureau partagé, à une salle de projection immersive, à un site web expérimental, à un téléphone utilisé dans l’autobus ou à un four intelligent.",
    "Choisissez une entrée, par exemple une souris, un écran tactile, un clavier, une caméra, un capteur ou un micro. Comment le système y répond-il ? Quel effet cette réponse a-t-elle sur l’expérience ?",
    "Développez votre prototype en p5.js à partir d’un exercice ou d’un nouveau sketch. Vous pouvez y intégrer d’autres technologies."
  ], height < 300 || width < 400 ? "\n" : "\n\n");
}
