import Path from "path";

export default (tsconfigPath = "./tsconfig.json") => {
  const tsconfig = require(tsconfigPath);
  const { paths, baseUrl } = tsconfig.compilerOptions;

  if (!paths) {
    return undefined;
  }

  const aliases: {
    [key: string]: string[];
  } = {};

  for (const path of Object.entries(paths)) {
    const key = path[0].replace("/*", "");
    const value = [];

    for (const val of path[1] as string[]) {
      value.push(Path.resolve(baseUrl, val.replace(/\/?\*/, "")));
    }

    aliases[key] = value;
  }

  return aliases;
};
