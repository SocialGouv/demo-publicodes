/* eslint-env node18 */
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import Engine from "publicodes";

const fullpath = path.join("règles", "orientation-covid", "publicodes.yaml");
const rules = yaml.load(fs.readFileSync(fullpath, "utf-8"));

test("ne fonctionne pas si age < 15", () => {
  const engine = new Engine(rules);
  engine.setSituation({
    "patient . age": 13,
  });
  const evaluated = engine.evaluate("résultat");
  expect(evaluated.nodeValue).toMatchSnapshot();
});

test("a besoin de variables pour fonctionner", () => {
  const engine = new Engine(rules);
  const evaluated = engine.evaluate("résultat");
  expect(evaluated.missingVariables).toMatchSnapshot();
});
