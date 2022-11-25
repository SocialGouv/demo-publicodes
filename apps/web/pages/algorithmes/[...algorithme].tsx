import camelCase from "camelcase";
import modeles from "@socialgouv/publicodes-demo-modeles";
import { GetStaticProps, GetStaticPaths } from "next";
import { stringify } from "yaml";
import { Tabs, Tab, TextInput } from "@dataesr/react-dsfr";

import usePublicodesEngine from "../../src/usePublicodesEngine";
import { Rule } from "publicodes";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold as syntaxStyle } from "react-syntax-highlighter/dist/cjs/styles/prism";

const AlgorithmeHeader = ({ meta }: { meta: Rule | null }) => {
  return (
    meta && (
      <div>
        <h2>{meta.titre}</h2>
        <p>{meta.description}</p>
        {meta.références && (
          <div>
            <b>Source{Object.keys(meta.références).length > 1 ? "s" : ""}:</b>{" "}
            {Object.keys(meta.références).map((key) => (
              <li key={key}>
                {/* @ts-ignore WTF */}
                <a href={meta.références[key]}>{key}</a>
              </li>
            ))}
          </div>
        )}
      </div>
    )
  );
};

export default function Algorithme({ algorithme }: { algorithme: string }) {
  const modele = modeles[camelCase(algorithme[0])];
  const { engine, evaluated, setSituationValue, allMissingVariables } =
    usePublicodesEngine({
      rules: modele,
      rule: "résultat",
      situation: {},
    });

  const onInputChange =
    (inputKey: string): React.ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      let value = e.currentTarget.value || "";
      setSituationValue(inputKey, value);
    };

  const getQuestion = (key: string) => {
    const rule = engine && engine.getRule(key);
    return (rule && rule.rawNode.question) || null;
  };

  const meta = engine && engine.getParsedRules()?.meta?.rawNode;

  const codeString = stringify(modele);

  return (
    <div>
      <br />
      <AlgorithmeHeader meta={meta} />
      <br />
      <Tabs defaultActiveTab={0}>
        {/* @ts-ignore */}
        <Tab label="Formulaire">
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
        </Tab>
        {/* @ts-ignore */}
        <Tab label="Algorithme">
          <SyntaxHighlighter language="yaml" style={syntaxStyle}>
            {codeString}
          </SyntaxHighlighter>
        </Tab>
        {/* @ts-ignore */}
        <Tab label="Tests">Todo: lancer les tests unitaires</Tab>
      </Tabs>
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
