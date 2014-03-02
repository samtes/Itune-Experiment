'use strict';

module.exports = Album;

var albums = global.nss.db.collection('albums');
var fs = require('fs');
var path = require('path');
var Mongo = require('mongodb');
var _ = require('lodash');
var id3 = require('id3js');

function Album(album){
  this.title = album.title;
  this.artist = album.artist;
  this.releaseyear = new Date(album.releaseyear);
  this.songs = [];
}

Album.prototype.addCover = function(oldpath){
  var albumTitle = this.title.replace(/\s/g, '').toLowerCase();
  var albumArtist = this.artist.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/img/' + albumArtist + '-' + albumTitle;

  var extension = path.extname(oldpath);
  relpath += extension;
  fs.renameSync(oldpath, abspath + relpath);

  this.cover = relpath;
};

Album.prototype.addSong = function(oldpath, fileName){
  var songTitle = fileName.replace(/\s/g, '').toLowerCase();
  var albumTitle = this.title.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/audios/';
  relpath += albumTitle + '-' + songTitle;

  fs.renameSync(oldpath, abspath + relpath);

  this.songs.push(relpath);
};

Album.prototype.insert = function(fn){
  albums.insert(this, function(err, records){
    fn(err);
  });
};

Album.prototype.update = function(fn){
  albums.update({_id:this._id}, this, function(err, count){
    fn(err, count);
  });
};

Album.findAll = function(fn){
  albums.find().toArray(function(err, records){
    fn(records);
  });
};

Album.findById = function(id, fn){
  var _id = new Mongo.ObjectID(id);

  albums.findOne({_id:_id}, function(err, record){
    fn(_.extend(record, Album.prototype));
  });
};

Album.prototype.parseSong = function(songPath, fn){
  id3(songPath, function(err, tags){
    fn(tags);
  });
};







