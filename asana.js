var asanator = require('./asanator');

module.exports.addGithubPrToAsanaTask = async function (githubData, asanaData, replacementAsanator) {
    if (replacementAsanator) {
        asanator = replacementAsanator;
    }
    var comment = '';
    comment += '<strong>Linked PR:</strong> ' + githubData.title + '\n<a href="' + githubData.url + '"/>'
    await asanator.addComment(asanaData.gid, comment);
};

module.exports.getMatchingAsanaTask = async function (id, replacementAsanator) {
    if (replacementAsanator) {
        asanator = replacementAsanator;
    }
    var d1 = new Date();
    var d2 = new Date(d1);
    var lookedAt = 0;
    var callsMade = 0;
    var hoursInc = 3;
    while (lookedAt < 10000 && callsMade < 100) {
        d2.setHours(d2.getHours() - hoursInc);
        
        var rows = [];
        try {
            console.log('asana request - search by date ' + callsMade);
            rows = await asanator.searchByDate(d1, d2); 
        } catch (error) {
            console.error(error);
        }
        callsMade++;
        lookedAt += rows.length;
        console.log('found ' + rows.length + ' items');
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].gid.toString().endsWith(id)) {
                console.log("Made " + callsMade + ' calls to asana api - found: ' + JSON.stringify(rows[i]));
                return rows[i];
            }
        }
        d1.setHours(d1.getHours() - hoursInc);
    }

    console.log("failed to find id: " + id + ' in ' + callsMade + ' calls to asana api');
    return null;
}