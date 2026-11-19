// DES7720 — EXERCICE 3 — Conditions, animations et sons

let ellipsePosX;
let ellipsePosY;

// roule 1 fois au début du script         
function setup() {

createCanvas(640,640);

ellipsePosX= width/2;
ellipsePosY = height/2

}

// Dessiner en boucle.
function draw() {
background(44, 56, 221);

if (mouseX > ellipsePosX) {
ellipsePosX = ellipsePosX -1;
}
else if(mouseX < ellipsePosX) {
ellipsePosX = ellipsePosX + 1;
} 


if (mouseY > ellipsePosY) {
ellipsePosY = ellipsePosY -1;
}
else if(mouseY < ellipsePosY) {
ellipsePosY = ellipsePosY + 1;
} 

// ellipsePosY = ellipsePosY +1;
ellipse(ellipsePosX,ellipsePosY,200);
}




