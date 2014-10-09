var protractor = require('protractor');
var testPage = require('./testPage.js');


describe ('Build Screenshot Images', function() {
	protractor.getInstance();
	browser.sleep(1000);

	it('Should save image from loaded page', function() {
		testPage.navigate('inline').then(function() {
			browser.sleep(200);
			expect(testPage.savePageScreenshot('load')).toBe();
		});
	});

	it ('Should save image from help', function() {
		testPage.clickHelp().then(function() {
			expect(testPage.savePageScreenshot('help')).toBe();
		});
	});

	it ('Should save image after closing help', function() {
		testPage.clickHelp().then(function() {
			expect(testPage.savePageScreenshot('helpClose')).toBe();
		});
	});

	it('Should save image after pressing zoom', function() {
		testPage.clickZoom();
        browser.driver.wait(function() {
            return testPage.zoomElement.isDisplayed();
        }, 1000);
		expect(testPage.savePageScreenshot('zoom')).toBe();

	});

	it('Should save image after closing zoom', function() {
		testPage.clickZoom();
		browser.driver.wait(function() {
            return testPage.zoomImage.isPresent().then(function (res) {
                return !res;
            });
        }, testPage.settings.zoomOutTimeout);
		expect(testPage.savePageScreenshot('zoomClose')).toBe();

	});
	
	it('Should save image from loaded page', function() {
		testPage.navigate('popover').then(function() {
			browser.sleep(200);
			expect(testPage.savePageScreenshot('load')).toBe();
		});
	});

	it ('Should open widget and save screenshot', function() {
		testPage.openWidget().then(function() {
			browser.sleep(200);
			expect(testPage.savePageScreenshot('openWidget')).toBe();
		});
		
	});

	it ('Should save image from help', function() {
		testPage.clickHelp().then(function() {
			expect(testPage.savePageScreenshot('help')).toBe();
		});
	});

	it ('Should save image after closing help', function() {
		testPage.clickHelp().then(function() {
			expect(testPage.savePageScreenshot('helpClose')).toBe();
		});
	});

	it('Should save image after pressing zoom', function() {
		testPage.clickZoom();
        browser.driver.wait(function() {
            return testPage.zoomElement.isDisplayed();
        }, 1000);
		expect(testPage.savePageScreenshot('zoom')).toBe();

	});

	it('Should save image after closing zoom', function() {
		testPage.clickZoom();
		browser.driver.wait(function() {
            return testPage.zoomImage.isPresent().then(function (res) {
                return !res;
            });
        }, testPage.settings.zoomOutTimeout);
		expect(testPage.savePageScreenshot('zoomClose')).toBe();

	});


});
