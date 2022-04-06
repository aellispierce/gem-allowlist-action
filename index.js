const core = require('@actions/core');
const fs = require('fs')

// most @actions toolkit packages have async methods
async function run() {
  try {
    const gemfile = core.getInput('gemfile');
    const allowlist = core.getInput('allowlist');

    fs.readFile(gemfile, 'utf8', (err, data) => {
      if (err) {
        // TODO: Verify how if error in this scope bubbles up to the `try` block
        console.error(err)
        return
      }

      const array = [...data.matchAll(regexp)].map((innerArr) => innerArr[1]);

      core.info(`List of gems from Gemfile: ${array}`)
    })

    fs.readFile(allowlist, 'utf8', (err, data) => {
      if (err) {
        // TODO: Verify how if error in this scope bubbles up to the `try` block
        console.error(err)
        return
      }

      core.info(`Allowlist data: ${data}`)
    })

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
