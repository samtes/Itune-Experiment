'use strict';

var Album = require('../models/album');
var moment = require('moment');
var id3 = require('id3js');

exports.index = function(req, res){
  Album.findAll(function(albums){
    res.render('albums/index', {moment:moment, albums:albums, title: 'Albums'});
  });
};

exports.show = function(req, res){
  Album.findById(req.params.id, function(album){
    res.render('albums/show', {id3:id3, moment:moment, album:album, title: album.title});
  });
};

exports.new = function(req, res){
  res.render('albums/new', {title: 'New Album'});
};

exports.create = function(req, res){
  var album = new Album(req.body);
  album.addCover(req.files.cover.path);
  album.insert(function(){
    res.redirect('/');
  });
};


exports.songAdd = function(req, res){
  Album.findById(req.params.id, function(album){
    album.addSong(req.files.song.path, req.files.song.name);
    album.update(function(){
      res.redirect('/albums/' + req.params.id);
    });
  });
};


