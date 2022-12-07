/*
generate repetitive YAML rules for a given CSP
*/

const csps = [
  "ouvriers",
  "employés",
  //"techniciens et agents de maîtrise",
  // "ingénieurs et cadres",
];

const tranchesAge = [
  "moins de 30 ans",
  //"de 30 à 39 ans",
  //"de 40 à 49 ans",
  //"de 50 ans et plus",
];

const getCSPTrancheRules = (csp, tranche) => `
index . écart rémunérations . ${csp} . ${tranche}: oui
index . écart rémunérations . ${csp} . ${tranche} . remunération annuelle brute moyenne par EQTP: oui
index . écart rémunérations . ${csp} . ${tranche} . nombre salariés: oui

index . écart rémunérations . ${csp} . ${tranche} . validite:
  valeur: non

index . écart rémunérations . ${csp} . ${tranche} . valide:
  applicable si:
    toutes ces conditions:
      - nombre salariés . hommes >= 3
      - nombre salariés . femmes >= 3
  valeur: oui
  remplace: validite

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
  valeur: nombre salariés . hommes + nombre salariés . femmes

index . écart rémunérations . ${csp} . ${tranche} . effectifs . valides:
  valeur: 0

index . écart rémunérations . ${csp} . ${tranche} . effectifs . valides . count:
  applicable si: validite
  valeur: effectifs
  remplace: effectifs . valides

index . écart rémunérations . ${csp} . ${tranche} . écart pondéré:
  valeur: 0
  unité: "%"
  arrondi: 1 décimale

index . écart rémunérations . ${csp} . ${tranche} . écart pondéré . positif:
  remplace: écart pondéré
  applicable si:
    toutes ces conditions:
      - valide = oui
  valeur: écart rémunération . pertinent  * effectifs / index . écart rémunérations . effectifs . valides
  unité: "%"
  arrondi: 1 décimale

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
${cspTranches
  .map((rule) => `    - index . écart rémunérations . ${rule} . écart pondéré`)
  .join("\n")}

index . écart rémunérations . effectifs:
  somme:
${cspTranches
  .map((rule) => `    - index . écart rémunérations . ${rule} . effectifs`)
  .join("\n")}

index . écart rémunérations . effectifs . valides:
  somme:
${cspTranches
  .map(
    (rule) =>
      `    - index . écart rémunérations . ${rule} . effectifs . valides`
  )
  .join("\n")}


index . écart augmentations: oui
 
  ${csps
    .map(
      (csp) => `
  
index . écart augmentations . ${csp}: oui

index . écart augmentations . ${csp} . hommes:
  question: taux d'augmentation pour les hommes (proportion de salariés augmentés)
  valeur: 0

index . écart augmentations . ${csp} . femmes:
  question: taux d'augmentation pour les femmes (proportion de salariés augmentés)
  valeur: 0

index . écart augmentations . ${csp} . valide:
  toutes ces conditions:
    - index . écart rémunérations . ${csp} . effectifs . hommes >= 10 
    - index . écart rémunérations . ${csp} . effectifs . femmes >= 10 

index . écart augmentations . ${csp} . effectifs:
    valeur: 0

index . écart augmentations . ${csp} . effectifs . valides:
    applicable si: valide
    remplace: index . écart augmentations . ${csp} . effectifs
    somme:
    - index . écart rémunérations . ${csp} . effectifs . hommes
    - index . écart rémunérations . ${csp} . effectifs . femmes

index . écart augmentations . ${csp} . écart:
  applicable si:
    toutes ces conditions:
      - index . écart augmentations . ${csp} . hommes >= 0
      - index . écart augmentations . ${csp} . femmes >= 0
  somme:
      - index . écart augmentations . ${csp} . hommes
      - -1 * index . écart augmentations . ${csp} . femmes

index . écart augmentations . ${csp} . écart pondéré:
    applicable si: index . écart augmentations . ${csp} . valide
    valeur : index . écart augmentations . ${csp} . écart * index . écart augmentations . ${csp} . effectifs . valides / index . écart augmentations . effectifs . valides

    
index . écart rémunérations . ${csp} . effectifs . hommes:
  somme:
${tranchesAge
  .map(
    (tranche) =>
      `    - index . écart rémunérations . ${csp} . ${tranche} . nombre salariés . hommes`
  )
  .join("\n")}

index . écart rémunérations . ${csp} . effectifs . femmes:
  somme:
${tranchesAge
  .map(
    (tranche) =>
      `    - index . écart rémunérations . ${csp} . ${tranche} . nombre salariés . femmes`
  )
  .join("\n")}

index . écart rémunérations . ${csp} . effectifs:
  somme:
    - index . écart rémunérations . ${csp} . effectifs . hommes
    - index . écart rémunérations . ${csp} . effectifs . femmes
  `
    )
    .join("\n")}


index . écart augmentations . effectifs . valides:
  somme:
${csps
  .map(
    (csp) => `    - index . écart augmentations . ${csp} . effectifs . valides`
  )
  .join("\n")}
  

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
  valeur: index . écart augmentations . écart . hommes . somme / index . écart augmentations . effectifs . hommes
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
  valeur: index . écart augmentations . écart . femmes . somme / index . écart augmentations . effectifs . femmes
  unité: "%"
 

index . écart augmentations . écart pondéré:
  somme:
${csps.map((csp) => `    - ${csp} . écart pondéré`).join("\n")} 
 

index . écart augmentations . calculable: non

index . écart augmentations . calculable oui:
  applicable si: 
    toutes ces conditions:
      - effectifs . valides >= 0.4 * effectifs
      - une de ces conditions:
        - écart . hommes > 0
        - écart . femmes > 0
  remplace: calculable
  valeur: oui

index . écart augmentations . indice écart augmentations: 0

index . écart augmentations . indice écart augmentations calcul:
  applicable si: calculable
  remplace: indice écart augmentations
  variations:
    - si: écart pondéré >= 0
      alors: écart pondéré
    - sinon: -1 * écart pondéré

index . écart augmentations . note:
  applicable si:
    toutes ces conditions:
      - calculable
      - écart rémunérations . calculable
  variations:
    - si: indice écart augmentations < 2.1
      alors: 20
    - si: indice écart augmentations < 5.1
      alors: 10
    - si: indice écart augmentations < 10.1
      alors: 5
    - sinon: 0



`;
};

console.log(getCSPS());
