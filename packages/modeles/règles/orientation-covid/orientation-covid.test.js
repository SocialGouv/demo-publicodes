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

// [{
//     "symptômes . température": 38,
//     "symptômes . manque de souffle": "non",
//     "symptômes . alimenter ou boire impossible": "non",
//     "symptômes . toux": "non",
//     "patient . age": 22,
//     "patient . poids": 78,
//     "patient . taille": 178,
//     "symptômes . fatigue": "non",
//     "symptômes . diarrhée": "non",
//     "symptômes . mal de gorge ou douleurs musculaires ou courbatures inhabituelles ou maux de tête inhabituels": "non",
//     "symptômes . perte goût ou odorat": "non"
// }]
