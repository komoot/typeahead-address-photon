var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    jasmine = require('gulp-jasmine'),
    webserver = require('gulp-webserver'),
    uglify = require('gulp-uglify'),
    stripCode = require('gulp-strip-code'),
    rename = require('gulp-rename');

gulp.task('default', [ 'lint', 'test', 'dist' ]);

gulp.task('lint', function () {
  gulp
    .src('src/*.js')
    .pipe(jshint({ expr: true }))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test', function () {
  gulp
    .src('spec/*.spec.js')
    .pipe(jasmine());
});

gulp.task('dist', function () {

  /* Copy non-minified version */
  gulp
    .src('src/typeahead-address-photon.js')
    .pipe(stripCode({
      start_comment: 'test-code',
      end_comment: 'end-test-code'
    }))
    .pipe(gulp.dest('dist'));

  /* Make minified version */
  gulp
    .src('src/typeahead-address-photon.js')
    .pipe(stripCode({
      start_comment: 'test-code',
      end_comment: 'end-test-code'
    }))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('debug', function () {
  gulp
    .src('.')
    .pipe(webserver({
      fallback: '/debug/index.html',
      livereload: true,
      directoryListening: true,
      open: true
    }));
});
