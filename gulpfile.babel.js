'use strict';

const gulp 			= require('gulp'),
	sass 			= require('gulp-sass'),
	sourcemaps 		= require('gulp-sourcemaps'),
	postcss      	= require('gulp-postcss'),
	autoprefixer 	= require('autoprefixer');


gulp.task('sass', () => {
	gulp.src('./src/sass/main.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({
		errLogToConsole: true,
		outputStyle: 'compressed',
		// precision: 10
	}).on('error', sass.logError))
	.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('./assets/css/'));

	gulp.src('./src/sass/themes/**/*.scss')
	.pipe(sass({
		errLogToConsole: true,
		outputStyle: 'compressed'
	}).on('error', sass.logError))
	.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
	.pipe(gulp.dest('./assets/css/themes'));
});

gulp.task('sass-compress', () => {
	gulp.src('./src/sass/main.scss')
	.pipe(sass({
		errLogToConsole: true,
		outputStyle: 'compressed',
	}).on('error', sass.logError))
	.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
	.pipe(gulp.dest('./assets/css/'));
});



gulp.task('watch', () => {
  gulp.watch(['./src/sass/**/*.scss'], ['sass']);
});


gulp.task('default', ['sass', 'watch']);
gulp.task('production', ['sass-compress']);
