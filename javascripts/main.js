;(function($, exports) {
  var endpoint ='http://en.wikipedia.org/w/api.php';

  function getArticles(numberOfArticles) {
    var options = {
      action: 'query',
      format: 'json',
      generator: 'random',
      grnnamespace: '0',
      grnlimit: numberOfArticles || 1,
      prop: 'extracts',
      exintro: true,
      exlimit: numberOfArticles || 1,
      // explaintext: true
    };

    function success(res) {
      var summaries = [],
        key;

      for (key in res.query.pages) {
        if (res.query.pages.hasOwnProperty(key)) {
          summaries.push({
            summary: res.query.pages[key].extract,
            title: res.query.pages[key].title
          });
        }
      }

      console.log(summaries);
    }

    function failure(res) {}

    $.ajax({
      data: options,
      dataType: 'jsonp',
      error: failure,
      success: success,
      type: 'GET',
      url: endpoint
    });
  }

  $(function() {
    getArticles();
  });

})(jQuery, window);
