const mots = ["Cours 1", ":", "Le", "code", "comme", "matière", "—", "16", "novembre"];
const rallongeEntreMots = 0.5; // Pixels ajoutés à chaque lien. Augmenter pour que le titre pende plus bas.
const hauteurAttachesTitre = 50; // En % de la hauteur du canevas.
const tailleTexteBlocs = 20;

// Perles de la chaîne du titre et des cinq séances, en pixels.
const diametrePerle = 10;
const espacementPerles = 14;

const moteur = Matter.Engine.create({ constraintIterations: 8 });
const simulation = Matter.Runner.create();
let perle, tailleMot, prise;
let blocs = [];
let liens = [];

function creerChaine() {
  Matter.Composite.clear(scenesPhysiques[0], false);
  blocs = [];
  liens = [];
  prise = null;

  const bord = marge + 6;
  tailleMot = min(tailleTexteBlocs, (width - 2 * marge) / 28);
  textSize(tailleMot);
  textStyle(NORMAL);
  const largeurs = mots.map(mot => textWidth(mot) + tailleMot * 0.6);
  const espace = (width - 2 * bord - largeurs.reduce((a, b) => a + b, 0)) / (mots.length + 1);
  const milieu = height * hauteurAttachesTitre / 100;
  const gauche = Matter.Bodies.circle(bord, milieu, 3, { isStatic: true });
  const droite = Matter.Bodies.circle(width - bord, milieu, 3, { isStatic: true });
  let x = bord;

  for (let i = 0; i < mots.length; i++) {
    const largeur = largeurs[i];
    x += espace + largeur / 2;
    const y = milieu + sin(PI * x / width) * min(height * 0.12, width * 0.1);
    const bloc = Matter.Bodies.rectangle(x, y, largeur, tailleMot * 1.5, {
      label: mots[i]
    });
    bloc.largeur = largeur;
    blocs.push(bloc);
    x += largeur / 2;
  }

  const chaine = [gauche, ...blocs, droite];
  for (let i = 1; i < chaine.length; i++) {
    const avant = chaine[i - 1];
    const apres = chaine[i];
    liens.push(Matter.Constraint.create({
      bodyA: avant, pointA: { x: (avant.largeur || 0) / 2, y: 0 },
      bodyB: apres, pointB: { x: -(apres.largeur || 0) / 2, y: 0 },
      length: max(0, espace * 1.06 + rallongeEntreMots),
      stiffness: 1
    }));
  }
  Matter.Composite.add(scenesPhysiques[0], [...chaine, ...liens]);
}

function dessinerPerles(lien, diametre = diametrePerle * tailleMot / tailleTexteBlocs) {
  const a = Matter.Constraint.pointAWorld(lien);
  const b = Matter.Constraint.pointBWorld(lien);
  stroke(140);
  line(a.x, a.y, b.x, b.y);

  const nombre = max(1, round(lien.length / max(1, espacementPerles)));
  for (let i = 0; i < nombre; i++) {
    const t = (i + 0.5) / nombre;
    image(perle, lerp(a.x, b.x, t), lerp(a.y, b.y, t), diametre, diametre);
  }
}

function dessinerChaine() {
  if (!blocs.length) return;

  push();
  imageMode(CENTER);
  for (const lien of liens) {
    dessinerPerles(lien);
  }
  const gauche = liens[0].bodyA.position;
  const droite = liens[liens.length - 1].bodyB.position;
  image(perle, gauche.x, gauche.y, diametrePerle, diametrePerle);
  image(perle, droite.x, droite.y, diametrePerle, diametrePerle);

  for (const bloc of blocs) {
    dessinerBloc(bloc, tailleMot);
  }
  pop();
}

function dessinerBloc(bloc, taille, hauteur = taille * 1.5) {
  push();
  translate(bloc.position.x, bloc.position.y);
  rotate(bloc.angle);
  rectMode(CENTER);
  fill(255);
  stroke(0);
  rect(0, 0, bloc.largeur, hauteur);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(taille);
  text(bloc.label, 0, 0);
  pop();
}

function mousePressed() {
  if (diapositives[diapo].dessiner === pauseTissu) return saisirTissu();
  const scene = scenesPhysiques[diapo];
  if (!scene) return;
  const point = { x: mouseX, y: mouseY };
  const bloc = Matter.Query.point(scene.bodies, point).find(corps => !corps.isStatic);
  if (bloc) {
    if (scene === scenesPhysiques[1]) {
      for (const etape of scene.bodies) {
        if (etape.position.y <= bloc.position.y) Matter.Sleeping.set(etape, false);
      }
    }
    prise = Matter.Constraint.create({
      pointA: point,
      bodyB: bloc,
      pointB: Matter.Vector.sub(point, bloc.position),
      length: 0,
      stiffness: 0.12,
      damping: scene === scenesPhysiques[1] ? 0.35 : 0
    });
    Matter.Composite.add(moteur.world, prise);
  }
}

function mouseReleased() {
  if (diapositives[diapo].dessiner === pauseTissu) relacherTissu();
  if (!prise) return;
  const bloc = prise.bodyB;
  if (scenesPhysiques[1].bodies.includes(bloc)) {
    Matter.Body.setVelocity(bloc, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(bloc, 0);
  }
  Matter.Composite.remove(moteur.world, prise);
  prise = null;
}
