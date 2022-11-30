/* eslint-env node18 */
import yaml from "js-yaml";
import Engine, { formatValue } from "publicodes";

import modeles from "@socialgouv/publicodes-demo-modeles";

const rules = yaml.load(modeles.indexEgaliteHf.yaml);

test("a besoin de variables pour fonctionner", () => {
  const engine = new Engine(rules);
  const evaluated = engine.evaluate("résultat");
  expect(evaluated.missingVariables).toMatchSnapshot();
});

const defaultSituation = {
  // "patient . âge": 25,
  // "patient . antécédents de maladie cardiovasculaire": "non",
  // "patient . cancert évolutif": "non",
  // "patient . cirrhose": "non",
  // "patient . diabète mal équilibré ou avec des complications": "non",
  // "patient . drépanocytose": "non",
  // "patient . enceinte": "non",
  // "patient . immunodépression": "non",
  // "patient . insuffisance rénale": "non",
  // "patient . maladie respiratoire chronique": "non",
  // "patient . poids": 80,
  // "patient . taille": 180,
  // "symptômes . alimenter ou boire impossible": "non",
  // "symptômes . anosmie": "non",
  // "symptômes . diarrhée": "non",
  // "symptômes . douleurs": "non",
  // "symptômes . fatigue": "non",
  // "symptômes . manque de souffle": "non",
  // "symptômes . température": 38,
  // "symptômes . toux": "non",
};

test("ne renvoie pas d'alerte avec la situation par défaut", () => {
  const engine = new Engine(rules);
  engine.setSituation(defaultSituation);
  const evaluated = engine.evaluate("résultat");
  expect(evaluated.nodeValue).toMatchSnapshot();
  expect(evaluated.missingVariables).toEqual({});
});

const tests = [
  {
    title: "options . seuil de pertinence par défaut",
    situation: {
      "index . csp . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . hommes": 42,
      "index . csp . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . femmes": 48,
      "index . csp . ouvriers . moins de 30 ans . nombre salariés . hommes": 40,
      "index . csp . ouvriers . moins de 30 ans . nombre salariés . femmes": 30,
      "index . csp . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . hommes": 99,
      "index . csp . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . femmes": 66,
      "index . csp . employés . de 40 à 49 ans . nombre salariés . hommes": 72,
      "index . csp . employés . de 40 à 49 ans . nombre salariés . femmes": 30,
    },
    expected: {
      "index . csp . effectifs . valides": "172",
      "index . csp . ouvriers . moins de 30 ans . écart rémunération":
        "-14,3\u00A0%",
      "index . csp . ouvriers . moins de 30 ans . écart rémunération . abs":
        "14,3\u00A0%",
      "index . csp . ouvriers . moins de 30 ans . écart rémunération . pertinent":
        "-9,3\u00A0%",
      "index . csp . ouvriers . moins de 30 ans . écart pondéré": "-3,8\u00A0%",
      "index . csp . écart pondéré": "13\u00A0%",
      "index . csp . indice écart rémunération": "13\u00A0%",
      "index . csp . note": "21",
    },
  },
  {
    title: "options . seuil de pertinence: 1%",
    situation: {
      "options . seuil de pertinence": 1,
      "index . csp . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . hommes": 42,
      "index . csp . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . femmes": 48,
      "index . csp . ouvriers . moins de 30 ans . nombre salariés . hommes": 40,
      "index . csp . ouvriers . moins de 30 ans . nombre salariés . femmes": 30,
      "index . csp . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . hommes": 99,
      "index . csp . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . femmes": 66,
      "index . csp . employés . de 40 à 49 ans . nombre salariés . hommes": 72,
      "index . csp . employés . de 40 à 49 ans . nombre salariés . femmes": 30,
    },
    expected: {
      "index . csp . indice écart rémunération": "13,8\u00A0%",
      "index . csp . note": "19",
    },
  },
  {
    title: "exemple 1",
    situation: {
      "index . csp . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . hommes": 42,
      "index . csp . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . femmes": 48,
      "index . csp . ouvriers . moins de 30 ans . nombre salariés . hommes": 40,
      "index . csp . ouvriers . moins de 30 ans . nombre salariés . femmes": 30,
      "index . csp . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . hommes": 66,
      "index . csp . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . femmes": 99,
      "index . csp . employés . de 40 à 49 ans . nombre salariés . hommes": 72,
      "index . csp . employés . de 40 à 49 ans . nombre salariés . femmes": 30,
    },
    expected: {
      "index . csp . effectifs . valides": "172",
      "index . csp . indice écart rémunération": "30,5\u00A0%",
      "index . csp . note": "0",
    },
  },
  {
    title: "exemple 2",
    situation: {
      "index . csp . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . hommes": 42,
      "index . csp . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . femmes": 48,
      "index . csp . ouvriers . moins de 30 ans . nombre salariés . hommes": 40,
      "index . csp . ouvriers . moins de 30 ans . nombre salariés . femmes": 30,
      "index . csp . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . hommes": 66,
      "index . csp . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . femmes": 99,
      "index . csp . employés . de 40 à 49 ans . nombre salariés . hommes": 72,
      "index . csp . employés . de 40 à 49 ans . nombre salariés . femmes": 30,
      "index . csp . employés . de 50 ans et plus . remunération annuelle brute moyenne par EQTP . hommes": 20,
      "index . csp . employés . de 50 ans et plus . remunération annuelle brute moyenne par EQTP . femmes": 30,
      "index . csp . employés . de 50 ans et plus . nombre salariés . hommes": 40,
      "index . csp . employés . de 50 ans et plus . nombre salariés . femmes": 50,
    },
    expected: {
      "index . csp . effectifs . valides": "262",
      "index . csp . indice écart rémunération": "35,5\u00A0%",
      "index . csp . note": "0",
    },
  },
  {
    title: "exemple 3 : groupes invalides",
    situation: {
      "index . csp . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . hommes": 42,
      "index . csp . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . femmes": 48,
      "index . csp . ouvriers . moins de 30 ans . nombre salariés . hommes": 40,
      "index . csp . ouvriers . moins de 30 ans . nombre salariés . femmes": 30,
      "index . csp . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . hommes": 66,
      "index . csp . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . femmes": 99,
      "index . csp . employés . de 40 à 49 ans . nombre salariés . hommes": 2,
      "index . csp . employés . de 40 à 49 ans . nombre salariés . femmes": 30,
    },
    expected: {
      "index . csp . effectifs . valides": "70",
      "index . csp . ouvriers . moins de 30 ans . écart rémunération":
        "-14,3\u00A0%",
      "index . csp . ouvriers . moins de 30 ans . écart rémunération . abs":
        "14,3\u00A0%",
      "index . csp . ouvriers . moins de 30 ans . écart rémunération . pertinent":
        "-9,3\u00A0%",
      "index . csp . ouvriers . moins de 30 ans . écart pondéré": "-9,3\u00A0%",
      "index . csp . écart pondéré": "-9,3\u00A0%",
      "index . csp . indice écart rémunération": "9,3\u00A0%",
      "index . csp . note": "27",
    },
  },
];

test.each(tests)("$title", ({ title, situation, expected }) => {
  const engine = new Engine(rules);
  engine.setSituation({
    ...defaultSituation,
    ...situation,
  });
  Object.keys(expected).forEach((key) => {
    const evaluated = engine.evaluate(key);
    expect(`${key}: ${formatValue(evaluated)}`).toEqual(
      `${key}: ${expected[key]}`
    );
  });

  //expect(evaluated.nodeValue).toMatchSnapshot();
  //expect(evaluated.missingVariables).toEqual({});
});
