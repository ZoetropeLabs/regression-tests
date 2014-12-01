var protractor = require('protractor');
var testPage = require('./testPage.js');

var equalityThreshold = 0.00025;
var zoomThreshold = 0.0004;
var imageComparisonThreshold = 0.001;

describe('Desktop Browser Testing', function() {
    protractor.getInstance();

	browser.sleep(1000);


    afterEach(function() {
		//Doesn't work on ios or IE
		if (!testPage.isIE && !testPage.isIOS) {
            var realErrors = [];
            browser.manage().logs().get('browser').then(function(browserLog) {
                if (browserLog.length !== 0) {
                    for (var i = 0; i< browserLog.length; i++) {
                        if (browserLog[i].level.value >= 1000) {
                            //This is a 'SEVERE' error, so print it and move to
                            //real errors
                            realErrors.push(browserLog[i]);
                        }
                    }
                }
                if (realErrors.length !== 0) console.log('log: ' + require('util').inspect(realErrors));
                expect(realErrors.length).toEqual(0);
            });
		}
    });

	it('Should wait for the original page to load', function() {
		expect(browser.sleep(10000)).toBe();
	});


	it('Should save image from loaded page', function() {
		testPage.navigate('inline').then(function() {
			testPage.getDeviceOrientation().then(function() {
				browser.sleep(20000);
				expect(testPage.comparePageImages('load')).toBeLessThan(imageComparisonThreshold);
			});
		});
    });

	it('should match saved help image', function() {
        testPage.clickHelp().then(function() {
			expect(testPage.comparePageImages('help')).toBeLessThan(imageComparisonThreshold);
		});
	});

	it('Should match save image with help closed', function() {
        testPage.clickHelp();
		expect(testPage.comparePageImages('helpClose')).toBeLessThan(imageComparisonThreshold);
	});

	it('Should match zoom image', function() {
		testPage.clickZoom();
        browser.driver.wait(function() {
            return testPage.zoomElement.isDisplayed();
        }, 1000);
		expect(testPage.comparePageImages('zoom')).toBeLessThan(imageComparisonThreshold);

	});

	it('should zoom out when button pressed again', function() {
		testPage.clickZoom();
        //The zoom element won't actually exist so we can't use isDisplayed
        browser.driver.wait(function() {
            return testPage.zoomImage.isPresent().then(function (res) {
                return !res;
            });
        }, testPage.settings.zoomOutTimeout);
		expect(testPage.comparePageImages('zoomClose')).toBeLessThan(imageComparisonThreshold);
	});

	it('Should teardown the zoetrope when unZoetrope is called', function() {
		testPage.unzoetrope();
		browser.wait(function() {
			var deferred = new protractor.promise.Deferred();
			element(by.css(testPage.elements.widgetWrapperSelector)).isPresent()
			.then(function(isPresent) {
				deferred.fulfill(!isPresent);
			});
			return deferred.promise;
		}, testPage.settings.unzoetropeTimeout);
		expect(testPage.comparePageImages('unzoetrope')).toBeLessThan(imageComparisonThreshold);
	});

	it('Should save image from loaded inline page with trigger size', function() {
		testPage.navigate('inline').then(function() {
			testPage.getDeviceOrientation().then(function() {
				testPage.resizeZoeContainer(300);
				browser.sleep(10000);
				expect(testPage.comparePageImages('load-trigger-size')).toBeLessThan(imageComparisonThreshold);
			});
		});
	});



//POPOVER TESTING


	it("Should match saved loaded page image", function() {
		testPage.navigate('popover').then(function() {
			testPage.getDeviceOrientation().then(function() {
				//Wait a tiny bit for the loading image to fade
				browser.sleep(10000);
				expect(testPage.comparePageImages('load')).toBeLessThan(imageComparisonThreshold);
			});
		});
    });
	
	it ('Should match the open widget image', function() {
		testPage.openWidget().then(function() {
			browser.sleep(10000);
			expect(testPage.comparePageImages('openWidget')).toBeLessThan(imageComparisonThreshold);
		});
		
	});

	it('should match saved help image', function() {
        testPage.clickHelp().then(function() {
			//Wait a little to ensure opacity is done (Is taken care of in
			//script but a little extra helps.
			browser.sleep(200);
			expect(testPage.comparePageImages('help')).toBeLessThan(imageComparisonThreshold);
		});
	});

	it('Should match save image with help closed', function() {
        testPage.clickHelp();
		expect(testPage.comparePageImages('helpClose')).toBeLessThan(imageComparisonThreshold);
	});

	it('Should match zoom image', function() {
		testPage.clickZoom();
        browser.driver.wait(function() {
            return testPage.zoomElement.isDisplayed();
        }, 1000);
		expect(testPage.comparePageImages('zoom')).toBeLessThan(imageComparisonThreshold);

	});

	it('should zoom out when button pressed again', function() {
		testPage.clickZoom();
        //The zoom element won't actually exist so we can't use isDisplayed
        browser.driver.wait(function() {
            return testPage.zoomImage.isPresent().then(function (res) {
                return !res;
            });
        }, testPage.settings.zoomOutTimeout);
		expect(testPage.comparePageImages('zoomClose')).toBeLessThan(imageComparisonThreshold);
	});

	/* Leave this until the lightbox is fixed
	 * it('Should teardown the zoetrope when unZoetrope is called', function() {
		testPage.unzoetrope();
		browser.wait(function() {
			var deferred = new protractor.promise.Deferred();
			element(by.css(testPage.elements.widgetWrapperSelector)).isPresent()
			.then(function(isPresent) {
				deferred.fulfill(!isPresent);
			});
			return deferred.promise;
		}, testPage.settings.unzoetropeTimeout);
		expect(testPage.comparePageImages('unzoetrope')).toBeLessThan(imageComparisonThreshold);
	});*/
});
