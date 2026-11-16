// Nombre de particules dans chaque direction.
const colonnesTissu = 49;
const rangeesTissu = 25;
const raideurTissu = 0.12;
let tissuPause;

function preparerTissu() {
  const l = Math.min(width * 0.61, height * 1.22);
  const h = l * 0.47;
  const moteur = Matter.Engine.create({ gravity: { x: 0, y: 0, scale: 0 }, constraintIterations: 6 });
  const grille = [];
  const chaines = [];
  const liensPerles = [];
  const mobiles = [];
  const dernierX = colonnesTissu - 1;
  const dernierY = rangeesTissu - 1;
  tissuPause = { moteur, grille, chaines, liensPerles, mobiles, pas: l / dernierX, prise: null };

  function noeud(x, y, fixe = false) {
    const corps = Matter.Bodies.circle(x, y, 2.5, {
      isStatic: fixe, frictionAir: 0, collisionFilter: { mask: 0 }
    });
    Matter.Composite.add(moteur.world, corps);
    if (!fixe) mobiles.push(corps);
    return corps;
  }

  function relier(a, b, stiffness) {
    // Sans longueur imposée, Matter conserve la distance initiale de chaque segment.
    const lien = Matter.Constraint.create({ bodyA: a, bodyB: b, stiffness });
    Matter.Composite.add(moteur.world, lien);
    return lien;
  }

  for (let j = 0; j <= dernierY; j++) {
    const ligne = [];
    grille.push(ligne);
    for (let i = 0; i <= dernierX; i++) {
      const u = i / dernierX;
      const v = j / dernierY;
      const courbe = Math.sin(Math.PI * u);
      const x = width / 2 + (u - 0.5) * (l - 0.047 * l * Math.sin(Math.PI * v));
      const y = height / 2 + (v - 0.5) * h + l * (0.029 * courbe - 0.035 * (u - 0.5) + 0.008 * Math.sin(3 * Math.PI * u + v) * courbe);
      const p = noeud(x, y);
      ligne.push(p);
      if (i) relier(ligne[i - 1], p, raideurTissu);
      if (j) relier(grille[j - 1][i], p, raideurTissu);
    }
  }

  for (const [i, j] of [[0, 0], [dernierX, 0], [dernierX, dernierY], [0, dernierY]]) {
    const coin = grille[j][i];
    const x = i ? width + 10 : -10;
    const y = j ? height + 10 : -10;
    const dx = coin.position.x - x;
    const dy = coin.position.y - y;
    const distance = Math.hypot(dx, dy);
    const nombre = Math.max(5, Math.round(distance / espacementPerles));
    const chaine = [noeud(x, y, true)];
    // La courbe initiale donne du mou même en apesanteur.
    for (let k = 1; k <= nombre; k++) {
      const u = k / nombre;
      const mou = 0.17 * Math.sin(Math.PI * u) * Math.sign(dx);
      const p = k === nombre ? coin : noeud(x + dx * u - dy * mou, y + dy * u + dx * mou);
      liensPerles.push(relier(chaine[k - 1], p, 0.90));
      chaine.push(p);
    }
    chaines.push(chaine);
  }
  tissuPause.bord = [
    ...grille[0], ...grille.slice(1).map(ligne => ligne[dernierX]),
    ...grille[dernierY].slice(0, dernierX).reverse(), ...grille.slice(1, dernierY).reverse().map(ligne => ligne[0])
  ];
  tissuPause.lettres = preparerLettresPause(grille, l, h);
}

// On attache les contours de la police aux particules qui les entourent.
function preparerLettresPause(grille, largeur, hauteur) {
  const texte = policeBilles.font.getPath("Pause ?", 0, 0, 100);
  const boite = texte.getBoundingBox();
  const zoom = largeur * 0.75 / (boite.x2 - boite.x1);
  const centreX = (boite.x1 + boite.x2) / 2;
  const centreY = (boite.y1 + boite.y2) / 2;
  const chemin = document.createElementNS("http://www.w3.org/2000/svg", "path");

  return texte.toPathData().match(/M[^M]+/g).map(contour => {
    chemin.setAttribute("d", contour);
    const longueur = chemin.getTotalLength();
    const nombre = Math.ceil(longueur * zoom / 2);
    const points = [];
    for (let k = 0; k < nombre; k++) {
      const pt = chemin.getPointAtLength(longueur * k / nombre);
      const x = (0.5 + (pt.x - centreX) * zoom / largeur) * (colonnesTissu - 1);
      const y = (0.5 + (pt.y - centreY) * zoom / hauteur) * (rangeesTissu - 1);
      const i = Math.floor(x), j = Math.floor(y);
      const u = x - i, v = y - j;
      points.push({
        coins: [grille[j][i], grille[j][i + 1], grille[j + 1][i], grille[j + 1][i + 1]],
        poids: [(1 - u) * (1 - v), u * (1 - v), (1 - u) * v, u * v]
      });
    }
    return points;
  });
}

function saisirTissu() {
  if (!tissuPause || mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  relacherTissu();
  let proche;
  let rayon = Math.max(13, tissuPause.pas * 0.82);
  for (const p of tissuPause.mobiles) {
    const d = Math.hypot(mouseX - p.position.x, mouseY - p.position.y);
    if (d < rayon) { proche = p; rayon = d; }
  }
  if (!proche) return;
  tissuPause.prise = Matter.Constraint.create({
    pointA: { x: mouseX, y: mouseY }, bodyB: proche,
    pointB: { x: mouseX - proche.position.x, y: mouseY - proche.position.y },
    angularStiffness: 1, length: 0, stiffness: 0.35
  });
  Matter.Composite.add(tissuPause.moteur.world, tissuPause.prise);
}

function relacherTissu() {
  if (!tissuPause?.prise) return;
  Matter.Composite.remove(tissuPause.moteur.world, tissuPause.prise);
  tissuPause.prise = null;
}

function pauseTissu() {
  const { moteur, bord, lettres, chaines, liensPerles, prise } = tissuPause;
  if (prise) { prise.pointA.x = mouseX; prise.pointA.y = mouseY; }
  const dt = Math.min(Math.max(deltaTime || 16.67, 1), 1000 / 30);
  const tours = Math.ceil(dt / (1000 / 60));
  for (let i = 0; i < tours; i++) Matter.Engine.update(moteur, dt / tours);

  const c = drawingContext;
  push();
  imageMode(CENTER);
  for (const lien of liensPerles) dessinerPerles(lien, diametrePerle);
  pop();
  c.save();
  c.beginPath();
  bord.forEach(({ position }, i) => i ? c.lineTo(position.x, position.y) : c.moveTo(position.x, position.y));
  c.closePath();
  c.fillStyle = "#fff";
  c.fill();
  c.strokeStyle = "#000";
  c.lineWidth = 1;
  c.stroke();
  c.beginPath();
  for (const contour of lettres) {
    for (let i = 0; i < contour.length; i++) {
      const { coins, poids } = contour[i];
      let x = 0, y = 0;
      for (let k = 0; k < 4; k++) {
        x += coins[k].position.x * poids[k];
        y += coins[k].position.y * poids[k];
      }
      if (i === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
    c.closePath();
  }
  c.fillStyle = "#000";
  c.fill("evenodd");
  c.restore();
  push();
  imageMode(CENTER);
  for (const chaine of chaines) {
    const p = chaine[chaine.length - 1].position;
    image(perle, p.x, p.y, diametrePerle, diametrePerle);
  }
  pop();
  push();
  fill(45);
  noStroke();
  textStyle(NORMAL);
  textAlign(LEFT, BOTTOM);
  textSize(16);
  text("15 minutes", marge, height - marge);
  pop();
}
