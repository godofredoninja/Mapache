// File: Gulpfile.js
'use strict';

var gulp                = require('gulp'),
    connect             = require('gulp-connect'),

    // preocesa y comprime archivos de sass a css
    sass                = require('gulp-sass'),

    // inyectarán las librerías
    inject              = require('gulp-inject'),
    wiredep             = require('wiredep').stream,

    // Busca errores en el JS
    jshint              = require('gulp-jshint'),
    stylish             = require('jshint-stylish'),

    // Concatenación de ficheros JS y CSS
    gulpif              = require('gulp-if'),
    minifyCss           = require('gulp-minify-css'),
    useref              = require('gulp-useref'),
    uglify              = require('gulp-uglify'),

    // Reducir el peso de las imganes
    imagemin            = require('gulp-imagemin'),
    pngcrush            = require('imagemin-pngcrush'),

    // replace
    replace             = require('gulp-replace');

// procesas de sass a css
gulp.task('sass', function () {
  gulp.src('./sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./assets/css'))
    .pipe(connect.reload());
});

// Busca errores en el JS y nos los muestra por pantalla
gulp.task('jshint', function() {
  return gulp.src('./assets/js/**/*.js')
  .pipe(jshint('.jshintrc'))
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail'));
});

// Busca en las carpetas de estilos y javascript los archivos que hayamos creado
// para inyectarlos en el default.hbs
gulp.task('inject', function() {
  var sources = gulp.src(['./assets/js/**/*.js','./assets/css/**/*.css']);
  return gulp.src('default.hbs', {cwd: './'})
  .pipe(inject(sources, {
    read: false,
    // ignorePath: '/app'
  }))
  .pipe(gulp.dest('./'));
});

// Inyecta las librerias que instalemos vía Bower
gulp.task('wiredep', function () {
  gulp.src('./default.hbs')
  .pipe(wiredep({
    optional: 'configuration',
    goes: 'here'
  }))
  .pipe(gulp.dest('./'));
});

// Concatenación de ficheros JS y CSS
gulp.task('compress', function() {
  gulp.src('./default.hbs')
  .pipe(useref.assets())
  .pipe(gulpif('*.js', uglify({mangle: false })))
  .pipe(gulpif('*.css', minifyCss()))
  .pipe(gulp.dest('./dist'));
});

// Vigila cambios que se produzcan en el código
// y lanza las tareas relacionadas
gulp.task('watch', function() {
  gulp.watch(['./sass/**/*.scss'], ['sass', 'inject']);
  gulp.watch(['./assets/js/**/*.js'], ['jshint', 'inject']);
  gulp.watch(['./bower.json'], ['wiredep']);
});

// remover el CSS no utilizado
gulp.task('css-compress', function() {
  gulp.src('./dist/assets/css/style.min.css')
  .pipe(gulpif('*.css', minifyCss({
    keepSpecialComments:0,
    keepBreaks:false
  })))
  .pipe(gulp.dest('./dist/assets/css'));
});

// Copia el contenido de los estáticos e index.html al directorio
// de producción sin tags de comentarios
gulp.task('copy', function() {
  gulp.src('./*.hbs')
  .pipe(useref())
  .pipe(gulp.dest('./dist'));

  gulp.src('./partials/**/*.hbs')
  .pipe(useref())
  .pipe(gulp.dest('./dist/partials'));

  gulp.src('./assets/lib/fontawesome/fonts/**')
  .pipe(gulp.dest('./dist/assets/fonts'));

  gulp.src(['./README.md', './package.json'])
  .pipe(gulp.dest('./dist'));
});

// Reduce el peso de las imagenes para produccion
gulp.task('images', function() {
  gulp.src('./assets/img/**/*.{png,jpg,jpeg,gif,svg}')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngcrush()]
    }))
    .pipe(gulp.dest('./dist/assets/img'));
});

// Remplazar la url correcto de las fuentes en el css
// Utilizar en producción caso contrario que las url de las fuentes estén mal

// gulp.task('font-url', function(){
//   gulp.src(['./dist/assets/css/style.min.css'])
//   .pipe(replace('url(css/', 'url(../'))
//   .pipe(gulp.dest('./dist/css'));
// });

// Renombrar los assets
gulp.task('rename-assets', function(){
  gulp.src(['./dist/default.hbs'])
  .pipe(replace('./assets/css/style.min.css', '{{asset "css/style.min.css"}}'))
  .pipe(replace('./assets/js/vendor.min.js', '{{asset "vendor.min.js"}}'))
  .pipe(replace('./assets/js/app.min.js', '{{asset "app.min.js"}}'))
  .pipe(gulp.dest('./dist/'));
});

// por defecto en desarrollo
gulp.task('default', ['inject', 'wiredep', 'watch']);

// para produccion
gulp.task('production', ['compress', 'images', 'copy']);

// css compress
gulp.task('csscompress', ['css-compress', 'rename-assets']);
