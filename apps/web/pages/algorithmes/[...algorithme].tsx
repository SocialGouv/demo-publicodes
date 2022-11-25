import { ChangeEvent, useEffect } from "react";
import camelCase from "camelcase";
import modeles from "@socialgouv/publicodes-demo-modeles";
import { GetStaticProps, GetStaticPaths } from "next";

import { TextInput } from "@dataesr/react-dsfr";

import usePublicodesEngine from "../../src/usePublicodesEngine";

export default function Algorithme({ algorithme }: { algorithme: string }) {
  const { engine, evaluated, setSituationValue, allMissingVariables } =
    usePublicodesEngine({
      rules: modeles[camelCase(algorithme[0])],
      rule: "résultat",
      situation: {},
    });

  const onInputChange = (inputKey: string) => (e: ChangeEvent) => {
    //@ts-ignore
    let value = e.currentTarget.value || "";
    setSituationValue(inputKey, value);
  };

  const getQuestion = (key: string) => {
    const rule = engine && engine.getRule(key);
    //@ts-ignore
    return (rule && rule.rawNode.question) || null;
  };

  const meta = engine && engine.getParsedRules()?.publicodes?.rawNode;

  return (
    <div>
      <br />
      {meta && (
        <div>
          <h2>{meta.titre}</h2>
          <p>{meta.description}</p>
          {meta.références && (
            <div>
              <b>Source{Object.keys(meta.références).length > 1 ? "s" : ""}:</b>{" "}
              {Object.keys(meta.références).map((key) => (
                <li key={key}>
                  {/* @ts-ignore */}
                  <a href={meta.références[key]}>{key}</a>
                </li>
              ))}
            </div>
          )}
        </div>
      )}
      <br />
      {(allMissingVariables &&
        allMissingVariables.length &&
        allMissingVariables.map((key) => (
          <div key={key}>
            {getQuestion(key) || key}
            <br />
            <TextInput
              type="text"
              key={`${algorithme}-${key}`}
              style={{ textAlign: "center", width: 100 }}
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
