import fs from "fs"
import path from "path"

const CORE_VERSION = "14.360"
const scriptsDir = path.join("scripts", "macros")
const macroPacksDir = path.join("src", "packs", "gm-toolkit-macros")
const tablePacksDir = path.join("src", "packs", "gm-toolkit-tables")

/** Macro display name → script filename under scripts/macros/ */
const MACRO_SCRIPT_MAP = {
  "Add Advantage": "add-advantage.js",
  "Add XP": "add-xp.js",
  "Change Scene to Yards": "change-scene-to-yards.js",
  "Check Conditions": "check-conditions.js",
  "Clear Advantage": "clear-advantage.js",
  "Send Dark Whispers": "dark-whispers.js",
  "Launch Damage Console": "launch-damage-console.js",
  "Make Secret Group Test": "make-secret-group-test.js",
  "Pull Everyone to Scene": "pull-everyone-to-scene.js",
  "Reduce Advantage": "reduce-advantage.js",
  "Reset Fortune": "reset-fortune.js",
  "Session Turnover": "session-turnover.js",
  "Set Token Vision and Light": "set-token-vision-light.js",
  "Toggle Compendium Pack Visibility": "toggle-compendium-pack-visibility.js",
  "Toggle Scene Visibility and Light": "toggle-scene-vision-light.js",
  "GM Toolkit Settings": "quick-settings.js",
  "GM Toolbox": "macro-toolbox.js"
}

function updateCoreVersion (doc) {
  if (doc._stats) doc._stats.coreVersion = CORE_VERSION
  if (Array.isArray(doc.results)) {
    for (const result of doc.results) {
      if (result._stats) result._stats.coreVersion = CORE_VERSION
    }
  }
  if (doc._stats) return
}

function syncPackFile (filePath) {
  const doc = JSON.parse(fs.readFileSync(filePath, "utf8"))
  const scriptFile = MACRO_SCRIPT_MAP[doc.name]
  if (scriptFile) {
    const scriptPath = path.join(scriptsDir, scriptFile)
    if (fs.existsSync(scriptPath)) {
      doc.command = fs.readFileSync(scriptPath, "utf8")
      console.log(`Synced command: ${doc.name}`)
    } else {
      console.warn(`Missing script for ${doc.name}: ${scriptPath}`)
    }
  } else {
    console.log(`coreVersion only: ${doc.name}`)
  }
  updateCoreVersion(doc)
  fs.writeFileSync(filePath, `${JSON.stringify(doc, null, 2)}\n`)
}

for (const file of fs.readdirSync(macroPacksDir)) {
  if (file.endsWith(".json")) syncPackFile(path.join(macroPacksDir, file))
}

for (const file of fs.readdirSync(tablePacksDir)) {
  if (!file.endsWith(".json")) continue
  const filePath = path.join(tablePacksDir, file)
  const doc = JSON.parse(fs.readFileSync(filePath, "utf8"))
  updateCoreVersion(doc)
  fs.writeFileSync(filePath, `${JSON.stringify(doc, null, 2)}\n`)
  console.log(`Updated table pack: ${doc.name}`)
}

console.log("Done.")
