'use strict';

var input = document.getElementById('text_request'),
    btn = document.getElementById('btn_request'),
    container = document.getElementById('movies');

function Request(type, q){
  this.type = type;
  this.q = q;
  this.url = 'https://www.googleapis.com/youtube/v3/';
  this.key = 'AIzaSyAO2lCCCZ_3GbpAudYCvvfsQ6WZb3-xu9w';
  this.ids = [];
}

Request.prototype.mainReq = function(){
  var xhr = new XMLHttpRequest(),
      self = this;

  xhr.open('get', this.url + 'search?' + 'key=' + this.key + '&type=' + this.type
                           + '&part=snippet' + '&maxResults=50' + '&q=' + this.q);

  xhr.onload = function () {
    var res = JSON.parse(xhr.responseText);
    var resId = res.items;
    resId.forEach(function(item){
      var id = item.id.videoId;
      self.ids.push(id);
    })
    self.res = res;
  }
  xhr.send(null);
}

Request.prototype.secRequest = function(cb) {
  var xhr = new XMLHttpRequest(),
      str = this.ids.join(','),
      self = this;

  xhr.open('get', this.url + 'videos?' + 'key=' + this.key + '&id=' + str + '&part=statistics');

  xhr.onload = function () {
    var res = JSON.parse(xhr.responseText);
    var statistics = [];
    res.items.forEach(function(item){
      var stat = item.statistics;
      statistics.push(stat);
    })
    for (var i = 0; i < 50; i++) {
      self.res.items[i].statistics = statistics[i];
    }
    cb(self.res)
  }
  xhr.send(null);
}


Request.prototype.show = function(res){
  var output = '',
      respond = res.items;

  respond.forEach(function(i){
    var img = i.snippet.thumbnails.medium.url,
        title = i.snippet.title.slice(0, 36),
        chTitle = i.snippet.channelTitle,
        date = i.snippet.publishedAt.slice(0, 10),
        view = i.statistics.viewCount,
        link = i.id.videoId;

    output += '<div class="container"><img src=' + img + '></img><div class="title">' + title + '...</div><div class="container_info"><div class="icons"></><i class="fa fa-user fa-2x" aria-hidden="true"></i><i class="fa fa-calendar fa-2x" aria-hidden="true"></i><i class="fa fa-eye fa-2x" aria-hidden="true"></i></div class="info"><div class="info"><span>' + chTitle + '</span><span>' + date + '</span><span>' + view + '</span></div></div><a href="https://www.youtube.com/watch?v=' + link + '" target="_blank">Watch</a></div>';
  })
  container.innerHTML = output;
}

btn.addEventListener('click', function(e){
  var youTube = new Request('video', input.value);
  youTube.mainReq();

  setTimeout(function(){
    youTube.secRequest(youTube.show);
  }, 1000)

  return false;
})
