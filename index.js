const core = require('@actions/core');
const fs = require('fs')

// most @actions toolkit packages have async methods
async function run() {
  try {
    const gemfile = core.getInput('gemfile');
    const allowlist = core.getInput('allowlist');

    const gems = await getGems();
    const allowedGems = await getAllowlist();

    const results = {};

    gems.forEach(gem => {
      results[gem] = allowedGems.some(allowedGem => {
        return allowedGem.toLowerCase() === gem.toLowerCase();
      });  
    });

    const failed = Object.values(results).includes(false);

    if (!failed) return;

    const disallowedGems = Object.entries(results)
      .filter(([gemName, isAllowed]) => !isAllowed)
      .map(([gemName]) => gemName);
    
    console.log('not allowed', disallowedGems)
    
    
    console.log(results);
    console.log(gems)
    console.log(allowedGems)

  } catch (error) {
    // core.setFailed(error.message);
    console.log("error:", error);
  }
}

async function getGems(gemfilePath = `${process.cwd()}/Gemfile`) {
  const gemfileRaw = await fs.promises.readFile(gemfilePath, 'utf8');

  return parseGemfile(gemfileRaw);
}

function parseGemfile(content) {
  const regexp = RegExp(/gem ["|']([^"|']*)["|']/, 'g');
  const gems = [...content.matchAll(regexp)].map(innerArr => innerArr[1]);

  return gems;
}

async function getAllowlist(allowlistFilePath = `${process.cwd()}/allowlist.json`) {
  const allowlistRaw = await fs.promises.readFile(allowlistFilePath, 'utf8');

  return parseAllowlist(allowlistRaw);
}

function parseAllowlist(content) {
  const data = JSON.parse(content)
  const gems = data.gems.map(gem => gem);

  return gems;
}

run();
