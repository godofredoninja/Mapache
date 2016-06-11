'use strict';

const gulp         = require('gulp'); // Gulp of-course

// CSS related plugins.
const sass         = require('gulp-sass'); // Gulp pluign for Sass compilation.
// const uglifycss    = require('gulp-uglifycss'); // Minifies CSS files.
const autoprefixer  = require('gulp-autoprefixer'); // Autoprefixing magic.
const sourcemaps   = require('gulp-sourcemaps'); // Maps code in a compressed file (E.g. style.css) back to it’s original position in


gulp.task('sass', () => {
    gulp.src('./src/sass/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
        errLogToConsole: true,
        outputStyle: 'compressed',
        // precision: 10
    })
    .on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/css/'));

    gulp.src('./src/sass/themes/**/*.scss')
    .pipe(sass({
        errLogToConsole: true,
        outputStyle: 'compressed'
    })
    .on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./assets/css/themes'));
});

gulp.task('watch', () => {
  gulp.watch(['./src/sass/**/*.scss'], ['sass']);
});


gulp.task('default', ['sass', 'watch']);
