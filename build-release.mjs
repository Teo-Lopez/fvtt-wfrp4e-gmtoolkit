import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import { fileURLToPath } from "url"

const root = path.dirname(fileURLToPath(import.meta.url))
process.chdir(root)

const moduleJson = JSON.parse(fs.readFileSync("module.json", "utf8"))
const moduleId = moduleJson.id
const zipName = `${moduleId}.zip`

const include = [
  "apps",
  "assets",
  "css",
  "lang",
  "modules",
  "packs",
  "tables",
  "templates",
  "CHANGELOG.md",
  "LICENSE",
  "README.md",
  "module.json",
  `${moduleId}.mjs`
].filter(entry => fs.existsSync(entry))

if (include.length === 0) throw new Error("No release files found.")

const releaseDir = path.join(root, "release")
fs.mkdirSync(releaseDir, { recursive: true })

const zipPath = path.join(releaseDir, zipName)
if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath)

const psPaths = include.map(entry => `'${entry.replace(/'/g, "''")}'`).join(", ")
execSync(
  `powershell -NoProfile -Command "Compress-Archive -Path ${psPaths} -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force"`,
  { stdio: "inherit" }
)

fs.copyFileSync("module.json", path.join(releaseDir, "module.json"))

console.log(`Created ${zipPath}`)
console.log(`Copied module.json to ${path.join(releaseDir, "module.json")}`)
