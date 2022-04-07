const core = require('@actions/core');
const fs = require('fs')

// most @actions toolkit packages have async methods
async function run() {
  try {
    const gemfile = core.getInput('gemfile');
    const allowlist = core.getInput('allowlist');

    const gems = fs.readFile(gemfile, 'utf8', (err, data) => {
      if (err) {
        // TODO: Verify how if error in this scope bubbles up to the `try` block
        console.error(err)
        return
      }

      const regexp = RegExp(/gem ["|']([^"|']*)["|']/, 'g');
      const array = [...data.matchAll(regexp)].map(innerArr => innerArr[1]);

      return array
    })

    core.info(`List of gems from Gemfile: ${gems}`)

    fs.readFile(allowlist, 'utf8', (err, data) => {
      if (err) {
        // TODO: Verify how if error in this scope bubbles up to the `try` block
        console.error(err)
        return
      }

      const obj = JSON.parse(data)
      core.info(`Allowlist data:`)
      obj.gems.map(gem => core.info(gem))
    })

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
