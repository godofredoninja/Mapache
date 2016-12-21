const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

const postCss = require('gulp-postcss');
const cssnano = require('cssnano');
const assets = require('postcss-assets');

const postCssPlugins = [
  assets({
    loadPaths: ['img'],
    relative: true,
    cachebuster: true,
    basePath: 'assets',
  }),
  cssnano({
    autoprefixer: {
      add: true,
    },
    core: true,
  }),
];

gulp.task('sass', () => {
  gulp.src('./src/sass/main.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(postCss(postCssPlugins))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./assets/css/'));

  gulp.src('./src/sass/themes/**/*.scss')
  .pipe(sass({
    errLogToConsole: true,
    // outputStyle: 'compressed',
  }).on('error', sass.logError))
  .pipe(postCss(postCssPlugins))
  .pipe(gulp.dest('./assets/css/themes'));
});

/* Sass Compress */
gulp.task('sass-compress', () => {
  gulp.src('./src/sass/main.scss')
  .pipe(sass({
    errLogToConsole: true,
    outputStyle: 'compressed',
  }).on('error', sass.logError))
  .pipe(postCss(postCssPlugins))
  .pipe(gulp.dest('./assets/css/'));
});

/* Gulp watch */
gulp.task('watch', () => {
  gulp.watch(['./src/sass/**/*.scss'], ['sass']);
});


gulp.task('default', ['sass', 'watch']);
gulp.task('production', ['sass-compress']);
