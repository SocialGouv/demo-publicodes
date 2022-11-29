/* eslint-env node18 */
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import Engine from "publicodes";

const fullpath = path.join("règles", "orientation-covid", "publicodes.yaml");
const rules = yaml.load(fs.readFileSync(fullpath, "utf-8"));

test("a besoin de variables pour fonctionner", () => {
  const engine = new Engine(rules);
  const evaluated = engine.evaluate("résultat");
  expect(evaluated.missingVariables).toMatchSnapshot();
});

const defaultSituation = {
  "patient . âge": 25,
  "patient . antécédents de maladie cardiovasculaire": "non",
  "patient . cancert évolutif": "non",
  "patient . cirrhose": "non",
  "patient . diabète mal équilibré ou avec des complications": "non",
  "patient . drépanocytose": "non",
  "patient . enceinte": "non",
  "patient . immunodépression": "non",
  "patient . insuffisance rénale": "non",
  "patient . maladie respiratoire chronique": "non",
  "patient . poids": 80,
  "patient . taille": 180,
  "symptômes . alimenter ou boire impossible": "non",
  "symptômes . anosmie": "non",
  "symptômes . diarrhée": "non",
  "symptômes . douleurs": "non",
  "symptômes . fatigue": "non",
  "symptômes . manque de souffle": "non",
  "symptômes . température": 38,
  "symptômes . toux": "non",
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
    title: "enfants < 15 ans",
    situation: {
      "patient . âge": 12,
    },
  },
  {
    title: "facteurs de gravité majeure",
    situation: {
      "patient . âge": 22,
      "symptômes . manque de souffle": "oui", // facteur de gravité majeure
    },
  },
  {
    title: "fièvre 25 ans",
    situation: {
      "patient . âge": 25,
      "symptômes . température": 40, // facteur de gravité mineure
    },
  },
  {
    title: "fièvre 55 ans",
    situation: {
      "patient . âge": 55,
      "symptômes . température": 40, // facteur de gravité mineure
    },
  },
  {
    title: "fièvre 70 ans",
    situation: {
      "patient . âge": 70, // facteur pronostique
      "symptômes . température": 40, // facteur de gravité mineure
    },
  },
  {
    title: "fièvre et toux",
    situation: {
      "symptômes . température": 40, // facteur de gravité mineure
      "symptômes . toux": "oui",
    },
  },
  {
    title: "fièvre et toux et cirrhose",
    situation: {
      "symptômes . température": 40, // facteur de gravité mineure
      "symptômes . toux": "oui",
      "patient . cirrhose": "oui", // facteur pronostique
    },
  },
  {
    title: "fièvre et toux et cirrhose et fatigue importante",
    situation: {
      "symptômes . température": 40, // facteur de gravité mineur
      "symptômes . toux": "oui",
      "symptômes . fatigue": "oui",
      "symptômes . fatigue importante": "oui", // facteur de gravité mineur
      "patient . cirrhose": "oui", // facteur pronostique
    },
  },
  {
    title: "38 ans et toux",
    situation: {
      "symptômes . température": 38,
      "symptômes . toux": "oui",
    },
  },
  {
    title: "38 ans et toux et facteur pronostique mineur",
    situation: {
      "symptômes . température": 38,
      "symptômes . toux": "oui",
      "patient . cirrhose": "oui", // facteur de granité mineur
    },
  },
];

test.each(tests)("$title", ({ title, situation }) => {
  const engine = new Engine(rules);
  engine.setSituation({
    ...defaultSituation,
    ...situation,
  });
  const evaluated = engine.evaluate("résultat");

  expect(evaluated.nodeValue).toMatchSnapshot();
  expect(evaluated.missingVariables).toEqual({});
});
