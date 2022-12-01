/*
generate repetitive YAML rules for a given CSP
*/

const getCSPTrancheRules = (csp, tranche) => `
index . csp . ${csp} . ${tranche}: oui
index . csp . ${csp} . ${tranche} . remunération annuelle brute moyenne par EQTP: oui
index . csp . ${csp} . ${tranche} . nombre salariés: oui

index . csp . ${csp} . ${tranche} . validite:
  valeur: non

index . csp . ${csp} . ${tranche} . valide:
  applicable si:
    toutes ces conditions:
      - nombre salariés . hommes >= 3
      - nombre salariés . femmes >= 3
  valeur: oui
  remplace: validite

index . csp . ${csp} . ${tranche} . écart rémunération:
  applicable si:
    toutes ces conditions:
      - remunération annuelle brute moyenne par EQTP . hommes > 0
      - remunération annuelle brute moyenne par EQTP . femmes > 0
  valeur: (remunération annuelle brute moyenne par EQTP . hommes - remunération annuelle brute moyenne par EQTP . femmes) / remunération annuelle brute moyenne par EQTP . hommes
  unité: "%"
  arrondi: 1 décimale

index . csp . ${csp} . ${tranche} . écart rémunération . abs:
  variations:
    - si: écart rémunération > 0
      alors: écart rémunération
    - sinon: écart rémunération * -1
  unité: "%"
  arrondi: 1 décimale

index . csp . ${csp} . ${tranche} . écart rémunération . pertinent:
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

index . csp . ${csp} . ${tranche} . effectifs:
  valeur: nombre salariés . hommes + nombre salariés . femmes

index . csp . ${csp} . ${tranche} . effectifs . valides:
  valeur: 0

index . csp . ${csp} . ${tranche} . effectifs . valides . count:
  applicable si: validite
  valeur: effectifs
  remplace: effectifs . valides

index . csp . ${csp} . ${tranche} . écart pondéré:
  valeur: 0
  unité: "%"
  arrondi: 1 décimale

index . csp . ${csp} . ${tranche} . écart pondéré . positif:
  remplace: écart pondéré
  applicable si:
    toutes ces conditions:
      - valide = oui
  valeur: écart rémunération . pertinent  * effectifs / index . csp . effectifs . valides
  unité: "%"
  arrondi: 1 décimale

index . csp . ${csp} . ${tranche} . remunération annuelle brute moyenne par EQTP . hommes: 0
index . csp . ${csp} . ${tranche} . remunération annuelle brute moyenne par EQTP . femmes: 0
index . csp . ${csp} . ${tranche} . nombre salariés . hommes: 0
index . csp . ${csp} . ${tranche} . nombre salariés . femmes: 0
`;

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

const getCSPS = () => {
  const cspTranches = csps.flatMap((csp) =>
    tranchesAge.map((tranche) => `${csp} . ${tranche}`)
  );

  const CSPrules = csps
    .flatMap((csp) => [
      `index . csp . ${csp}: oui`,
      ...tranchesAge.map((tranche) => `${getCSPTrancheRules(csp, tranche)}`),
    ])
    .join("\n");

  return `index . csp: oui
${CSPrules}

index . csp . écart pondéré:
  somme:
${cspTranches
  .map((rule) => `    - index . csp . ${rule} . écart pondéré`)
  .join("\n")}

index . csp . effectifs:
  somme:
${cspTranches
  .map((rule) => `    - index . csp . ${rule} . effectifs`)
  .join("\n")}

index . csp . effectifs . valides:
  somme:
${cspTranches
  .map((rule) => `    - index . csp . ${rule} . effectifs . valides`)
  .join("\n")}
    `;
};

console.log(getCSPS());
