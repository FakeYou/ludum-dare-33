'use strict';

var gulp       = require('gulp');
var browserify = require('gulp-browserify');
var connect    = require('gulp-connect');
var plumber    = require('gulp-plumber');

gulp.task('phaser', function() {
	return gulp.src('node_modules/phaser/dist/phaser.min.js')
		.pipe(gulp.dest('build/lib'));
});

gulp.task('html', function() {
	return gulp.src('src/index.html')
		.pipe(gulp.dest('build/'));
});

gulp.task('assets', function() {
	return gulp.src('src/assets/**/*')
		.pipe(gulp.dest('build/assets'))
		.pipe(connect.reload());
});

gulp.task('lib', function() {
	return gulp.src('src/lib/**/*')
		.pipe(gulp.dest('build/lib'))
		.pipe(connect.reload());
});

gulp.task('webserver', function() {
  return connect.server({
  	root: 'build/',
    livereload: true
  });
});

gulp.task('build', function() {
	return gulp.src('src/index.js')
		.pipe(plumber())
		.pipe(browserify({ insertGlobals : true }))
		.pipe(gulp.dest('build/'))
		.pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['build']);
  gulp.watch('src/lib/**/*', ['lib']);
  gulp.watch('src/assets/**/*', ['assets']);
});

gulp.task('default', ['phaser', 'html', 'assets', 'lib', 'webserver', 'watch']);
