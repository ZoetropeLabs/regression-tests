var protractor = require('protractor');
var testPage = require('./testPage.js');

var equalityThreshold = 0.00025;
var zoomThreshold = 0.0004;
var imageComparisonThreshold = 0.001;

describe('Desktop Browser Testing', function() {
    protractor.getInstance();


    /*afterEach(function() {
        if (!testPage.isIE) {
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
				//TODO: Add this back in
                expect(realErrors.length).toEqual(0);
            });
        }
    });*/

	
    it("Should match saved loaded page image", function() {
			testPage.navigate('inline').then(function() {
				//Wait a tiny bit for the loading image to fade
				browser.sleep(1000);
				expect(testPage.comparePageImages('load')).toBeLessThan(imageComparisonThreshold);
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


//POPOVER TESTING


	it("Should match saved loaded page image", function() {
			testPage.navigate('popover').then(function() {
				//Wait a tiny bit for the loading image to fade
				browser.sleep(200);
				expect(testPage.comparePageImages('load')).toBeLessThan(imageComparisonThreshold);
			});
    });
	
	it ('Should match the open widget image', function() {
		testPage.openWidget().then(function() {
			browser.sleep(1000);
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

});
