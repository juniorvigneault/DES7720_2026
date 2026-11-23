const largeurMinImage = 80;
const largeurMaxImage = 300;

// Chaque composante rouge, verte ou bleue peut aller de 0 à 255.
function composanteRGB() {
  return Math.floor(Math.random() * 256);
}

function separerLesLettres(texte) {
  const fragment = document.createDocumentFragment();

  for (const caractere of texte.textContent) {
    if (caractere.trim() === "") {
      fragment.append(caractere);
      continue;
    }

    const lettre = document.createElement("span");
    lettre.className = "lettre";
    lettre.textContent = caractere;
    lettre.addEventListener("pointerenter", () => {
      const couleur = `rgb(${composanteRGB()}, ${composanteRGB()}, ${composanteRGB()})`;
      lettre.style.setProperty("--couleur-survol", couleur);
    });
    fragment.append(lettre);
  }

  texte.replaceWith(fragment);
}

// Garder les liens et les sauts de ligne en place pendant le découpage.
for (const element of document.querySelectorAll("h1, h2, h3, p, li, a, .copier-courriel")) {
  for (const noeud of Array.from(element.childNodes)) {
    if (noeud.nodeType === Node.TEXT_NODE) {
      separerLesLettres(noeud);
    }
  }
}

// Pour choisir une image, ajouter data-image="assets/images/photo.jpg" au lien.
const racineDuSite = new URL("../", document.currentScript.src);
for (const lien of document.querySelectorAll("main:not(.liens-github) a[href]")) {
  const apercu = document.createElement("figure");
  apercu.className = "image-survol";
  apercu.hidden = true;

  const image = new Image();
  image.alt = "";
  image.src = new URL(lien.dataset.image || "assets/images/placeholder.svg", racineDuSite);
  apercu.append(image);
  if (lien.dataset.credit) {
    const credit = document.createElement("figcaption");
    credit.textContent = lien.dataset.credit;
    apercu.append(credit);
  }
  document.body.append(apercu);

  lien.addEventListener("mouseenter", () => {
    const largeur = document.documentElement.clientWidth;
    const hauteur = document.documentElement.clientHeight;
    const largeurAleatoire = largeurMinImage + Math.floor(Math.random() * (largeurMaxImage - largeurMinImage + 1));
    const taille = Math.min(largeur, hauteur, largeurAleatoire);
    apercu.style.width = taille + "px";
    apercu.hidden = false;
    image.style.maxHeight = taille + "px";
    apercu.style.left = Math.random() * (largeur - taille) + "px";
    apercu.style.top = Math.random() * (hauteur - taille) + "px";
  });

  lien.addEventListener("mouseleave", () => {
    apercu.hidden = true;
  });
}

const adresseCourriel = document.querySelector("footer .copier-courriel").textContent;

for (const bouton of document.querySelectorAll(".copier-courriel")) {
  const zone = bouton.closest("footer, .courriel-en-ligne");
  const message = zone.querySelector('[role="status"]');
  let finMessage;

  bouton.addEventListener("click", async () => {
    clearTimeout(finMessage);
    try {
      await navigator.clipboard.writeText(adresseCourriel);
      message.textContent = "adresse copiée ⭐";
    } catch {
      message.textContent = "Copie impossible. Sélectionnez l’adresse en bas de page.";
    }
    finMessage = setTimeout(() => { message.textContent = ""; }, 2500);
  });
}
