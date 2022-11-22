import { Button } from "ui";

import modeles from "@socialgouv/publicodes-demo-modeles";
import Engine from "publicodes";

import type { Names } from "@socialgouv/publicodes-demo-modeles/dist/orientation-covid";

//console.log(" Names", orientationCovid);

//console.log("modeles", modeles);
export default function Web() {
  // @ts-ignore TODO
  const rules = modeles.imc;
  console.log("rules", rules);
  const engine = new Engine(rules);
  engine.setSituation({
    "patient . poids": "42kg",
    "patient . taille": "167cm",
  });
  const evaluated = engine.evaluate("résultat");
  console.log("evaluated", evaluated);

  return (
    <div>
      <h1>IMC: {evaluated.nodeValue}</h1>
      <Button />
    </div>
  );
}
