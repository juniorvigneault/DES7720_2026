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
for (const element of document.querySelectorAll("h1, p, li, a")) {
  for (const noeud of Array.from(element.childNodes)) {
    if (noeud.nodeType === Node.TEXT_NODE) {
      separerLesLettres(noeud);
    }
  }
}
