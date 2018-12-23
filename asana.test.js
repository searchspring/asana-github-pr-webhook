const asana = require('./asana');
const asanator = require('./asanator');

const asanaTask = {
  'gid': '955082368419833',
  'id': 955082368419833,
  'name': 'Ops Blog Review'
};

test('add github link to asana', async () => {
  asanator.asanaAccessToken = "temp";
  asanator.addComment = async function (var1, var2) {
    expect(var1).toEqual(asanaTask.gid);
    expect(var2).toEqual('<strong>Linked PR:</strong> my pr title\n<a href=\"http://somekindaurl\"/>');
  }
  await asana.addGithubPrToAsanaTask({ 'title': 'my pr title', 'url': 'http://somekindaurl' }, asanaTask, asanator);
});

test('find a matching asana task', async () => {
  var calls = 0;

  asanator.asanaAccessToken = "temp";
  asanator.searchByDate = async function () {
    calls++;
    if (calls === 3) {
      return [asanaTask];
    }
    return [{ 'gid': calls }];
  }
  expect(await asana.getMatchingAsanaTask("9833", asanator)).toEqual(
    asanaTask
  );
});

test('exaust api calls', async () => {

  asanator.asanaAccessToken = "temp";
  asanator.searchByDate = async function () {
    return [{ 'gid': '1' }];
  }
  expect(await asana.getMatchingAsanaTask("9833", asanator)).toEqual(null);
});

test('exaust ticket searching calls', async () => {
  var bigList = [];
  for (var i = 0; i < 1000; i++) {
    bigList.push({ 'gid': '1' });
  }
  asanator.asanaAccessToken = "temp";
  asanator.searchByDate = async function () {
    return bigList;
  }
  expect(await asana.getMatchingAsanaTask("9833", asanator)).toEqual(null);
});