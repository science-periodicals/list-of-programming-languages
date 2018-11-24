var request = require('request');
var fs = require('fs');
var url = require('url');
var ml = require('./ml');
var cheerio = require('cheerio');
var uniqBy = require('lodash/uniqBy');

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

  $('h2 ~ .div-col li a').each(function(i) {
    var $a = $(this);
    list.itemListElement.push({
      "@type": 'ListItem',
      item: {
        '@id': url.resolve(plplUrl.protocol + '//' + plplUrl.host, $a.attr('href')),
        '@type': 'ComputerLanguage',
        name: $a.text()
      }
    });
  });

  list.itemListElement = uniqBy(
    list.itemListElement.concat(ml.map(function(item) {
      return {
        "@type": 'ListItem',
        item: {
          '@id': item.url,
          '@type': 'ComputerLanguage',
          name: item.name
        }
      };
    })).sort(function(a, b) {
      return a.item.name.localeCompare(b.item.name);
    }).map(function(itemListElement, i) {
      return Object.assign(itemListElement, { position: i });
    }),
    function(itemListElement) {
      return itemListElement.item['@id'];
    }
  );

  list.numberOfItems = list.itemListElement.length;

  fs.writeFile('./data.json', JSON.stringify(list, null, 2), function(err) {
    if (err) return console.error(err);
  });
});
