import fs from "fs-extra";
import { createRequire } from "module";
import { execSync } from "child_process";
import { resolveChangeLog } from "./updatelog.mjs";

const require = createRequire(import.meta.url);

// 自动更新版本，添加对应 tag 并推送至仓库
async function resolvePublish() {
  const flag = process.argv[2] ?? "patch";
  const packageJson = require("../package.json");
  const tauriJson = require("../src-tauri/tauri.conf.json");

  let [a, b, c] = packageJson.version.split(".").map(Number);
  if (flag === "major") {
    a += 1;
    b = 0;
    c = 0;
  } else if (flag === "minor") {
    b += 1;
    c = 0;
  } else if (flag === "patch") {
    c += 1;
  } else throw new Error(`invalid flag "${flag}"`);

  const nextVersion = `${a}.${b}.${c}`;
  packageJson.version = nextVersion;
  tauriJson.package.version = nextVersion;

  // 发布更新前需要先写更新日志
  // await resolveChangeLog(nextVersion);

  await fs.writeFile(
    "./package.json",
    JSON.stringify(packageJson, undefined, 2)
  );
  await fs.writeFile(
    "./src-tauri/tauri.conf.json",
    JSON.stringify(tauriJson, undefined, 2)
  );

  execSync("git add ./package.json");
  execSync("git add ./src-tauri/tauri.conf.json");
  execSync(`git commit -m "release: v${nextVersion}"`);
  execSync(`git push`);
  execSync(`npm run changelog`);
  execSync("git add ./CHANGELOG.md");
  execSync(`git commit -m "chore: update v${nextVersion} changelog"`);
  execSync(`git tag -a v${nextVersion} -m "v${nextVersion}"`);
  execSync(`git push`);
  execSync(`git push origin v${nextVersion}`);
  console.log(`Publish Successfully...`);
}

resolvePublish();