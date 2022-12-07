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
      "index . écart rémunérations . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . hommes": 42,
      "index . écart rémunérations . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . femmes": 48,
      "index . écart rémunérations . ouvriers . moins de 30 ans . nombre salariés . hommes": 40,
      "index . écart rémunérations . ouvriers . moins de 30 ans . nombre salariés . femmes": 30,
      "index . écart rémunérations . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . hommes": 99,
      "index . écart rémunérations . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . femmes": 66,
      "index . écart rémunérations . employés . de 40 à 49 ans . nombre salariés . hommes": 72,
      "index . écart rémunérations . employés . de 40 à 49 ans . nombre salariés . femmes": 30,
      "index . écart augmentations . employés . hommes": 20,
      "index . écart augmentations . employés . femmes": 10,
    },
    expected: {
      "index . écart rémunérations . effectifs . valides": "172",
      "index . écart rémunérations . ouvriers . moins de 30 ans . écart rémunération":
        "-14,3\u00A0%",
      "index . écart rémunérations . ouvriers . moins de 30 ans . écart rémunération . abs":
        "14,3\u00A0%",
      "index . écart rémunérations . ouvriers . moins de 30 ans . écart rémunération . pertinent":
        "-9,3\u00A0%",
      "index . écart rémunérations . ouvriers . moins de 30 ans . écart pondéré":
        "-3,8\u00A0%",
      "index . écart rémunérations . écart pondéré": "13\u00A0%",
      "index . écart rémunérations . indice écart rémunérations": "13\u00A0%",
      "index . écart rémunérations . note": "21",
    },
  },
  {
    title: "options . seuil de pertinence: 1%",
    situation: {
      "options . seuil de pertinence": 1,
      "index . écart rémunérations . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . hommes": 42,
      "index . écart rémunérations . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . femmes": 48,
      "index . écart rémunérations . ouvriers . moins de 30 ans . nombre salariés . hommes": 40,
      "index . écart rémunérations . ouvriers . moins de 30 ans . nombre salariés . femmes": 30,
      "index . écart rémunérations . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . hommes": 99,
      "index . écart rémunérations . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . femmes": 66,
      "index . écart rémunérations . employés . de 40 à 49 ans . nombre salariés . hommes": 72,
      "index . écart rémunérations . employés . de 40 à 49 ans . nombre salariés . femmes": 30,
    },
    expected: {
      "index . écart rémunérations . indice écart rémunérations": "13,8\u00A0%",
      "index . écart rémunérations . note": "19",
    },
  },
  {
    title: "exemple 1",
    situation: {
      "index . écart rémunérations . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . hommes": 42,
      "index . écart rémunérations . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . femmes": 48,
      "index . écart rémunérations . ouvriers . moins de 30 ans . nombre salariés . hommes": 40,
      "index . écart rémunérations . ouvriers . moins de 30 ans . nombre salariés . femmes": 30,
      "index . écart rémunérations . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . hommes": 66,
      "index . écart rémunérations . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . femmes": 99,
      "index . écart rémunérations . employés . de 40 à 49 ans . nombre salariés . hommes": 72,
      "index . écart rémunérations . employés . de 40 à 49 ans . nombre salariés . femmes": 30,
    },
    expected: {
      "index . écart rémunérations . effectifs . valides": "172",
      "index . écart rémunérations . indice écart rémunérations": "30,5\u00A0%",
      "index . écart rémunérations . note": "0",
    },
  },
  {
    title: "exemple 2",
    situation: {
      "index . écart rémunérations . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . hommes": 42,
      "index . écart rémunérations . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . femmes": 48,
      "index . écart rémunérations . ouvriers . moins de 30 ans . nombre salariés . hommes": 40,
      "index . écart rémunérations . ouvriers . moins de 30 ans . nombre salariés . femmes": 30,
      "index . écart rémunérations . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . hommes": 66,
      "index . écart rémunérations . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . femmes": 99,
      "index . écart rémunérations . employés . de 40 à 49 ans . nombre salariés . hommes": 72,
      "index . écart rémunérations . employés . de 40 à 49 ans . nombre salariés . femmes": 30,
      "index . écart rémunérations . employés . de 50 ans et plus . remunération annuelle brute moyenne par EQTP . hommes": 20,
      "index . écart rémunérations . employés . de 50 ans et plus . remunération annuelle brute moyenne par EQTP . femmes": 30,
      "index . écart rémunérations . employés . de 50 ans et plus . nombre salariés . hommes": 40,
      "index . écart rémunérations . employés . de 50 ans et plus . nombre salariés . femmes": 50,
    },
    expected: {
      "index . écart rémunérations . effectifs . valides": "262",
      "index . écart rémunérations . indice écart rémunérations": "35,5\u00A0%",
      "index . écart rémunérations . note": "0",
    },
  },
  {
    title: "exemple 3 : groupes invalides",
    situation: {
      "index . écart rémunérations . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . hommes": 42,
      "index . écart rémunérations . ouvriers . moins de 30 ans . remunération annuelle brute moyenne par EQTP . femmes": 48,
      "index . écart rémunérations . ouvriers . moins de 30 ans . nombre salariés . hommes": 40,
      "index . écart rémunérations . ouvriers . moins de 30 ans . nombre salariés . femmes": 30,
      "index . écart rémunérations . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . hommes": 66,
      "index . écart rémunérations . employés . de 40 à 49 ans . remunération annuelle brute moyenne par EQTP . femmes": 99,
      "index . écart rémunérations . employés . de 40 à 49 ans . nombre salariés . hommes": 2,
      "index . écart rémunérations . employés . de 40 à 49 ans . nombre salariés . femmes": 30,
    },
    expected: {
      "index . écart rémunérations . effectifs . valides": "70",
      "index . écart rémunérations . ouvriers . moins de 30 ans . écart rémunération":
        "-14,3\u00A0%",
      "index . écart rémunérations . ouvriers . moins de 30 ans . écart rémunération . abs":
        "14,3\u00A0%",
      "index . écart rémunérations . ouvriers . moins de 30 ans . écart rémunération . pertinent":
        "-9,3\u00A0%",
      "index . écart rémunérations . ouvriers . moins de 30 ans . écart pondéré":
        "-9,3\u00A0%",
      "index . écart rémunérations . écart pondéré": "-9,3\u00A0%",
      "index . écart rémunérations . indice écart rémunérations": "9,3\u00A0%",
      "index . écart rémunérations . note": "27",
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
