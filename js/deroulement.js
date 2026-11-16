const etapes = [
  "Retour sur le cours et objectifs de l’atelier",
  "Plan de cours et évaluations",
  "Le code comme matière : théorie et processus",
  "Initiation à p5.js",
  "Expérimentations",
  "Journal de bord",
  "À préparer pour la semaine prochaine"
].map((etape, i) => `${i + 1}. ${etape}`);

let hauteurEtape;

function creerPile() {
  const pile = scenesPhysiques[1];
  Matter.Composite.clear(pile, false);
  textStyle(NORMAL);
  textSize(tailleMot);
  hauteurEtape = min(tailleMot * 1.5, (height - marge - 30 - extraTitleSpace) / etapes.length);

  for (let i = 0; i < etapes.length; i++) {
    const largeur = textWidth(etapes[i]) + tailleMot * 0.6;
    const y = height - (etapes.length - i - 0.5) * hauteurEtape;
    const bloc = Matter.Bodies.rectangle(width / 2, y, largeur, hauteurEtape, {
      label: etapes[i],
      isSleeping: true,
      restitution: 0,
      frictionAir: 0
    });
    bloc.largeur = largeur;
    Matter.Composite.add(pile, bloc);
  }
}

function deroulement() {
  titreDiapo("Déroulement du cours — 16 novembre");
  for (const bloc of scenesPhysiques[1].bodies) {
    dessinerBloc(bloc, tailleMot, hauteurEtape);
  }
}
