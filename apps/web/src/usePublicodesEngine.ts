import { useEffect, useState } from "react";

import Engine, { Rule } from "publicodes";

// small wrapper around publicodes engine to handle some specific state
export const usePublicodesEngine = (params: {
  situation?: Record<string, any>;
  rule: string;
  rules: Record<string, Rule>;
}) => {
  const initialSituation = params?.situation;
  const evaluateKey = params.rule;
  const rules = params.rules;

  const [allMissingVariables, setAllMissingVariables] = useState<
    null | string[]
  >(null);

  const [stateSituation, setSituation] = useState(initialSituation);
  const [engine, setEngine] = useState<Engine | null>(null);

  useEffect(() => {
    // reset current situation when new rules
    setSituation({});
    setAllMissingVariables(null);
    const publicodes = new Engine(rules);
    setEngine(publicodes);
  }, [rules]);

  const setSituationValue = (key: string, value: any) => {
    if (value === "") {
      // remove value from situation when empty
      const newSituation =
        stateSituation &&
        Object.keys(stateSituation)
          .filter((k) => k !== key)
          .reduce(
            (a, k) => ({
              ...a,
              [k]: stateSituation[k],
            }),
            {}
          );
      setSituation(newSituation);
      engine && engine.setSituation(newSituation);
      return;
    } else if (isNaN(value)) {
      if (value === "oui" || value === "non") {
        // keep value as is
      } else {
        // quote string value for publicodes
        value = `'${value}'`;
      }
    } else {
      value = parseFloat(value);
    }
    if (value) {
      const newSituation = { ...stateSituation, [key]: value };
      setSituation(newSituation);
      engine && engine.setSituation(newSituation);
    }
  };

  const evaluated = engine && engine.evaluate(evaluateKey);

  const missingVariables =
    (evaluated && Object.keys(evaluated.missingVariables)) || [];

  if (allMissingVariables === null && missingVariables.length) {
    setAllMissingVariables(missingVariables);
  }

  return {
    engine,
    evaluated,
    missingVariables,
    situation: stateSituation,
    setSituationValue,
    allMissingVariables, // original copy of initial model missing variables
  };
};

export default usePublicodesEngine;
