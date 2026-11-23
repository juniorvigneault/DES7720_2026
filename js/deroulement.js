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
  titreDiapo("Déroulement du cours — " + dateCours);
  for (const bloc of scenesPhysiques[1].bodies) {
    dessinerBloc(bloc, tailleMot, hauteurEtape);
  }
}
