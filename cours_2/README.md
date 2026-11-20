
// variables synth
let osc;
let enveloppe;
let reverb;
let frequency;


// démarrer le synth - coller ceci dans setup 
// SETUP SYNTH 
enveloppe = new p5.Envelope();
reverb = new p5.Reverb(5);
enveloppe.setADSR(0.05, 1.0, 1.0, 1.0);

osc = new p5.Oscillator('sawtooth');
osc.disconnect();        // Retirer la sortie directe
osc.connect(enveloppe);  // Faire passer le son par l’enveloppe
reverb.wet(0.5);          // Mélange : 50 % d’effet

enveloppe.disconnect();
enveloppe.connect(reverb);
osc.amp(0.3);            // Volume du son
osc.start();