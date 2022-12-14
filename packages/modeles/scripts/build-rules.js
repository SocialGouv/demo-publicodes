/* eslint-env node */
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import Engine from "publicodes";
import camelCase from "camelcase";

const publicodesDir = "./règles";
const outDir = "./dist";

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

function recursiveFindYamlFile(dirPath = publicodesDir) {
  return fs
    .readdirSync(dirPath)
    .flatMap((filename) => {
      const fullpath = path.join(dirPath, filename);
      if (fs.statSync(fullpath).isDirectory()) {
        return recursiveFindYamlFile(fullpath);
      } else {
        return filename.endsWith(".yaml") ? fullpath : false;
      }
    })
    .filter(Boolean);
}

function readRawRules(folder) {
  return recursiveFindYamlFile(path.join(publicodesDir, folder))
    .map((fullpath) => fs.readFileSync(fullpath, "utf-8").toString())
    .join("\n"); // YAML separator
  /*(yaml, filePath) => {
      const newYaml = fs.readFileSync(filePath, "utf-8").toString()
      // const newRules = yaml.load(fs.readFileSync(filePath, "utf-8"), {
      //   filename: filePath,
      // });
      const duplicatedRule =
        newRules && Object.keys(newRules).find((ruleName) => ruleName in rules);
      if (duplicatedRule) {
        throw new Error(
          `La règle ${duplicatedRule} a été redéfinie dans dans le fichier ${filePath}, alors qu'elle avait déjà été définie auparavant dans un autre fichier`
        );
      }
      return Object.assign(rules, newRules);
    },
    []
  );*/
}

function writeJSFile(folder) {
  const rawYamls = readRawRules(folder);
  const rules = yaml.load(rawYamls);
  const names = Object.keys(new Engine(rules).getParsedRules());
  // const rawYaml = fs
  //   .readFileSync(path.join(publicodesDir, folder, "publicodes.yaml"), "utf-8")
  //   .toString();

  const jsString = `export const rules = ${JSON.stringify(rules, null, 2)};

export const yaml = \`${rawYamls}\`;`;

  const outDir2 = path.join(outDir, folder);
  if (!fs.existsSync(outDir2)) {
    fs.mkdirSync(outDir2);
  }
  fs.writeFileSync(path.resolve(outDir2, "index.js"), jsString);

  fs.writeFileSync(
    path.resolve(outDir2, "index.d.ts"),
    `\nexport type Names = ${names.map((name) => `"${name}"`).join("\n  | ")}\n`
  );
}

export default function writeJSFiles() {
  const publicodeModeles = fs
    .readdirSync(publicodesDir)
    .flatMap((filename) => {
      const fullpath = path.join(publicodesDir, filename);
      if (
        fs.statSync(fullpath).isDirectory() &&
        fs.statSync(path.join(fullpath, "publicodes.yaml")).isFile()
      ) {
        return filename;
      }
    })
    .filter(Boolean)
    .map((folderName) => {
      writeJSFile(folderName);
      return folderName;
    });

  const index = `

${publicodeModeles
  .map(
    (modeleName) =>
      `import * as ${camelCase(modeleName)} from "./${modeleName}";`
  )
  .join("\n")}

export default { ${publicodeModeles
    .map((modeleName) => camelCase(modeleName))
    .join(", ")} };
`;

  fs.writeFileSync(path.resolve(outDir, "index.js"), index);
}

writeJSFiles();
