import fs from "fs-extra";
import path from "path";

const CHANGE_LOG = "CHANGELOG.md";

// 解析 CHANGELOG.md 文件，获取更新信息
export async function resolveChangeLog(tag) {
  const cwd = process.cwd();

  const reTitle = /^## \[[\d\.]+\]/;
  const reEnd = /^---/;

  const file = path.join(cwd, CHANGE_LOG);

  if (!(await fs.pathExists(file))) {
    throw new Error("could not found CHANGELOG.md");
  }

  const data = await fs.readFile(file).then((d) => d.toString("utf8"));

  const map = {};
  let p = "";

  data.split("\n").forEach((line) => {
    if (reTitle.test(line)) {
      const startbrackets = line.indexOf("[");
      const endbrackets = line.indexOf("]");
      p = line.slice(startbrackets + 1, endbrackets);
      if (!map[p]) {
        map[p] = [];
      } else {
        throw new Error(`Tag ${p} dup`);
      }
    } else if (reEnd.test(line)) {
      p = "";
    } else if (p) {
      map[p].push(line);
    }
  });

  if (!map[tag]) {
    throw new Error(`could not found "${tag}" in CHANGELOG.md`);
  }

  return map[tag].join("\n").trim();
}