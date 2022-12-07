/*
generate repetitive YAML rules for a given CSP
*/

const csps = [
  "ouvriers",
  "employés",
  "techniciens et agents de maîtrise",
  "ingénieurs et cadres",
];

const tranchesAge = [
  "moins de 30 ans",
  "de 30 à 39 ans",
  "de 40 à 49 ans",
  "de 50 ans et plus",
];

const getCSPTrancheRules = (csp, tranche) => `
index . écart rémunérations . ${csp} . ${tranche}: oui
index . écart rémunérations . ${csp} . ${tranche} . remunération annuelle brute moyenne par EQTP: oui
index . écart rémunérations . ${csp} . ${tranche} . nombre salariés: oui

index . écart rémunérations . ${csp} . ${tranche} . validite:
  toutes ces conditions:
    - nombre salariés . hommes >= 3
    - nombre salariés . femmes >= 3

index . écart rémunérations . ${csp} . ${tranche} . écart rémunération:
  applicable si:
    toutes ces conditions:
      - remunération annuelle brute moyenne par EQTP . hommes > 0
      - remunération annuelle brute moyenne par EQTP . femmes > 0
  valeur: (remunération annuelle brute moyenne par EQTP . hommes - remunération annuelle brute moyenne par EQTP . femmes) / remunération annuelle brute moyenne par EQTP . hommes
  unité: "%"
  arrondi: 1 décimale

index . écart rémunérations . ${csp} . ${tranche} . écart rémunération . abs:
  variations:
    - si: écart rémunération > 0
      alors: écart rémunération
    - sinon: écart rémunération * -1
  unité: "%"
  arrondi: 1 décimale

index . écart rémunérations . ${csp} . ${tranche} . écart rémunération . pertinent:
  variations:
    - si: abs > options . seuil de pertinence
      alors:
        variations:
          - si: écart rémunération > 0
            alors: écart rémunération - options . seuil de pertinence
          - sinon: écart rémunération + options . seuil de pertinence
    - sinon: écart rémunération
  unité: "%"
  arrondi: 1 décimale

index . écart rémunérations . ${csp} . ${tranche} . effectifs:
  somme:
    - nombre salariés . hommes
    - nombre salariés . femmes

index . écart rémunérations . ${csp} . ${tranche} . effectifs . valides:
  variations:
    - si: validite
      alors: effectifs
    - sinon: 0

index . écart rémunérations . ${csp} . ${tranche} . écart pondéré:
  unité: "%"
  arrondi: 1 décimale
  variations:
    - si: validite
      alors: écart rémunération . pertinent * effectifs / index . écart rémunérations . effectifs . valides
    - sinon: 0

index . écart rémunérations . ${csp} . ${tranche} . remunération annuelle brute moyenne par EQTP . hommes: 0
index . écart rémunérations . ${csp} . ${tranche} . remunération annuelle brute moyenne par EQTP . femmes: 0
index . écart rémunérations . ${csp} . ${tranche} . nombre salariés . hommes: 0
index . écart rémunérations . ${csp} . ${tranche} . nombre salariés . femmes: 0

`;

const getCSPS = () => {
  const cspTranches = csps.flatMap((csp) =>
    tranchesAge.map((tranche) => `${csp} . ${tranche}`)
  );

  const CSPrules = csps
    .flatMap((csp) => [
      `index . écart rémunérations . ${csp}: oui`,
      ...tranchesAge.map((tranche) => `${getCSPTrancheRules(csp, tranche)}`),
    ])
    .join("\n");

  return `index . écart rémunérations: oui
${CSPrules}

index . écart rémunérations . écart pondéré:
  somme:
${cspTranches.map((rule) => `    - ${rule} . écart pondéré`).join("\n")}

index . écart rémunérations . effectifs:
  somme:
${cspTranches.map((rule) => `    - ${rule} . effectifs`).join("\n")}

index . écart rémunérations . effectifs . valides:
  somme:
${cspTranches.map((rule) => `    - ${rule} . effectifs . valides`).join("\n")}


index . écart augmentations: oui
index . écart promotions: oui

  ${csps
    .map(
      (csp) => `
index . écart augmentations . ${csp}: oui

index . écart augmentations . ${csp} . hommes:
  question: taux d'augmentation pour les hommes (proportion de salariés augmentés)
  valeur: 0
  unité: "%"

index . écart augmentations . ${csp} . femmes:
  question: taux d'augmentation pour les femmes (proportion de salariés augmentés)
  valeur: 0
  unité: "%"

index . écart augmentations . ${csp} . valide:
  toutes ces conditions:
    - index . écart rémunérations . ${csp} . effectifs . hommes >= 10 
    - index . écart rémunérations . ${csp} . effectifs . femmes >= 10 

index . écart augmentations . ${csp} . effectifs:
    valeur: 0

index . écart augmentations . ${csp} . effectifs . valides:
    applicable si: valide
    remplace: effectifs
    somme:
    - index . écart rémunérations . ${csp} . effectifs . hommes
    - index . écart rémunérations . ${csp} . effectifs . femmes

index . écart augmentations . ${csp} . écart:
  applicable si:
    toutes ces conditions:
      - hommes >= 0
      - femmes >= 0
  somme:
      - hommes
      - -1 * femmes
  unité: "%"
  
index . écart augmentations . ${csp} . écart pondéré:
  applicable si: valide
  valeur : écart * effectifs . valides / index . écart augmentations . effectifs . valides
  unité: "%"

index . écart promotions . ${csp}: oui

index . écart promotions . ${csp} . hommes:
  question: taux d'augmentation pour les hommes (proportion de salariés augmentés)
  valeur: 0
  unité: "%"

index . écart promotions . ${csp} . femmes:
  question: taux d'augmentation pour les femmes (proportion de salariés augmentés)
  valeur: 0
  unité: "%"

index . écart promotions . ${csp} . valide:
  toutes ces conditions:
    - index . écart rémunérations . ${csp} . effectifs . hommes >= 10 
    - index . écart rémunérations . ${csp} . effectifs . femmes >= 10 

index . écart promotions . ${csp} . effectifs:
    valeur: 0

index . écart promotions . ${csp} . effectifs . valides:
    applicable si: valide
    remplace: effectifs
    somme:
    - index . écart rémunérations . ${csp} . effectifs . hommes
    - index . écart rémunérations . ${csp} . effectifs . femmes

index . écart promotions . ${csp} . écart:
  applicable si:
    toutes ces conditions:
      - hommes >= 0
      - femmes >= 0
  somme:
      - hommes
      - -1 * femmes
  unité: "%"
  
index . écart promotions . ${csp} . écart pondéré:
  applicable si: valide
  valeur : écart * effectifs . valides / index . écart promotions . effectifs . valides
  unité: "%"
    
index . écart rémunérations . ${csp} . effectifs . hommes:
  somme:
${tranchesAge
  .map((tranche) => `    - ${tranche} . nombre salariés . hommes`)
  .join("\n")}

index . écart rémunérations . ${csp} . effectifs . femmes:
  somme:
${tranchesAge
  .map((tranche) => `    - ${tranche} . nombre salariés . femmes`)
  .join("\n")}

index . écart rémunérations . ${csp} . effectifs:
  somme:
    - hommes
    - femmes
  `
    )
    .join("\n")}


index . écart augmentations . effectifs . valides:
  somme:
${csps.map((csp) => `    - ${csp} . effectifs . valides`).join("\n")}
  

index . écart augmentations . effectifs:
  somme:
${csps
  .map((csp) => `    - index . écart rémunérations . ${csp} . effectifs`)
  .join("\n")}

index . écart augmentations . effectifs . hommes:
  somme:
${csps
  .map(
    (csp) => `    - index . écart rémunérations . ${csp} . effectifs . hommes`
  )
  .join("\n")} 

index . écart augmentations . effectifs . femmes:
  somme:
${csps
  .map(
    (csp) => `    - index . écart rémunérations . ${csp} . effectifs . femmes`
  )
  .join("\n")} 

 
index . écart augmentations . écart: oui

index . écart augmentations . écart . hommes . somme:
  somme:
${csps
  .map(
    (csp) =>
      `    - ${csp} . hommes / 100 * index . écart rémunérations . ${csp} . effectifs . hommes`
  )
  .join("\n")} 

index . écart augmentations . écart . hommes : 
  valeur: écart . hommes . somme / effectifs . hommes
  unité: "%"

index . écart augmentations . écart . femmes . somme:
  somme:
${csps
  .map(
    (csp) =>
      `    - ${csp} . femmes / 100 * index . écart rémunérations . ${csp} . effectifs . femmes`
  )
  .join("\n")} 

index . écart augmentations . écart . femmes : 
  valeur: écart . femmes . somme / effectifs . femmes
  unité: "%"
 

index . écart augmentations . écart pondéré:
  unité: "%"
  somme:
${csps.map((csp) => `    - ${csp} . écart pondéré`).join("\n")} 
 

index . écart promotions . effectifs . valides:
  somme:
${csps.map((csp) => `    - ${csp} . effectifs . valides`).join("\n")}
  

index . écart promotions . effectifs:
  somme:
${csps
  .map((csp) => `    - index . écart rémunérations . ${csp} . effectifs`)
  .join("\n")}

index . écart promotions . effectifs . hommes:
  somme:
${csps
  .map(
    (csp) => `    - index . écart rémunérations . ${csp} . effectifs . hommes`
  )
  .join("\n")} 

index . écart promotions . effectifs . femmes:
  somme:
${csps
  .map(
    (csp) => `    - index . écart rémunérations . ${csp} . effectifs . femmes`
  )
  .join("\n")} 

 
index . écart promotions . écart: oui

index . écart promotions . écart . hommes . somme:
  somme:
${csps
  .map(
    (csp) =>
      `    - ${csp} . hommes / 100 * index . écart rémunérations . ${csp} . effectifs . hommes`
  )
  .join("\n")} 

index . écart promotions . écart . hommes : 
  valeur: écart . hommes . somme / effectifs . hommes
  unité: "%"

index . écart promotions . écart . femmes . somme:
  somme:
${csps
  .map(
    (csp) =>
      `    - ${csp} . femmes / 100 * index . écart rémunérations . ${csp} . effectifs . femmes`
  )
  .join("\n")} 

index . écart promotions . écart . femmes : 
  valeur: écart . femmes . somme / effectifs . femmes
  unité: "%"
 

index . écart promotions . écart pondéré:
  unité: "%"
  somme:
${csps.map((csp) => `    - ${csp} . écart pondéré`).join("\n")} 
 



`;
};

console.log(getCSPS());
