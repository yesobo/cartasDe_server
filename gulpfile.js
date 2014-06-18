var jshint = require('gulp-jshint');
var gulp = require('gulp');

var paths = {
    scripts: ['./client/*.js', './*.js']
};

gulp.task('lint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('default', ['lint']);
