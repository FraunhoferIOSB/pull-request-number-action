const core = require('@actions/core');
const github = require('@actions/github');
const { curly } = require('node-libcurl');

try {
    // get input
    const repoToCheck = core.getInput('repo-to-check');
    const nameOfPr = core.getInput('name-of-pr');
    console.log(`Checking Repo ${repoToCheck} for PR with name ${nameOfPr}`);

    const { statusCode, data, headers } = await curly.get(repoToCheck)
    console.log(`Get returned ${statusCode}`)
    if (statusCode == 200) {
        let found = false;

        for (const pr of data.array) {
            console.log(element);
            if ( pr.head.ref == nameOfPr ) {
                core.setOutput("pr-number", pr.number);
                found = true;
                console.log(`Found PR ${pr.head.ref} with number: ${pr.number}`);
                break;
            }
          };
        
        if (!found) {
            throw `No PR with name ${nameOfPr} found in ${repoToCheck}! `
        }
    }
    else throw `GET-request to ${repoToCheck} failed with ${statusCode}!`
  } catch (error) {
    core.setFailed(error.message);
  }