import { ChangeEvent, useState } from "react";
import { Button } from "ui";

import modeles from "@socialgouv/publicodes-demo-modeles";
import Engine from "publicodes";

import type { Names } from "@socialgouv/publicodes-demo-modeles/dist/orientation-covid";

function IMC() {
  const [situation, setSituation] = useState({});
  const [initialMissingVariables, setInitialMissingVariables] = useState<
    null | string[]
  >(null);
  // @ts-ignore TODO
  const rules = modeles.imc;

  console.log("rules", rules);
  const engine = new Engine(rules);
  engine.setSituation(situation);
  const evaluated = engine.evaluate("résultat");
  console.log("evaluated", evaluated);
  const missingVariables = Object.entries(evaluated.missingVariables);
  const onInputChange = (inputKey: string) => (e: ChangeEvent) => {
    //@ts-ignore
    setSituation({ ...situation, [inputKey]: e.currentTarget.value });
  };
  if (initialMissingVariables === null && missingVariables.length) {
    setInitialMissingVariables(
      Object.values(missingVariables.map(([key]) => key))
    );
  }
  const getQuestion = (key: string) => {
    const rule = rules[key];
    console.log("rule", rule);
    return (rule && rule.question) || null;
  };

  return (
    <div>
      <h1>IMC</h1>
      {(initialMissingVariables &&
        initialMissingVariables.length &&
        initialMissingVariables.map((key) => (
          <div key={key}>
            {getQuestion(key)}
            <br />
            <input
              type="text"
              style={{ textAlign: "center" }}
              onChange={onInputChange(key)}
            />
            <hr />
          </div>
        ))) ||
        null}
      <h3>Résultat : {evaluated.nodeValue}</h3>
    </div>
  );
}

function Orientation() {
  const [situation, setSituation] = useState({});
  const [initialMissingVariables, setInitialMissingVariables] = useState<
    null | string[]
  >(null);
  // @ts-ignore TODO
  const rules = modeles.orientationCovid;

  console.log("rules", rules);
  const engine = new Engine(rules);
  engine.setSituation(situation);
  const evaluated = engine.evaluate("résultat");
  console.log("evaluated", evaluated);
  const missingVariables = Object.entries(evaluated.missingVariables);
  console.log("missingVariables", missingVariables);

  const onInputChange = (inputKey: string) => (e: ChangeEvent) => {
    const value =
      //@ts-ignore
      (isNaN(e.currentTarget.value) && `'${e.currentTarget.value}'`) ||
      //@ts-ignore
      e.currentTarget.value;

    setSituation({ ...situation, [inputKey]: value });
  };
  if (initialMissingVariables === null && missingVariables.length) {
    setInitialMissingVariables(
      Object.values(missingVariables.map(([key]) => key))
    );
  }
  const getQuestion = (key: string) => {
    const rule = rules[key];
    console.log("rule", rule);
    return (rule && rule.question) || null;
  };

  return (
    <div>
      <h1>Orientation COVID</h1>
      {(initialMissingVariables &&
        initialMissingVariables.length &&
        initialMissingVariables.map((key) => (
          <div key={key}>
            {getQuestion(key)}
            <br />
            <input
              type="text"
              style={{ textAlign: "center" }}
              onChange={onInputChange(key)}
            />
            <hr />
          </div>
        ))) ||
        null}
      <h3>Résultat : {evaluated.nodeValue}</h3>
    </div>
  );
}

export default function Web() {
  return (
    <div>
      <IMC />
      <Orientation />
    </div>
  );
}
