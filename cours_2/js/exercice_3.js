// DES7720 — EXERCICE 3 — Conditions, animations et sons

let ellipsePosX;
let ellipsePosY;

let distanceMouseEllipse;
let vitesse;
// roule 1 fois au début du script         
function setup() {

createCanvas(640,640);

ellipsePosX= width/2;
ellipsePosY = height/2

}

// Dessiner en boucle.
function draw() {
background(44, 56, 221);


distanceMouseEllipse = dist(mouseX, mouseY,ellipsePosX, ellipsePosY);

// console.log(distanceMouseEllipse);


vitesse = map(distanceMouseEllipse, 0, width, 5, 0.001);



if (mouseX > ellipsePosX) {
ellipsePosX = ellipsePosX - vitesse;
}
else if(mouseX < ellipsePosX) {
ellipsePosX = ellipsePosX + vitesse;
} 


if (mouseY > ellipsePosY) {
ellipsePosY = ellipsePosY - vitesse;
}
else if(mouseY < ellipsePosY) {
ellipsePosY = ellipsePosY + vitesse;
} 

// ellipsePosY = ellipsePosY +1;
ellipse(ellipsePosX,ellipsePosY,200);
}




