let cameraMain;
let modeleMain;
let mains = [];
let connexions = [];

let pince = false;
let doigtX = 0;
let doigtY = 0;
let mainVisible = false;

function demarrerMain() {
  doigtX = width / 2;
  doigtY = height / 2;

  cameraMain = createCapture(VIDEO, function() {
    modeleMain = ml5.handPose({
  maxHands: 1,
  minDetectionConfidence: 0.8,
  minTrackingConfidence: 0.8
}, function()  {
      connexions = modeleMain.getConnections();

      modeleMain.detectStart(cameraMain, function(resultats) {
        mains = resultats;
      });
    });
  });

  cameraMain.size(640, 480);
  cameraMain.hide();
}

function dessinerMain() {
  mainVisible = mains.length > 0;
  if (!mainVisible) return;

  // Adapter les points au canevas, en miroir.
  let points = mains[0].keypoints.map(function(point) {
    return {
      x: width - point.x * width / cameraMain.width,
      y: point.y * height / cameraMain.height
    };
  });

  doigtX = points[8].x;
  doigtY = points[8].y;

  // Distance entre le pouce et l’index.
  let distanceDoigts = dist(
    points[4].x, points[4].y,
    points[8].x, points[8].y
  );

  if (distanceDoigts < 30 && !pince) {
    pince = true;
    doigtPressed();
  }
  else if (distanceDoigts > 45 && pince) {
    pince = false;
    doigtReleased();
  }

  push();

  // Lignes entre les articulations.
  stroke(0, 255, 0);
  strokeWeight(2);

  for (let connexion of connexions) {
    let a = points[connexion[0]];
    let b = points[connexion[1]];
    line(a.x, a.y, b.x, b.y);
  }

  // Points blancs sur les articulations.
  noStroke();
  fill(255);

  for (let point of points) {
    circle(point.x, point.y, 8);
  }

  // Jaune si la pince est fermée, rouge sinon.
  if (pince) {
    fill(255, 255, 0);
  }
  else {
    fill(255, 0, 0);
  }

  circle(doigtX, doigtY, 16);

  pop();
}
