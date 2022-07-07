const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');
const http = require('url');


async function fetchPullRequests(url) {
  
  const response = await fetch(url);

  if (response.ok) {
    return response.json()
  }
  else {
    throw `GET-request to ${url} failed!`;
  }
}

async function checkForRequest(url, name) {
  var data = await fetchPullRequests(url)
  console.log(data)
  
  let found = false;

  for (const pullrequest of data) {
      console.log(pullrequest);
      if ( pullrequest.head.ref == name ) {
          core.setOutput("pr-number", pullrequest.number);
          found = true;
          console.log(`Found PR ${pullrequest.head.ref} with number: ${pullrequest.number}`);
          break;
      }
    };
  
  if (!found) {
      throw `No PR with name ${nameOfPr} found in ${repoToCheck}! `
  }
}

function modifyURL(inputUrl) {
  const repoUrl = new URL(inputUrl);

  const pathnameArray = repoUrl.pathname.split('/');

  if( !pathnameArray[pathnameArray.length - 1].includes('pulls') ) {
      repoUrl.pathname = pathnameArray.concat('pulls').join('/');
  }

  return repoUrl;
}

try {
    // get input
    const repoToCheck = core.getInput('repo-to-check');
    const nameOfPr = core.getInput('name-of-pr');

    const url = modifyURL(repoToCheck)

    checkForRequest(url, nameOfPr)

  } catch (error) {
    core.setFailed(error.message);
  }