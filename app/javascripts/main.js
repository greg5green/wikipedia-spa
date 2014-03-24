;(function($, handlebars) {
  'use strict';

  var errorTemplate,
    summariesTemplate;

  function displayArticles(res) {
    var summaries = [],
      key;

    // Build an array of summaries that we can pass to our templates
    for (key in res.query.pages) {
      if (res.query.pages.hasOwnProperty(key)) {
        summaries.push({
          openInNewWindow: document.getElementById('openInNewWindow').checked,
          summary: res.query.pages[key].extract,
          title: res.query.pages[key].title
        });
      }
    }

    $('.content').html(summariesTemplate({ summaries: summaries }));
  }

  function displayError() {
    $('.content').html(errorTemplate());
  }

  function getArticles() {
    var numberOfArticles = document.getElementById('numberOfArticles').value,
      options = {
        action: 'query',
        format: 'json',
        generator: 'random',
        grnnamespace: '0',
        grnlimit: numberOfArticles || 1,
        prop: 'extracts',
        exintro: true,
        exlimit: numberOfArticles || 1
      };

    $.ajax({
      cache: true,
      data: options,
      dataType: 'jsonp',
      error: displayError,
      success: displayArticles,
      type: 'GET',
      url: 'http://en.wikipedia.org/w/api.php'
    });
  }

  function setupTemplates() {
    var summaryTemplateSource = $("#summaries").html(),
      errorTemplateSource = $('#errors').html();

    // Definte a couple helper functions
    handlebars.registerHelper('formatTitleLink', function(title) {
      return 'http://en.wikipedia.org/wiki/' + title.replace(' ', '_');
    });
    handlebars.registerHelper('cleanSummary', function(summary) {
console.log(summary);
      // Return our summary with empty tags removed as Wikipedia's content can be pretty messy
      return summary.replace(/<[0-9A-Za-z]+><\/[0-9A-Za-z]>/g, '');
    });

    // Compile the templates
    summariesTemplate = handlebars.compile(summaryTemplateSource);
    errorTemplate = handlebars.compile(errorTemplateSource);
  }

  $(function() {

    // Setup our templates
    setupTemplates();

    // Request the initial article
    getArticles();

    // Setup listener to get new articles
    $('#refreshBtn').on('click', getArticles);

  });

})(jQuery, Handlebars);
