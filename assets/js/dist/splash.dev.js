"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

console.log('Welcome!');
var stream = new Audio();
var playButton = document.getElementById('playButton');
stream.volume = 0.7;

var updateStats = function updateStats() {
  var res, body, song, history;
  return regeneratorRuntime.async(function updateStats$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch("/api/nowplaying?_=".concat(new Date().getTime())));

        case 2:
          res = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(res.json());

        case 5:
          body = _context.sent;
          console.log('Fetched stats', body); // DOM updates

          song = body.song;
          (document.querySelectorAll('img.song-art') || []).forEach(function (image) {
            return image.src = song.art;
          });
          (document.querySelectorAll('.song-name') || []).forEach(function (el) {
            return el.innerText = song.name;
          });
          (document.querySelectorAll('.song-artist') || []).forEach(function (el) {
            return el.innerText = song.artist;
          });
          (document.querySelectorAll('img.next-art') || []).forEach(function (image) {
            return image.src = body.next.art;
          });
          (document.querySelectorAll('.next-name') || []).forEach(function (el) {
            return el.innerText = body.next.name;
          });
          (document.querySelectorAll('.next-artist') || []).forEach(function (el) {
            return el.innerText = body.next.artist;
          });
          (document.querySelectorAll('.listeners') || []).forEach(function (el) {
            return el.innerText = body.listeners + ' listener' + (body.listeners == 1 ? '' : 's');
          });
          (document.querySelectorAll('.dj') || []).forEach(function (el) {
            return el.innerText = body.dj;
          });
          history = body.history.map(function (song) {
            return "\n            <div class=\"history-item\">\n                <img src=\"".concat(song.art, "\">\n                <div class=\"history-text\">\n                    <p class=\"history-name\">").concat(song.name, "</p>\n                    <p class=\"history-artist\">").concat(song.artist, "</p>\n                </div>\n            </div>\n        ");
          });
          (document.querySelector('#recentlyPlayedBox .blur-background > img') || {}).src = body.history[0].art;
          (document.querySelector('.recently-played') || {}).innerHTML = history.join('\n');

          if (document.getElementById('recentlyPlayedBox')) {
            (document.getElementById('recentlyPlayedBox') || {
              style: {}
            }).style.height = _toConsumableArray(document.querySelectorAll('.middle-col > .box')).map(function (a, i, arr) {
              return i == arr.length - 1 ? a.offsetHeight : a.offsetHeight + 20;
            }).reduce(function (a, b) {
              return a + b;
            }) + 'px';
            (document.getElementById('recentlyPlayedBox') || {
              style: {}
            }).style.maxHeight = 'unset';
          }

          ;

        case 21:
        case "end":
          return _context.stop();
      }
    }
  });
};

updateStats();
setInterval(updateStats, 5 * 1000);

var openModal = function openModal(qs) {
  var modal = document.querySelector(qs);
  if (!modal) return new Error('Modal does not exist!');
  modal.classList.add('open');
  return true;
};

var closeModal = function closeModal(qs) {
  var modal = document.querySelector(qs);
  if (!modal) return new Error('Modal does not exist!');
  modal.classList.remove('open');
  return true;
};

window.addEventListener('resize', function () {
  document.getElementById('recentlyPlayedBox').style.maxHeight = _toConsumableArray(document.querySelectorAll('.middle-col > .box')).map(function (a, i, arr) {
    return i == arr.length - 1 ? a.offsetHeight : a.offsetHeight + 20;
  }).reduce(function (a, b) {
    return a + b;
  }) + 'px';
  if (window.innerWidth < 992) window.location.href = '/mobile.html';
});

var togglePlayback = function togglePlayback(cb) {
  if (stream.paused) {
    playButton.className = 'fa fa-ellipsis-h fa-fw';
    stream.src = 'https://staff.itsrave.net/radio/8000/radio.mp3';
    stream.play().then(function () {
      playButton.className = 'fa fa-pause fa-fw';
    })["catch"](function () {
      return !cb && togglePlayback(true);
    });
  } else {
    playButton.className = 'fa fa-play fa-fw';
    stream.src = '';
    stream.pause();
  }

  ;
};

playButton.onclick = togglePlayback;
if (window.innerWidth < 992) window.location.href = '/mobile.html';