var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var gulp = require('gulp');

var paths = {
    scripts: ['./client/*.js', './*.js'],
    tests: ['./test/*.js']
};

gulp.task('lint', function() {
  return gulp.src(paths.scripts.concat(paths.tests))
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', function() {
  return gulp.src(paths.tests)
  .pipe(mocha({reporter: 'nyan'}))
  	.once('end', function () {
      process.exit();
    });

});

gulp.task('default', ['lint', 'test']);
