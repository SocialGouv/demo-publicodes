import { ChangeEvent, useEffect, useState } from "react";
import camelCase from "camelcase";
import modeles from "@socialgouv/publicodes-demo-modeles";
import Engine from "publicodes";
import { GetStaticProps, GetStaticPaths } from "next";

import { TextInput } from "@dataesr/react-dsfr";

// import { useState, useEffect } from 'react';
const usePublicodeEngine = ({
  situation = {},
}: {
  situation: Record<string, any>;
}) => {
  // const stateSituation = { ...situation };
  // const setSituation = () => {
  //   //todo
  // };
  const [initialMissingVariables, setInitialMissingVariables] = useState<
    null | string[]
  >(null);

  const [stateSituation, setSituation] = useState(situation);
  //const [resultat, setResultat] = useState(null);
  const [engine, setEngine] = useState<Engine | null>(null);

  useEffect(() => {
    console.log("usePublicodeEngine.useEffect");
    return () => {
      console.log("usePublicodeEngine.unsubscribe");
    };
  });

  return {
    engine,
    situation: stateSituation,
    setSituation,
    // setRules,
  };
};

export default function Algorithme({ algorithme }: { algorithme: string }) {
  const [situation, setSituation] = useState({});
  //const [resultat, setResultat] = useState(null);
  const [engine, setEngine] = useState<Engine | null>(null);
  const [initialMissingVariables, setInitialMissingVariables] = useState<
    null | string[]
  >(null);

  // update publicodes rules and reset state when algorithme is changed
  useEffect(() => {
    console.log("update algorithme", algorithme);
    setInitialMissingVariables(null);
    setSituation({});
    // @ts-ignore TODO
    const rules = modeles[camelCase(algorithme[0])];
    const publicodes = new Engine(rules);
    setEngine(publicodes);
  }, [algorithme]);

  // always upadte situation
  if (engine) {
    engine.setSituation(situation);
  }

  const evaluated = engine && engine.evaluate("résultat");
  const missingVariables =
    (evaluated && Object.entries(evaluated.missingVariables)) || [];

  const onInputChange = (inputKey: string) => (e: ChangeEvent) => {
    //@ts-ignore
    let value = e.currentTarget.value || "";
    console.log("onInputChange", value);
    if (isNaN(value)) {
      if (value === "oui" || value === "non") {
        // keep value as is
      } else {
        value = `'${value}'`;
      }
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
    const rule = engine && engine.getRule(key);
    //@ts-ignore
    return (rule && rule.rawNode.question) || null;
  };

  console.log({ missingVariables, evaluated, situation });
  return (
    <div>
      <br />
      <h2>{algorithme}</h2>
      <br />
      {(initialMissingVariables &&
        initialMissingVariables.length &&
        initialMissingVariables.map((key) => (
          <div key={key}>
            {getQuestion(key) || key}
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
    const algorithme = params?.algorithme && params?.algorithme;
    return { props: { algorithme } };
  } catch (err: any) {
    return { props: { errors: err.message } };
  }
};
