var express = require('express');
var router = express.Router();
var piblaster = require('pi-blaster.js');
var GPIO = require('onoff').Gpio,
led = new GPIO(18, 'out');

var img_flag = 0 ;
var cameraOptions = {
  width : 600,
  height : 420,
  mode : 'timelapse',
  awb : 'off',
  encoding : 'jpg',
  output : 'public/images/camera.jpg',
  q : 50,
  timeout : 10000,
  timelapse : 0,
  nopreview : true,
  th : '0:0:0'
};

var camera = new require('raspicam')(cameraOptions) ;
camera.start() ;

camera.on('exit', function() {
    camera.stop() ;
    console.log('Restart camera') ;
    camera.start() ;
  }) ;

camera.on('read', function() {
    img_flag = 1 ;
  }) ;

/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('index', {title: '반려동물자동급식기'}) ;
  }) ;

router.get('/img', function (req, res, next) {
//    console.log('get /img') ;
      if (img_flag == 1) {
        img_flag = 0 ;
        res.sendfile('public/images/camera.jpg') ;
      }
  }) ;


router.post('/data', function(req, res, next) {
	var state = req.body.led;
  console.log(req.body.led + "hello");
	if( state == 'feed') {
    piblaster.setPwm(22,0.145);
    setTimeout(function () {
          piblaster.setPwm(22, 0.1);
          console.log('box is locked');
    },500);
	} else {
    console.log("nothing happen");
  }
	// console.log(state);
  res.redirect('/');
});

module.exports = router;
