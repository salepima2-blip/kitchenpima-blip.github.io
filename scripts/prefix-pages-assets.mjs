import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve("out");
const repositoryPath = "/kitchenpima-blip.github.io";
const textExtensions = new Set([".css", ".html", ".js", ".json", ".map", ".txt", ".xml"]);

async function walk(directory) {
  const entries = await readdir(directory);
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry);
    const details = await stat(fullPath);

    if (details.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (textExtensions.has(path.extname(entry))) {
      files.push(fullPath);
    }
  }

  return files;
}

function prefixPublicAssets(source) {
  return source
    .replaceAll('"/images/', `"${repositoryPath}/images/`)
    .replaceAll("'/images/", `'${repositoryPath}/images/`)
    .replaceAll("&quot;/images/", `&quot;${repositoryPath}/images/`)
    .replaceAll("&#x27;/images/", `&#x27;${repositoryPath}/images/`)
    .replaceAll("url(/images/", `url(${repositoryPath}/images/`)
    .replaceAll('"/media/', `"${repositoryPath}/media/`)
    .replaceAll("'/media/", `'${repositoryPath}/media/`)
    .replaceAll("&quot;/media/", `&quot;${repositoryPath}/media/`)
    .replaceAll("&#x27;/media/", `&#x27;${repositoryPath}/media/`)
    .replaceAll("url(/media/", `url(${repositoryPath}/media/`)
    .replaceAll('"/favicon.svg', `"${repositoryPath}/favicon.svg`)
    .replaceAll("'/favicon.svg", `'${repositoryPath}/favicon.svg`)
    .replaceAll("&quot;/favicon.svg", `&quot;${repositoryPath}/favicon.svg`)
    .replaceAll("&#x27;/favicon.svg", `&#x27;${repositoryPath}/favicon.svg`);
}

for (const filePath of await walk(outputDirectory)) {
  const source = await readFile(filePath, "utf8");
  const transformed = prefixPublicAssets(source);

  if (transformed !== source) {
    await writeFile(filePath, transformed);
  }
}
