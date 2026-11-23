// Démonstration du cours 2, d'après la version ca96b6c.
let ellipsePosX;
let ellipsePosY;
let distanceMouseEllipse;
let vitesse;
let osc;
let enveloppe;
let reverb;
let frequency;
let bouton;
let activation;
let message;
let actif = false;
let demarrage = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  ellipsePosX = width / 2;
  ellipsePosY = height / 2;
  doigtX = width / 2;
  doigtY = height / 2;
  bouton = document.getElementById('demarrer');
  activation = document.getElementById('activation');
  message = document.getElementById('message');
  bouton.disabled = false;
  bouton.addEventListener('click', activerDemo);
}

function draw() {
  background(44, 56, 221);
  distanceMouseEllipse = dist(doigtX, doigtY, ellipsePosX, ellipsePosY);
  vitesse = map(distanceMouseEllipse, 0, width, 5, 0.001);

  if (actif) {
    if (doigtX > ellipsePosX) ellipsePosX = ellipsePosX - vitesse;
    else if (doigtX < ellipsePosX) ellipsePosX = ellipsePosX + vitesse;
    if (doigtY > ellipsePosY) ellipsePosY = ellipsePosY - vitesse;
    else if (doigtY < ellipsePosY) ellipsePosY = ellipsePosY + vitesse;

    if (pince) {
      ellipsePosX = lerp(ellipsePosX, doigtX, 0.2);
      ellipsePosY = lerp(ellipsePosY, doigtY, 0.2);
      background(255, 0, 0);
    }
  }

  push();
  noStroke();
  fill(255);
  ellipse(ellipsePosX, ellipsePosY, height * 200 / 640);
  pop();
  if (actif) dessinerMain();
}

async function activerDemo() {
  if (demarrage || actif) return;
  demarrage = true;
  bouton.disabled = true;
  message.textContent = 'Un instant…';
  try {
    await userStartAudio();
    demarrerSon();
    await demarrerMain();
    actif = true;
    activation.hidden = true;
    message.textContent = '';
  } catch (erreur) {
    arreterDemo();
    message.textContent = erreur.name === 'NotAllowedError'
      ? 'Accès à la caméra refusé.'
      : 'Impossible de démarrer. Réessayez.';
  } finally {
    demarrage = false;
    bouton.disabled = false;
  }
}

function demarrerSon() {
  enveloppe = new p5.Envelope();
  enveloppe.setADSR(0.05, 1.0, 1.0, 1.0);
  osc = new p5.Oscillator('sawtooth');
  osc.disconnect();
  osc.connect(enveloppe);
  reverb = new p5.Reverb(5);
  reverb.wet(0.5);
  enveloppe.disconnect();
  enveloppe.connect(reverb);
  osc.amp(0.3);
  osc.start();
}

function doigtPressed() {
  if (!actif || !osc) return;
  frequency = map(distanceMouseEllipse, 0, width, 820, 60);
  osc.freq(frequency);
  enveloppe.play();
}

function doigtReleased() {
  if (!actif || !osc) return;
  osc.freq(820);
  enveloppe.play();
}

function arreterDemo() {
  actif = false;
  arreterMain();
  if (osc) {
    osc.stop();
    osc.disconnect();
    osc = null;
  }
  if (reverb) {
    reverb.disconnect();
    reverb = null;
  }
  if (enveloppe) {
    enveloppe.disconnect();
    enveloppe = null;
  }
  if (activation) activation.hidden = false;
}

function windowResized() {
  ellipsePosX = ellipsePosX * windowWidth / width;
  ellipsePosY = ellipsePosY * windowHeight / height;
  doigtX = doigtX * windowWidth / width;
  doigtY = doigtY * windowHeight / height;
  resizeCanvas(windowWidth, windowHeight);
}

window.addEventListener('pagehide', arreterDemo);
