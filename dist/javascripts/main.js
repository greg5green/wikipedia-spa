;(function($, handlebars) {
  'use strict';

  var summariesTemplate,
    errorTemplate;

  function setupTemplates() {
    var summaryTemplateSource = $("#summaries").html(),
      errorTemplateSource = $('#errors').html();

    // Definte a helper function
    handlebars.registerHelper('formatTitleLink', function(title) {
      return 'http://en.wikipedia.org/wiki/' + title.replace(' ', '_');
    });

    // Compile the templates
    summariesTemplate = handlebars.compile(summaryTemplateSource);
    errorTemplate = handlebars.compile(errorTemplateSource);
  }

  function getArticles(numberOfArticles, openInNewWindow) {
    var options = {
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
      success: function(res) {
        displayArticles(res, openInNewWindow);
      },
      type: 'GET',
      url: 'http://en.wikipedia.org/w/api.php'
    });
  }

  function displayArticles(res, openInNewWindow) {
    var summaries = [],
      key;

    // Build an array of summaries that we can pass to our templates
    for (key in res.query.pages) {
      if (res.query.pages.hasOwnProperty(key)) {
        summaries.push({
          openInNewWindow: openInNewWindow,
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

  function refreshArticles() {
    var numberOfArticles = document.getElementById('numberOfArticles').value,
      openInNewWindow = document.getElementById('openInNewWindow').checked;

    getArticles(numberOfArticles, openInNewWindow);
  }

  $(function() {

    // Setup our templates
    setupTemplates();

    // Request the initial article
    getArticles();

    // Setup listener to get new articles
    $('#refreshBtn').on('click', refreshArticles);

  });

})(jQuery, Handlebars);
