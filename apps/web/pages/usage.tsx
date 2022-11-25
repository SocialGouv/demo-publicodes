import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold as syntaxStyle } from "react-syntax-highlighter/dist/cjs/styles/prism";

const sample = `import Engine, { formatValue } from 'publicodes'
import rules from 'modele-social'

const engine = new Engine(rules)

const net = engine
  .setSituation({
      'salarié . contrat . salaire brut': '3000 €/mois',
  })
  .evaluate('salarié . rémunération . net . à payer avant impôt')

console.log(formatValue(net))
`;

export default function Web() {
  return (
    <div>
      <br />
      <h3>Usage de publi.codes</h3>
      <p>
        Pour utiliser un modèle publi.codes, exemple avec le{" "}
        <a href="https://www.npmjs.com/package/modele-social">
          package modele-social
        </a>{" "}
        :
      </p>
      <SyntaxHighlighter language="js" style={syntaxStyle}>
        {sample}
      </SyntaxHighlighter>
      <br />
      Voir la{" "}
      <a href="https://publi.codes/docs/principes-de-base">
        documentation publi.codes
      </a>{" "}
      et la{" "}
      <a href="https://mon-entreprise.urssaf.fr/d%C3%A9veloppeur/biblioth%C3%A8que-de-calcul">
        documentation mon-entreprise
      </a>
      .
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}
