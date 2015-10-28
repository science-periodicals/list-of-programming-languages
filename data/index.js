var request = require('request'),
    fs = require('fs'),
    url = require('url'),
    cheerio = require('cheerio');

var packageJson = require('../package');

var lplUrl = 'http://en.wikipedia.org/wiki/List_of_programming_languages';
var plplUrl = url.parse(lplUrl);

request.get(lplUrl, function(err, resp, body) {
  if (err) return console.err(err);

  var html = body.toString();
  var $ = cheerio.load(html);

  var list = {
    '@context': 'http://schema.org',
    '@type': ['ItemList', 'CreativeWork'],
    'inLanguage': 'English',
    'description': $('#mw-content-text p').eq(0).text(),
    'version': packageJson.version,
    'dateModified': (new Date()).toISOString(),
    'isBasedOnUrl': lplUrl,
    'itemListOrder': 'schema:ItemListOrderAscending',
    'numberOfItems': 0,
    'itemListElement': [],
  };

  $('h2 ~ table li a').each(function(i) {
    var $a = $(this);
    list.itemListElement.push({
      "@type": 'ListItem',
      'position': i,
      item: {
        '@id':url.resolve(plplUrl.protocol + '//' + plplUrl.host, $a.attr('href')),
        '@type': 'Language',
        name: $a.text()
      }
    });
  });

  list.numberOfItems = list.itemListElement.length;

  fs.writeFile('data.jsonld', JSON.stringify(list, null, 2), function(err) {
    if (err) return console.err(err);
  });
});
