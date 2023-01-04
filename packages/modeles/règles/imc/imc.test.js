/* eslint-env node18 */
import yaml from "js-yaml";
import Engine, { formatValue } from "publicodes";

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

test.each(tests)(".imc($poids, $taille)", ({ poids, taille }) => {
  const engine = new Engine(rules);
  engine.setSituation({
    poids: poids,
    taille: taille,
  });
  const evaluated = engine.evaluate("résultat");
  expect(evaluated.nodeValue).toMatchSnapshot();
});

test("doit renvoyer le bon IMC pour T=170,P=80)", () => {
  const engine = new Engine(rules);
  engine.setSituation({
    poids: "80kg",
    taille: "170cm",
  });
  const evaluated = engine.evaluate("imc");
  // teste la valeur brute
  expect(evaluated.nodeValue).toEqual(27.68166089965398);
  // teste la valeur formatée
  expect(formatValue(evaluated)).toEqual("27,68\u00A0kg / m²");
});

test("doit renvoyer la bonne interpretation pour T=180,P=80)", () => {
  const engine = new Engine(rules);
  engine.setSituation({
    poids: "80kg",
    taille: "180cm",
  });
  const evaluated = engine.evaluate("résultat");
  expect(evaluated.nodeValue.trim())
    .toEqual(`Votre IMC est de 24,69\u00A0kg / m²
Interprétation: poids normal`);
});

test("doit renvoyer la bonne interpretation pour T=150,P=90)", () => {
  const engine = new Engine(rules);
  engine.setSituation({
    poids: "90kg",
    taille: "150cm",
  });
  const evaluated = engine.evaluate("résultat");
  expect(evaluated.nodeValue.trim()).toEqual(
    `Votre IMC est de 40\u00A0kg / m²\nInterprétation: obésité morbide ou massive`
  );
});
