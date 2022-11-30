/* eslint-env node18 */
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import Engine from "publicodes";

import modeles from "@socialgouv/publicodes-demo-modeles";
const rules = yaml.load(modeles.imc.yaml);

const tests = [
  {
    poids: 78,
    taille: 178,
  },
  {
    poids: 58,
    taille: 178,
  },
  {
    poids: 92,
    taille: 178,
  },
  {
    poids: 92,
    taille: 158,
  },
  {
    poids: 117,
    taille: 158,
  },
  {
    poids: 45,
    taille: 158,
  },
  {
    poids: 32,
    taille: 158,
  },
];

test.each(tests)(".imcu($poids, $taille)", ({ poids, taille }) => {
  const engine = new Engine(rules);
  engine.setSituation({
    "patient . poids": poids,
    "patient . taille": taille,
  });
  const evaluated = engine.evaluate("résultat");
  expect(evaluated.nodeValue).toMatchSnapshot();
});
