const DISCORD = "https://discord.gg/5E45u5eES";
const HEADER = `--[[ MIMOSA VM v4.5 - ${DISCORD} - 15KB ]]`;
const IL_POOL = ["I1","l1","v1","v2","v3","II","ll","vv","v4","v5","I2","l2","vI","Iv","v6","I3","lI","Il"];

function generateIlName() {
  return IL_POOL[Math.floor(Math.random() * IL_POOL.length)] + Math.floor(Math.random() * 9999);
}
function lightMath(n) {
  let a = Math.floor(Math.random() * 90) + 20, b = Math.floor(Math.random() * 60) + 10;
  return `(${n}+${a}*${b}-${a})`;
}
function stringToMath(str) {
  return `{${str.split('').map(c => lightMath(c.charCodeAt(0))).join(',')}}`;
}
function mba() {
  let n = Math.random() > 0.5 ? 1 : 2, a = Math.floor(Math.random() * 70) + 15, b = Math.floor(Math.random() * 40) + 8;
  return `((${n}*${a}-${a})/(${b}+1)+${n})`;
}
function generateJunk(lines = 144) {
  let j = '';
  for (let i = 0; i < lines; i++) {
    const r = Math.random();
    if (r < 0.25) j += `local ${generateIlName()}=${lightMath(Math.floor(Math.random() * 9999))}; `;
    else if (r < 0.5) j += `local ${generateIlName()}=${mba()}; `;
    else if (r < 0.75) j += `local ${generateIlName()}=${lightMath(mba())}; `;
    else j += `local ${generateIlName()}=(${mba()}+${lightMath(Math.floor(Math.random() * 999))}); `;
  }
  return j;
}
const MAPEO = {
  "ScreenGui":"Aggressive Renaming","Frame":"String to Math","TextLabel":"Table Indirection",
  "TextButton":"Mixed Boolean Arithmetic","TextBox":"Aggressive Renaming","ImageLabel":"Size-Based Execution Switch",
  "Humanoid":"Dynamic Junk","Player":"Fake Flow","Character":"Math Encoding","Part":"Literal Obfuscation",
  "Camera":"Table Indirection","TweenService":"Fake Flow","RunService":"Virtual Machine",
  "UserInputService":"Mixed Boolean Arithmetic","RemoteEvent":"Fake Flow","Workspace":"Reverse If",
  "Lighting":"Size-Based Execution Switch","Players":"Fake Flow","ReplicatedStorage":"Table Indirection","StarterGui":"String to Math"
};
function detectAndApplyMappings(code) {
  let modified = code, headers = "";
  const sorted = Object.entries(MAPEO).sort((a, b) => b[0].length - a[0].length);
  for (const [word, tech] of sorted) {
    const regex = new RegExp(`(game\\s*\\.\\s*|\\b\\.\\s*)?\\b${word}\\b`, "g");
    if (regex.test(modified)) {
      let replacement = `"${word}"`;
      if (tech.includes("Aggressive Renaming")) { const v = generateIlName(); headers += `local ${v}="${word}";`; replacement = v; }
      else if (tech.includes("String to Math")) replacement = `string.char(${stringToMath(word)})`;
      else if (tech.includes("Table Indirection")) { const t = generateIlName(); headers += `local ${t}={"${word}"};`; replacement = `${t}[1]`; }
      else if (tech.includes("Mixed Boolean Arithmetic")) replacement = `((${mba()}==1 or true)and"${word}")`;
      else if (tech.includes("Fake Flow")) replacement = `(function()return ${mba()}==1 and"${word}"or"${word}"end)()`;
      else if (tech.includes("Virtual Machine")) replacement = `loadstring("return '${word}'")()`; 
      regex.lastIndex = 0;
      modified = modified.replace(regex, (match, prefix) => {
        if (prefix) return prefix.includes("game") ? `game[${replacement}]` : `[${replacement}]`;
        return replacement;
      });
    }
  }
  return headers + modified;
}
function obfuscate(sourceCode) {
  if (!sourceCode || typeof sourceCode !== 'string') return '--ERROR';
  let preProcessed = detectAndApplyMappings(sourceCode);
  const seed = Date.now() + Math.random() * 99999999;
  const xorKeyBase = Math.floor(seed % 2147483647) + 1;
  const bytes = preProcessed.split('').map((char, i) => {
    let val = char.charCodeAt(0) ^ (xorKeyBase + i * 5);
    val = val ^ (xorKeyBase >>> 4);
    return val & 0xFF;
  });
  const VM_DATA = generateIlName(), XOR_KEY = generateIlName(), PC = generateIlName(), STACK = generateIlName(), DECODER = generateIlName();
  let vm = HEADER + '\n' + generateJunk(144);
  vm += `local ${VM_DATA}=${stringToMath(JSON.stringify(bytes))}; `;
  vm += `local ${XOR_KEY}=${mba()}; `;
  vm += `local ${PC}=1; local ${STACK}=""; `;
  vm += `local ${DECODER}=function() ${generateJunk(63)} while ${PC}<=#${VM_DATA} do local b=${VM_DATA}[${PC}]; ${STACK}=${STACK}..string.char(b~${XOR_KEY}); ${PC}=${PC}+1; if ${mba()}==2 then ${generateJunk(3)} end; end; return ${STACK}; end; `;
  vm += `local payload=(loadstring or load)(${DECODER}());payload(); `;
  vm += generateJunk(126);
  vm = vm.replace(/\n/g, ' ').replace(/\s+/g, ' ').replace(/\s*([=+\-*/{},;])\s*/g, '$1');
  return `return(function()${vm}end)();`;
}
module.exports = { obfuscate };
