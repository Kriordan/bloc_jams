var createSongRow = function(songNumber, songName, songLength) {
  var template =
      '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
  ;

  var $row = $(template);

  var clickHandler = function() {
    var songNumber = parseInt($(this).attr('data-song-number'));

    if (currentlyPlayingSongNumber !== null) {
      var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
      currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }

    if (currentlyPlayingSongNumber !== songNumber) {
      setSong(songNumber);
      currentSoundFile.play();
      $(this).html(pauseButtonTemplate);
      updatePlayerBarSong();
    } else if (currentlyPlayingSongNumber === songNumber) {
      if ( currentSoundFile.isPaused() ) {
        $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();
      } else {
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();
      }
    }
  };

  var onHover = function(event) {
    var songNumberElement = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberElement.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
      songNumberElement.html(playButtonTemplate);
    }
  };

  var offHover = function(event) {
    var songNumberElement = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberElement.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
      songNumberElement.html(songNumber);
    }
  };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;
};

var setSong = function(songNumber) {
  if (currentSoundFile) {
    currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: [ 'mp3' ],
    preload: true
  });

  setVolume(currentVolume);
};

var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};

var setCurrentAlbum = function(album) {
  currentAlbum = album;

  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

var nextSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex++;

  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }

  var lastSongNumber = currentlyPlayingSongNumber;

  setSong(currentSongIndex + 1);
  currentSoundFile.play();

  updatePlayerBarSong();

  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $previousSongNumberCell = getSongNumberCell(lastSongNumber);

  $nextSongNumberCell.html(pauseButtonTemplate);
  $previousSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex--;

  if (currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  }

  var lastSongNumber = currentlyPlayingSongNumber;

  setSong(currentSongIndex + 1);
  currentSoundFile.play();

  updatePlayerBarSong();

  var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $previousSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};

var updatePlayerBarSong = function() {
  $('.song-name').text(currentSongFromAlbum.title);
  $('.artist-name').text(currentAlbum.artist);
  $('.artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

  $('.main-controls .play-pause').html(playerBarPauseButton);
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
});
