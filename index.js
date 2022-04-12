const core = require('@actions/core');
const fs = require('fs')

// most @actions toolkit packages have async methods
async function run() {
  try {
    const gemfile = core.getInput('gemfile');
    const allowlist = core.getInput('allowlist');

    // fs.readFile(gemfile, 'utf8', (err, data) => {
    // const blah = fs.readFile(`${process.cwd()}/Gemfile`, 'utf8', (err, data) => {
    //   if (err) {
    //     // TODO: Verify how if error in this scope bubbles up to the `try` block
    //     console.error(err)
    //     return
    //   }

    //   const regexp = RegExp(/gem ["|']([^"|']*)["|']/, 'g');
    //   const array = [...data.matchAll(regexp)].map(innerArr => innerArr[1]);
      
    //   core.info(`List of gems from Gemfile: ${array}`);

    //   return array;
    // })

    const gemfileRaw = fs.readFileSync(`${process.cwd()}/Gemfile`, 'utf8');
    const gems = parseGemfile(gemfileRaw);
    console.log('aaaa', gems);

    const allowlistRaw = fs.readFileSync(`${process.cwd()}/allowlist.json`, 'utf8');
    const allowedGems = parseAllowlist(allowlistRaw);
    console.log('bbbb', allowedGems);


    // fs.readFile(allowlist, 'utf8', (err, data) => {
    //   if (err) {
    //     // TODO: Verify how if error in this scope bubbles up to the `try` block
    //     console.error(err)
    //     return
    //   }

    //   const obj = JSON.parse(data)
    //   core.info(`Allowlist data:`)
    //   obj.gems.map(gem => core.info(gem))
    // })

  } catch (error) {
    core.setFailed(error.message);
  }
}

function parseGemfile(content) {
  const regexp = RegExp(/gem ["|']([^"|']*)["|']/, 'g');
  const gems = [...content.matchAll(regexp)].map(innerArr => innerArr[1]);

  return gems;
}

function parseAllowlist(content) {
  const data = JSON.parse(content)

  return data.gems;
}

run();
