Les questions et leur scoring ont été récupérées depuis l'API 1000jours/questionnaireEpdsTraductions

```js
console.log(`
${d.data.questionnaireEpdsTraductions
  .map(
    (q, i) => `
question${i + 1}:
    question: "${q.libelle}"
${[1, 2, 3, 4]
  .map(
    (j) => `question${i + 1} . reponse${j}:
    texte: "${q[`reponse_${j}_libelle`]}"`
  )
  .join("\n")}`
  )
  .join("\n")}

${d.data.questionnaireEpdsTraductions
  .map(
    (q, i) => `
question${i + 1} . score:
    variations:
${[1, 2, 3, 4]
  .map(
    (j) => `      - si: question${i + 1} . reponse = question${
      i + 1
    } . reponse${j}
        alors: ${q[`reponse_${j}_points`]}`
  )
  .join("\n")}
      - sinon: 0`
  )
  .join("\n")}

score:
    somme:
${Array.from({ length: 10 })
  .map((_, i) => `      - question${i + 1} . score`)
  .join("\n")}
 `);
```
