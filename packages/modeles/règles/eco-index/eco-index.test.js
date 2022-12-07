/* eslint-env node18 */
import yaml from "js-yaml";
import Engine, { formatValue } from "publicodes";

import modeles from "@socialgouv/publicodes-demo-modeles";

const rules = yaml.load(modeles.ecoIndex.yaml);

test("a besoin de variables pour fonctionner", () => {
  const engine = new Engine(rules);
  const evaluated = engine.evaluate("résultat");
  expect(evaluated.missingVariables).toMatchSnapshot();
});

const defaultSituation = {};

test("ne renvoie rien par défaut", () => {
  const engine = new Engine(rules);
  engine.setSituation(defaultSituation);
  const evaluated = engine.evaluate("résultat");
  expect(evaluated.nodeValue).toMatchSnapshot();
  expect(evaluated.missingVariables).toMatchSnapshot();
});

const tests = [
  {
    title: "100, 200, 300",
    situation: {
      "input . dom": 100,
      "input . req": 200,
      "input . size": 300,
    },
    expected: {
      ecoindex: "62",
      "ecoindex . grade": "C",
      "emissions gaz": "1,76\u00A0gCO2e",
      "consommation eau": "2,64\u00A0cl",
      "emissions . km": "19,6\u00A0km",
      "emissions . douches": "0,4\u00A0douche(s)",
    },
  },
  {
    title: "1000, 2000, 3000",
    situation: {
      "input . dom": 1000,
      "input . req": 2000,
      "input . size": 3000,
    },
    expected: {
      ecoindex: "19",
      "ecoindex . grade": "F",
      "emissions gaz": "2,62\u00A0gCO2e",
      "consommation eau": "3,93\u00A0cl",
      "emissions . km": "29,1\u00A0km",
      "emissions . douches": "0,7\u00A0douche(s)",
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
});
