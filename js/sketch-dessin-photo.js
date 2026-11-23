let refletImage;
let fragmentSize = 60;
let fragmentX = 0;
let fragmentY = 0;

function preload() {
  refletImage = loadImage("../assets/documents/cours_1/assets/images/reflet.jpg");
}

function setup() {
  refletImage.resize(450, 300);
  createCanvas(refletImage.width * 2, refletImage.height).style("width", "100%").style("height", "auto");
  background(255, 0, 0);
  image(refletImage, 0, 0);
  noFill();
  stroke(255, 0, 0);
}

function mouseMoved() {
  image(refletImage, 0, 0);
  if (mouseX >= 0 && mouseX < refletImage.width && mouseY >= 0 && mouseY < height) {
    fragmentX = constrain(mouseX - fragmentSize / 2, 0, refletImage.width - fragmentSize);
    fragmentY = constrain(mouseY - fragmentSize / 2, 0, height - fragmentSize);
    rect(fragmentX, fragmentY, fragmentSize, fragmentSize);
  }
}

function mousePressed() {
  mouseMoved();
  if (mouseX >= 0 && mouseX < refletImage.width && mouseY >= 0 && mouseY < height) {
    copy(refletImage, fragmentX, fragmentY, fragmentSize, fragmentSize,
      refletImage.width + fragmentX, fragmentY, fragmentSize, fragmentSize);
  }
}

function mouseDragged() {
  mousePressed();
}
