const core = require('@actions/core');
const fs = require('fs')

// most @actions toolkit packages have async methods
async function run() {
  try {
    const gemfile = core.getInput('gemfile');
    const allowlist = core.getInput('allowlist');

    const gems = getGems();
    const allowedGems = getAllowlist();

    const results = {};

    gems.forEach(gem => {
      results[gem] = allowedGems.includes(gem);  
    });

    const failed = Object.values(results).includes(false);

    if (failed) {
      const disallowedGems = Object.entries(results)
        .filter(([gemName, isAllowed]) => !isAllowed)
        .map(([gemName]) => gemName);
      
      console.log('not allowed', disallowedGems)
    }
    results

    // const results = gems.reduce((data, gem) => {
    //   return {...data, [gem]: allowedGems.includes(gem)}
    // }, {})
    
    console.log(results);
    console.log(gems)
    console.log(allowedGems)

  } catch (error) {
    // core.setFailed(error.message);
    console.log("error:", error);
  }
}

function getGems(gemfilePath = `${process.cwd()}/Gemfile`) {
  const gemfileRaw = fs.readFileSync(gemfilePath, 'utf8');

  return parseGemfile(gemfileRaw);
}

function parseGemfile(content) {
  const regexp = RegExp(/gem ["|']([^"|']*)["|']/, 'g');
  const gems = [...content.matchAll(regexp)].map(innerArr => innerArr[1]);

  return gems;
}

function getAllowlist(allowlistFilePath = `${process.cwd()}/allowlist.json`) {
  const allowlistRaw = fs.readFileSync(allowlistFilePath, 'utf8');

  return parseAllowlist(allowlistRaw);
}

function parseAllowlist(content) {
  const data = JSON.parse(content)
  const gems = data.gems.map(gem => gem);

  return gems;
}

run();
