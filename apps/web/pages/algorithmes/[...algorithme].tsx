import { ChangeEvent, useState } from "react";
import camelCase from "camelcase";
import modeles from "@socialgouv/publicodes-demo-modeles";
import Engine from "publicodes";
import { GetStaticProps, GetStaticPaths } from "next";

import { TextInput } from "@dataesr/react-dsfr";

export default function Algorithme({ algorithme }: { algorithme: string }) {
  const [situation, setSituation] = useState({});
  const [initialMissingVariables, setInitialMissingVariables] = useState<
    null | string[]
  >(null);

  // @ts-ignore TODO
  const rules = modeles[camelCase(algorithme)];

  const engine = new Engine(rules);
  engine.setSituation(situation);
  const evaluated = engine.evaluate("résultat");
  const missingVariables = Object.entries(evaluated.missingVariables);

  const onInputChange = (inputKey: string) => (e: ChangeEvent) => {
    //@ts-ignore
    let value = e.currentTarget.value || "";
    console.log("onInputChange", value);
    if (isNaN(value)) {
      value = `'${value}'`;
    } else {
      value = parseFloat(value);
    }
    if (value) {
      const newSituation = { ...situation, [inputKey]: value };
      //engine.setSituation(newSituation);
      setSituation(newSituation);
    }
  };
  if (initialMissingVariables === null && missingVariables.length) {
    setInitialMissingVariables(
      Object.values(missingVariables).map(([key]) => key)
    );
  }
  const getQuestion = (key: string) => {
    const rule = engine.getRule(key);
    //@ts-ignore
    return (rule && rule.rawNode.question) || null;
  };

  console.log({ rules, missingVariables, evaluated, situation });
  return (
    <div>
      {(initialMissingVariables &&
        initialMissingVariables.length &&
        initialMissingVariables.map((key) => (
          <div key={key}>
            {getQuestion(key)}
            <br />
            <TextInput
              type="text"
              style={{ textAlign: "center" }}
              onBlur={onInputChange(key)}
            />
            <hr />
          </div>
        ))) ||
        null}
      <h3
        dangerouslySetInnerHTML={{
          __html:
            evaluated?.nodeValue?.toString().replace(/\n/g, "<br/>") || "",
        }}
      ></h3>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(modeles).map((key) => ({
    params: { algorithme: [key] },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const algorithme = params?.algorithme;
    return { props: { algorithme } };
  } catch (err: any) {
    return { props: { errors: err.message } };
  }
};
