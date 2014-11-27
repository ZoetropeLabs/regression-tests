var http = require('http-get');
var fs = require('fs');
var winston = require('winston');
var im = require('easyimage');
var gm = require('gm');
var imgencoder = require('images');
var protractor = require('protractor');


var testPage =  function () {


	this.ptor = protractor.getInstance();

	var branch = process.env.TRAVIS_BRANCH;


	this.elements = {
		progressWrapper : '.zoe-progress-wrapper',

		widgetOverlay : '#zoe-zbox-overlay',
		widgetTrigger : '.zoe-engage-trigger>img',
		widgetColorbox : '#zoe-zbox-content',

		helpButton : '.zoe-btn-help',
		helpElement : '.zoe-help-overlay',
		zoomButton : '.zoe-btn-zoom',
		zoomElement : '.zoe-zoom',
		zoomImage : '.zoe-zoom-frame',
		closeButton : '.zoe-btn-close',

		widgetImageDiv : '.zoe-engage-image.reel',
		inlineDivSelector : '.zoe-inline.reel',
		widgetWrapperSelector : '.zoe-engage-wrapper',
		widgetWrapperImage : '.zoe-frame',
		pageImageSelector : '.zoe-engage-wrapper',
		inlineTrigger : 'a.zoe-engage-trigger',
		inlineWrapper : '.zoe-engage-wrapper.zoe-inline',
		frameSelector : '.zoe-frame',

		interactCTA : '.zoe-interact-cta',
		triggerCTA : '.zoe-trigger-cta',

		helpRotate : '.zoe-help-rotate .zoe-help-text',
		helpElevate : '.zoe-help-elevate .zoe-help-text',
		helpZoom : '.zoe-help-zoom .zoe-help-text',
		helpBrand : '.zoe-help-brand .zoe-help-text',

		extraContent : '.zoe-display-extra-content'
	};

	this.settings= {
		//The test page URL
		pageURL : {
			'popover' : 'http://localhost:8888/'+ process.env.TRAVIS_BRANCH + '/testPopover.html',
			'inline' : 'http://localhost:8888/' + process.env.TRAVIS_BRANCH + '/testInline.html'
		},
		loadSpinTimeout: 7000,
		androidLoadTimeout : 60000,
		loadTimeout : 20000,
		pageLoadTimeout : 60000,
		opacityTimeout : 5000,
		closeTimeout : 1000,
		zoomOutTimeout : 1000,
		dragTimeout : 2000,
		zoomTimeout : 1000,
		firefoxDragTimeout: 10000,
		s3BaseURL : "https://s3-eu-west-1.amazonaws.com/zoetrope-alpha/",
	};

	this.testImagePaths= {
		'load' : 'images/load-',
		'help' : 'images/help-',
		'helpClose' : 'images/helpClose-',
		'zoom' : 'images/zoom-',
		'zoomClose' : 'images/zoomClose-',
		'openWidget' : 'images/openWidget-'
	};

	this.testImages = {};


	this.filePaths = {
		screenShot : '/tmp/screen',
	};
	
	this.elementFinder = {
		'inline' : {},
		'popover' : {},
		'indiscriminate' : {}
	};


	var that = this;


	this.widgetTrigger = element(by.css(that.elements.widgetTrigger));
	this.widgetColorbox = element(by.css(that.elements.widgetColorbox));
	this.helpButton = element(by.css(that.elements.helpButton));
	this.helpElement = element(by.css(that.elements.helpElement));
	this.zoomButton = element(by.css(that.elements.zoomButton));
	this.zoomElement = element(by.css(that.elements.zoomElement));
	this.closeButton = element(by.css(that.elements.closeButton));
	this.widgetImageDiv = element(by.css(that.elements.widgetImageDiv));
	this.widgetWrapperSelector = element(by.css(that.elements.widgetWrapperSelector));
	this.widgetWrapperImage = element(by.css(that.elements.widgetWrapperImage));
	this.inlineTrigger = element(by.css(that.elements.inlineTrigger));
	this.inlineWrapper = element(by.css(that.elements.inlineWrapper));
	this.inlineDivSelector = element(by.css(that.elements.inlineDivSelector));
	this.frameSelector = element(by.css(that.elements.frameSelector));
	this.widgetCTA = element(by.css(that.elements.widgetCTA));
	this.inlineCTA = element(by.css(that.elements.inlineCTA));
	this.interactCTA = element(by.css(that.elements.interactCTA));
	this.helpRotate = element(by.css(that.elements.helpRotate));
	this.helpElevate = element(by.css(that.elements.helpElevate));
	this.helpZoom = element(by.css(that.elements.helpZoom));
	this.extraContent = element(by.css(that.elements.extraContent));
	this.zoomImage = element(by.css(that.elements.zoomImage));
	this.helpBrand = element(by.css(that.elements.helpBrand));

	this.popoverWidgetWrapperSelector = element(by.css(that.elements.widgetOverlay + ' ' + that.elements.widgetWrapperSelector));
	this.popoverWidgetCTA = element(by.css(that.elements.widgetOverlay + ' ' + that.elements.widgetCTA));
	this.popoverZoomButton = element(by.css(that.elements.widgetOverlay + ' ' + that.elements.zoomButton));
	this.popoverHelpButton = element(by.css(that.elements.widgetOverlay + ' ' + that.elements.helpButton));

	this.currentCapabilities = {};
	this.browser = '';
	this.browserVersion = 0;
	this.isIE = false;
	this.isFirefox = true;
	this.sessionID = '';
	this.instanceString = '';

	this.isWidgetInline = 'inline';



	var __construct = function() {

		winston.remove(winston.transports.Console);
		winston.add(winston.transports.File, {filename: 'test.log', handleExceptions: true, level: 'debug'});
		winston.add(winston.transports.Console, {handleExceptions: true, level: 'error'});

		winston.log('info', 'Initialising jasmine tests');

		browser.getCapabilities().then(function(currentCapabilities) {
			if (currentCapabilities.caps_.browserName == 'internet explorer') {
				that.isIE = true;
			}
			else that.isIE = false;

			if (currentCapabilities.caps_.browserName == 'firefox') {
				that.isFirefox = true;
			}
			else that.isFirefox = false;
			


			that.currentCapabilities = currentCapabilities;
			that.browser = currentCapabilities.caps_.browserName;
			that.browserVersion = currentCapabilities.caps_.version;
			
			//iPhone sometimes doesn't report version 
			if (!that.browser) {
				console.log("browser undefined");
				that.browser = currentCapabilities.caps_.desired.platformName;
			}
			if (!that.browserVersion) {
				console.log("browser version undefined");
				if (currentCapabilities.caps_.hasOwnProperty('desired')) {
					that.browserVersion = currentCapabilities.caps_.desired.platformVersion;
					that.browser = currentCapabilities.caps_.desired.platformName;
				}
				else if (currentCapabilities.caps_.hasOwnProperty('platformVersion')) {
					that.browserVersion = currentCapabilities.caps_.platformVersion;
				}

				
			}
			
			winston.log('info', currentCapabilities.caps_);
			winston.log('info', that.deviceOrientation);
			winston.log('info', currentCapabilities);
			console.log(currentCapabilities);
			console.log(currentCapabilities.caps_);

			that.sessionID = currentCapabilities.caps_["webdriver.remote.sessionid"];
			//Append browser and version to every filepath
			for (var key in that.filePaths) {
				winston.log("info", "Initialising file paths with browser & version");
				if (that.filePaths[key].charAt(0) == '/') {
					that.filePaths[key] = that.filePaths[key] + that.browser + that.browserVersion + '.png';
				}
			}

			that.instanceString = that.browser + that.browserVersion + that.sessionID;

		});

		for (var key in that.elements) {
			that.elementFinder[key] = element(by.css(that.elements[key]));
		}

	}();

	this.getDeviceOrientation = function() {
		
		var defer = new protractor.promise.Deferred();

		browser.sleep(2000);

		console.log("Slept");

		browser.executeScript('return { ' +
		'width: (window.innerWidth || document.documentElement.clientWidth || document.body.offsetWidth), ' +
		'height: (window.innerHeight || document.documentElement.clientHeight || document.body.offsetHeight)' +
		'};')

		.then(function(size, type) {

			console.log("Execute thened");
			if (size.width > size.height) {
				that.deviceOrientation = 'landscape';
				console.log("orientation landscape");
			}
			else {
				that.deviceOrientation = 'portrait';
				console.log("orientation portrait");
			}

			that.setPageMode(that.isWidgetInline);
			defer.fulfill();
		});

		return defer.promise;

	};

	this.navigate = function(type) {
		winston.log('info', 'Opening URL: ' + that.settings.pageURL[type]);
		
		that.isWidgetInline = type;

		var outerDefer = new protractor.promise.Deferred();



		browser.get(that.settings.pageURL[type]);
		
		if (type == 'popover') {
			browser.wait(function() {
				var deferred = new protractor.promise.Deferred();
				element(by.css(that.elements.triggerCTA)).isPresent()
				.then(function (isPresent) {
					outerDefer.fulfill();
					deferred.fulfill(isPresent);
				});
				return deferred.promise;
			}, that.settings.pageLoadTimeout);
		}
		else {
			browser.wait(function() {
				var deferred = new protractor.promise.Deferred();
				element(by.css(that.elements.progressWrapper)).isPresent()
				.then(function (isPresent) {
					deferred.fulfill(isPresent);
					console.log("Present fulfilled");
				});
				return deferred.promise;
			}, that.settings.pageLoadTimeout);
			
			browser.wait(function() {
				var deferred = new protractor.promise.Deferred();
				element(by.css(that.elements.progressWrapper)).isDisplayed()
					.then(function (isDisplayed) {
						deferred.fulfill(!isDisplayed);
						outerDefer.fulfill()
						console.log("fulfilled inner defer");
					});
				return deferred.promise;
			}, that.settings.pageLoadTimeout);
			

		}
		

		return outerDefer;
		


	};

	this.scrollView = function() {
		var defer = new protractor.promise.Deferred();
		if ((that.isWidgetInline == 'inline')) {
			browser.executeScript("arguments[0].scrollIntoView();", that.elementFinder.widgetWrapperSelector);
				defer.fulfill();
				console.log("Fulfilled with inline");
		}
		else {
			browser.executeScript("arguments[0].scrollIntoView();", that.elementFinder.widgetTrigger);
				defer.fulfill();
				console.log("Fulfilled with popover");
		}
		return defer;
	};

	this.openWidget = function() {
		winston.log('info', 'Clicking on widget trigger');
		this.elementFinder.widgetTrigger.click();
		
		return browser.wait(function() {
			elem = element(by.css(that.elements.progressWrapper));
			return function() {
				//Nasty but has to be done since we're using not displayed
				return !elem.isDisplayed();
			};
		}, that.settings.pageLoadTimeout);

	};

	this.clickHelp = function() {
		winston.log('info', 'Clicking the help button');
		that.elementFinder.helpButton.click();
		winston.log('info', 'help button is', that.elementFinder.helpButton);
		return browser.wait(function() {
			return that.elementFinder.helpElement.getAttribute('style').then(function(style) {

			winston.log('info', 'Got help style of ' + style);
			
			if ((style.indexOf('opacity')==-1)) 
				opacity = true;
			else
				opacity = false;

			return opacity;
			});
		}, that.settings.opacityTimeout );
	};

	this.clickZoom = function() {
		winston.log('info', 'Clicking the zoom button');
		that.elementFinder.zoomButton.click();
	};

	this.clickClose = function() {
		winston.log('info', 'Clicking the close button');
		if (this.isInline) {
			winston.log('warning', 'Inline widget doesn\'t have a close button');
		}
		else {
			this.elementFinder.closeButton.click();
		}
	};

	this.setWindowSize = function(width, height) {
		winston.log('info', 'Setting window size to ' + width + 'x' + height);
		browser.driver.manage().window().setSize(width, height);
	};

	this.maximiseWindow = function() {
		winston.log('info', 'Maximising window');
		browser.driver.manage().window().maximize();
	};

	this.setPageMode = function(widgetType) {
		//Append browser and version to every filepath
		for (var key in that.testImagePaths) {
			winston.log("info", "Initialising file paths with browser & version");
			that.testImages[key] = that.testImagePaths[key] + that.isWidgetInline + '-' + that.browser + '-' + that.browserVersion+  '-' + that.deviceOrientation + '.png';
		}

	};

	function copyFile(source, target, cb) {
		var cbCalled = false;

		var rd = fs.createReadStream(source);
		rd.on("error", function(err) {
			done(err);
		});
		var wr = fs.createWriteStream(target);
		wr.on("error", function(err) {
			done(err);
		});
		wr.on("close", function(ex) {
			done();
		});
		rd.pipe(wr);

		function done(err) {
			if (!cbCalled) {
				cb(err);
				cbCalled = true;
			}
		}
	}

	this.saveScreenshot = function(path) {
		winston.log('info', 'Saving screenshot to ' + path);
		var defer = new protractor.promise.Deferred();

		browser.takeScreenshot().then(function(data) {
			var stream = fs.createWriteStream(path);
			stream.write(new Buffer(data, 'base64'), function() {
				stream.end();
				winston.log('info', 'Saved screenshot');
				defer.fulfill();
			});

		});
		return defer.promise;
	};

	this.savePageScreenshot = function(testStage) {
		var defer = new protractor.promise.Deferred();
		console.log(process.cwd());

		that.saveScreenshot(that.testImages[testStage]).then(function() {
			defer.fulfill();
		});
		return defer.promise;
	};


	this.comparePageImages= function(testStage) {
		winston.log('info', 'Comparing images for stage' + testStage);

		var defer = new protractor.promise.Deferred();

		var tmpPath = that.filePaths.screenShot + '.' + testStage + '.' + this.isWidgetInline;

		this.saveScreenshot(tmpPath).then(function() {
			compareImages(tmpPath, that.testImages[testStage]).then(function(equality) {
				console.log(equality);
				winston.log('info', that.instanceString + ' compared images for stage: ' + testStage + 'with eqaulity of: ' + equality);
				defer.fulfill(equality);
			});
		});

		return defer.promise;
				
	};




	function compareImages(inputFile1, inputFile2) {
		winston.log('info', 'Comparing images from paths: ' + inputFile1 + ' and ' + inputFile2);
		var defer = new protractor.promise.Deferred();

		gm.compare(inputFile1,inputFile2, function(err, isEqual, equality, raw) {
			if (err) {
				winston.log('error', 'Error comparing images' + err);
			}
			winston.log('info', 'Image comparison gave: ' + equality);
			defer.fulfill(equality);
		});

		return defer.promise;
	}


	function waitForPromiseTest(promiseFn, testFn) {
		browser.wait(function () {
			var deferred = protractor.promise.defer();
			promiseFn().then(function (data) {
				deferred.fulfill(testFn(data));
			});
			return deferred.promise;
		});
	}

	/*	waitForPromiseTest(element(by.id('some-element')).isPresent,
		function (isPresent) {
		return !isPresent;
		});
		*/

	var scrollIntoView = function() {
		arguments[0].scrollIntoView();
	};


	
};

module.exports = new testPage();
