var sauceConnect = require('sauce-connect-launcher');
var gulp = require('gulp');
var protractor = require("gulp-protractor").protractor;
var request = require('request');
var sh = require('execSync');


// Branch info - Jenkins does some funky detached HEAD stuff, but is kind enough to give
// us an environment variable, however, this is not set in a normal environment
var jenkins_branch = (process.env.GIT_BRANCH || '').replace('origin/', '');
var travis_branch = (process.env.TRAVIS_BRANCH || '');
var res = sh.exec('git rev-parse --abbrev-ref HEAD').stdout.trim();
var gitBranch = (travis_branch || jenkins_branch || res);
console.log("current branch: ", gitBranch);

var sauceSession


process.on('exit', function () {
  process.nextTick(function () {
    exit_gulp();
  });
})

function exit_gulp() {
    if (sauceSession) {
        sauceSession.close(function() {
            console.log("Closed Sauce Connect Session");
            process.exit(1);
        });
    }
}



gulp.task('setup', function(cb) {
    //Test the server is running
    var url = 'http://localhost:8888/' + gitBranch + '/testInline.html';
    //
    request(url, function (err, resp) {
       if (!resp ||resp.statusCode != 200) {
           console.error('Server doesn\'t appear to be running on localhost:8888. Make sure you start a server with the latest code and check the branch shown above is correct.');
           exit_gulp();
       }
       else {
           cb();
        }
    });
});

//Requires env variables for SAUCE_USER and SAUCE_ACCESS_KEY
gulp.task('sauce-connect', ['setup'], function(cb) {
    sauceConnect({}, function(err, sauceSession) {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log("Sauce connect ready");
        cb();
    });
});

//Expects server to be running on localhost:8888
gulp.task('run-build-test', ['sauce-connect'], function(cb) {
    process.env['TRAVIS_BRANCH'] = gitBranch;
    process.chdir('tests');

    gulp.src(["./buildImages.js"])
        .pipe(protractor({
            configFile: "buildTestImages.conf.js"
            }))
        .on('error', function(e) { 
        console.error('Failed to run protractor');
        process.emit('exit');
        })
        .on('end', function() {
            process.emit('exit');
        });
});

gulp.task('default', ['run-build-test']);
