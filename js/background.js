(function(){

  /** 
  * TODO: 
  *     `chrome.browserAction.setBadgeText({text: "1"});
  *      whenever a new feed item is found, attach a badge number to extension icon
  */


  var FeedReader = function() {

    // url from which the news feed is to be fetched
    // var feedUrl = '../xmlfeed.xml'; // local feed
    var feedUrl = 'http://www.gcuf.edu.pk/feed';

    // Where to append the news feed
    var newsHolder = $('.news-feed');

    // What to add before and after feed content e.g. '<ul>'' and '</ul>' respectively
    var beforeFeed = '<ul>';
    var afterFeed = '</ul>'

    // What to append before and after the feed item e.g. '<li>' and '</li>' respectively
    var beforeFeedItem = '<li>';
    var afterFeedItem = '</li>';

    function performAjaxSetup() {
      $(document).ajaxStart(function() {
        $("#reload").html('Loading... Please wait!');
        $('#reload').off();
      });

      $(document).ajaxComplete(function(event, xhr, settings) {
        $("#reload").html('Reload.');
        feed.bindUI();
      });
    }

    var feed = {

      xml : '',

      init : function() {

        this.bindUI();
        performAjaxSetup();
        this.loadFeed();

      }, // end init

      bindUI : function() {

        $('#reload').on('click', function () {
          feed.loadFeed();
        });

      }, // end `bindUI` function

      loadFeed : function() {

        this.fetchFeed();

      }, // end `loadFeed` function


      fetchFeed : function () {

        newsHolder.empty();

        $.ajax({
          
          url : feedUrl,
          dataType : 'xml',
          method : 'post',
          
          beforeSend : function () { },
          
          success : function ( xml ) { 
            
            feed.populateExt( xml );
          },

          complete : function () { },
        });

      }, // end `fetchFeed`

      /**
      * Parse the `xml` feed and append the result to extension
      */
      populateExt : function ( xml ) {

        var anchors = beforeFeed;

        $(xml).find('item').each(function( index, elem ){
          
          var title = $(elem).find('title').text().trim();
          var link = $(elem).find('link').text().trim();
          var pubDate = $(this).find('pubDate').text().trim().substring(0,16);

          var anchor = beforeFeedItem + '<a href="' + link + '" target="_blank" title="' + pubDate + '">' + title + '</a>' + afterFeedItem;
          anchors += anchor;
        });

        anchors += afterFeed;

        newsHolder.append(anchors);

      } // end `populateExt` function

    }; // end `feed` object

    return feed;

  }; // end FeedReader


  // When the document is ready.
  $(function(){

    var gcufFeed = new FeedReader();
    gcufFeed.init();

  });

})();