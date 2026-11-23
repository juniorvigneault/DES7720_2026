// Suivi de la main du cours 2, démarré uniquement à la demande.
let cameraMain;
let modeleMain;
let fluxMain;
let mains = [];
let connexions = [];
let pince = false;
let doigtX = 0;
let doigtY = 0;
let mainVisible = false;
let sessionMain = 0;

async function demarrerMain() {
  let session = ++sessionMain;
  doigtX = width / 2;
  doigtY = height / 2;
  let flux = await navigator.mediaDevices.getUserMedia({
    video: { width: 640, height: 480 },
    audio: false
  });
  if (session !== sessionMain) {
    flux.getTracks().forEach(function(piste) { piste.stop(); });
    throw new Error('Démarrage annulé');
  }
  fluxMain = flux;
  cameraMain = document.createElement('video');
  cameraMain.width = 640;
  cameraMain.height = 480;
  cameraMain.muted = true;
  cameraMain.playsInline = true;
  cameraMain.hidden = true;
  cameraMain.srcObject = fluxMain;
  document.body.appendChild(cameraMain);
  await cameraMain.play();
  if (session !== sessionMain) throw new Error('Démarrage annulé');
  await new Promise(function(resolve, reject) {
    modeleMain = ml5.handPose({
      maxHands: 1,
      minDetectionConfidence: 0.8,
      minTrackingConfidence: 0.8
    }, function() {
      if (session !== sessionMain) {
        reject(new Error('Démarrage annulé'));
        return;
      }
      try {
        connexions = modeleMain.getConnections();
        modeleMain.detectStart(cameraMain, function(resultats) {
          if (session === sessionMain) mains = resultats;
        });
        resolve();
      } catch (erreur) {
        reject(erreur);
      }
    });
  });
}

function dessinerMain() {
  mainVisible = mains.length > 0;
  if (!mainVisible) return;
  let scale = Math.min(width / cameraMain.videoWidth, height / cameraMain.videoHeight);
  let points = mains[0].keypoints.map(function(point) {
    return {
      x: width / 2 + (cameraMain.videoWidth / 2 - point.x) * scale,
      y: height / 2 + (point.y - cameraMain.videoHeight / 2) * scale
    };
  });
  doigtX = points[8].x;
  doigtY = points[8].y;
  let distanceDoigts = dist(points[4].x, points[4].y, points[8].x, points[8].y);
  if (distanceDoigts < 30 && !pince) {
    pince = true;
    doigtPressed();
  } else if (distanceDoigts > 45 && pince) {
    pince = false;
    doigtReleased();
  }
  push();
  stroke(0, 255, 0);
  strokeWeight(2);
  for (let connexion of connexions) {
    let a = points[connexion[0]];
    let b = points[connexion[1]];
    line(a.x, a.y, b.x, b.y);
  }
  noStroke();
  fill(255);
  for (let point of points) circle(point.x, point.y, 8);
  if (pince) fill(255, 255, 0);
  else fill(255, 0, 0);
  circle(doigtX, doigtY, 16);
  pop();
}

function arreterMain() {
  sessionMain = sessionMain + 1;
  if (modeleMain && typeof modeleMain.detectStop === 'function') {
    try { modeleMain.detectStop(); } catch (erreur) { /* Le flux est arrêté ci-dessous. */ }
  }
  if (fluxMain) fluxMain.getTracks().forEach(function(piste) { piste.stop(); });
  if (cameraMain) {
    cameraMain.pause();
    cameraMain.srcObject = null;
    cameraMain.remove();
  }
  cameraMain = null;
  fluxMain = null;
  modeleMain = null;
  mains = [];
  connexions = [];
  pince = false;
  mainVisible = false;
}
