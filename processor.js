const github = require('./github');
const asana = require('./asana');

module.exports.processWebhook = async function (data, replacementAsanator) {
    if (!github.shouldProcess(data)) {
        console.log('Skipping as no change');
        return;
    }

    // get asana prefix id
    var asanaId = github.getAsanaId(data);

    // get real asana id
    var asanaData = await asana.getMatchingAsanaTask(asanaId, replacementAsanator);

    if (asanaData) {
        // put github link on asana 
        var githubData = {};
        githubData.url = data.pull_request.html_url;
        githubData.title = data.pull_request.title;
        await asana.addGithubPrToAsanaTask(githubData, asanaData, replacementAsanator);

        // TODO put asana link on github ()
    }
}