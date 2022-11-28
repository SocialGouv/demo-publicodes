import camelCase from "camelcase";
import modeles from "@socialgouv/publicodes-demo-modeles";
import { GetStaticProps, GetStaticPaths } from "next";
import { Tabs, Tab, TextInput } from "@dataesr/react-dsfr";
import { Rule } from "publicodes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold as syntaxStyle } from "react-syntax-highlighter/dist/cjs/styles/prism";

import usePublicodesEngine from "../../src/usePublicodesEngine";

const AlgorithmeHeader = ({ meta }: { meta: Rule | null }) => {
  return (
    meta && (
      <div>
        <h2>{meta.titre}</h2>
        <p
          dangerouslySetInnerHTML={{
            __html: meta.description?.replace(/\n/g, "<br/>") || "",
          }}
        ></p>
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

const FormEPDS = ({
  rules,
  onChange,
  allMissingVariables,
}: {
  rules: Rule[];
  onChange: Function;
  allMissingVariables: string[] | null;
}): React.ReactElement => {
  // load questions/réponses from YAML
  const questions = Object.keys(rules).filter((rule) =>
    rule.match(/^question\d+$/)
  );
  const getRule = (key: string) => {
    const rule = Object.entries(rules).find(([key2, value]) => key2 === key);
    return rule && rule[1];
  };

  const getRulesRegexp = (regexp: RegExp) => {
    return (
      Object.keys(rules)
        .filter((key) => key.match(regexp))
        //@ts-ignore TODO
        .map((key) => rules[key])
    );
  };

  return (
    <div>
      {questions.map((key) => {
        const rule = getRule(key);
        const reponses = getRulesRegexp(new RegExp(`^${key} \. reponse\\d+\$`));
        return (
          rule && (
            <div key={key}>
              <h5>{rule.question}</h5>
              {reponses.map((reponse, i) => (
                <li key={reponse.texte}>
                  <input
                    type="radio"
                    name={key}
                    onChange={(e) =>
                      onChange(`${key} . reponse`, reponse.texte)
                    }
                    id={`${key}-reponse${i + 1}`}
                  />
                  <label htmlFor={`${key}-reponse${i + 1}`}>
                    &nbsp;{reponse.texte}
                  </label>
                </li>
              ))}
              <br />
            </div>
          )
        );
      })}
    </div>
  );
};

const FormOrientationCovid = ({
  rules,
  onChange,
  allMissingVariables,
}: {
  rules: Rule[];
  onChange: Function;
  allMissingVariables: string[];
}): React.ReactElement => {
  // load questions/réponses from YAML
  // const questions = Object.keys(rules).filter((rule) =>
  //   rule.match(/^question\d+$/)
  // );
  const getRule = (key: string) => {
    const rule = Object.entries(rules).find(([key2, value]) => key2 === key);
    return rule && rule[1];
  };

  const onInputChange =
    (inputKey: string): React.ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      let value = e.currentTarget.value || "";
      onChange(inputKey, value);
    };

  const getQuestion = (key: string) => {
    const rule = getRule(key);
    return (rule && rule.question) || null;
  };

  const isTextInput = (key: string) => {
    return ["patient . âge", "patient . poids", "patient . taille"].includes(
      key
    );
  };

  return (
    <div>
      {(allMissingVariables &&
        allMissingVariables.length &&
        allMissingVariables.map((key) => (
          <div key={key}>
            <br />
            {isTextInput(key) ? (
              <div>
                {getQuestion(key) || key}
                <TextInput
                  type="text"
                  key={`orientation-covid-${key}`}
                  style={{ textAlign: "center", width: 100 }}
                  onBlur={onInputChange(key)}
                />
              </div>
            ) : (
              <div>
                <input
                  type="checkbox"
                  onClick={(e) => {
                    if (e.currentTarget.checked) {
                      onChange(key, "oui");
                    } else {
                      onChange(key, "non");
                    }
                  }}
                  id={`orientation-covid-${key}`}
                />
                <label htmlFor={`orientation-covid-${key}`}>
                  &nbsp;{getQuestion(key) || key}
                </label>
              </div>
            )}
            <hr />
          </div>
        ))) ||
        null}
    </div>
  );
};

const customForms = {
  epds: FormEPDS,
  orientationCovid: FormOrientationCovid,
} as Record<string, typeof FormEPDS>;

export default function Algorithme({ algorithme }: { algorithme: string }) {
  const modele = modeles[camelCase(algorithme[0])];
  const rules = modele.rules;
  const rawYaml = modele.yaml;

  const {
    engine,
    situation,
    evaluated,
    setSituationValue,
    allMissingVariables,
  } = usePublicodesEngine({
    rules,
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

  const CustomForm = customForms[algorithme] || null;

  return (
    <div>
      <br />
      <AlgorithmeHeader meta={meta} />
      <br />
      <Tabs defaultActiveTab={0}>
        {/* @ts-ignore */}
        <Tab label="Formulaire">
          {CustomForm ? (
            <CustomForm
              allMissingVariables={allMissingVariables}
              rules={rules}
              onChange={(key: string, value: string) =>
                setSituationValue(key, value)
              }
            />
          ) : (
            (allMissingVariables &&
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
            null
          )}
        </Tab>
        {/* @ts-ignore */}
        <Tab label="Algorithme">
          <SyntaxHighlighter language="yaml" style={syntaxStyle}>
            {rawYaml}
          </SyntaxHighlighter>
        </Tab>
        {/* @ts-ignore */}
        <Tab label="Tests">Todo: lancer les tests unitaires</Tab>
      </Tabs>
      <h5
        dangerouslySetInnerHTML={{
          __html:
            evaluated?.nodeValue?.toString().replace(/\n/g, "<br/>") || "",
        }}
      ></h5>
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
