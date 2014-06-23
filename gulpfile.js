var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var gulp = require('gulp');

var paths = {
    scripts: ['./client/*.js', './*.js'],
    tests: ['./test/*.js']
};

gulp.task('lint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('mocha', function() {
  return gulp.src(paths.tests)
    .pipe(mocha());
});

gulp.task('default', ['lint', 'mocha']);
