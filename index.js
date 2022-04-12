const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs')

// most @actions toolkit packages have async methods
async function run() {
  try {
    // Get the file path to the Gemfile, will be defined in workflows/main.yml
    // The default is set as './Gemfile' as defined in action.yml
    const gemfile = core.getInput('gemfile');

    // Get the file path to the allowlist, will be defined in workflows/main.yml
    // The default is set as './allowlist.json' as defined in action.yml
    const allowlist = core.getInput('allowlist');

    // TO DO: Update the functions with args (i.e. getGems(gemfile), getAllowlist(allowlist))
    const gems = await getGems();
    const allowedGems = await getAllowlist();

    // Pre-defining a `results` object
    // This object will be composed of gem names as keys with a boolean value
    // value is `true`, if the gem is allowed
    // value is `false`, if the gem is not allowed
    const results = {};

    // Iterates through list of gems and builds the `results` object
    gems.forEach(gem => {
      results[gem] = allowedGems.some(allowedGem => {
        return allowedGem.toLowerCase() === gem.toLowerCase();
      });  
    });

    // Determine if any of the gems in the `results` object contains a `false` value 
    const hasDisallowedGems = Object.values(results).includes(false);

    // Early return if all gems are defined in the allowlist
    if (!hasDisallowedGems) return;

    // Compose a list of of gems that are not defined in the allowlist
    const disallowedGems = Object.entries(results)
      .filter(([gemName, isAllowed]) => !isAllowed)
      .map(([gemName]) => gemName);


    // MVP: Can simply just fail the job if there are any disallowed gems that are found
    // core.setFailed(`Failed due to gems not allowed: ${[...disallowedGems]}`);
    const githubToken = core.getInput('githubtoken');
    const context = github.context;
    const pull_request_number = context.payload.pull_request.number;
    const octokit = github.getOctokit(githubToken);
    const message = `Failed due to gems not allowed: ${[...disallowedGems]}`

    octokit.rest.issues.createComment(Object.assign(Object.assign({}, context.repo), { issue_number: pull_request_number, body: message }));


  } catch (error) {
    core.setFailed(error.message);
    // console.log("error:", error);
  }
}

// TODO: Remove default argument when ready to ship
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
