'use strict';
const { task, src, dest, watch, series, parallel } = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var minifyCSS = require("gulp-minify-css");
var pipeline = require('readable-stream').pipeline;
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();


task('compress', function () {
  return pipeline(
    src('src/js/*.js'),
    uglify(),
    dest('build/js')
  );
});

// gulp.task('compressCSS', function () {
//   gulp.src('./css/*.css') // path to your file
//   .pipe(minifyCss())
//   .pipe(gulp.dest('./minify-css'));
// });


function html() {
  return src('src/*.html')
    .pipe(dest('build'))
    .pipe(browserSync.reload({stream: true}))
}

function fonts() {
  return src('src/fonts/*.*')
    .pipe(dest('build/fonts'))
    .pipe(browserSync.reload({stream: true}))
}

function css() {
  return src('src/scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(minifyCSS())
    .pipe(dest('build/css'))
    .pipe(browserSync.reload({stream: true}))
}

function js() {
  return src('src/js/*.js', { sourcemaps: false })
    .pipe(uglify())
    .pipe(dest('build/js', { sourcemaps: false }))
    .pipe(browserSync.reload({stream: true}))
}

function img() {
  return src('src/images/**/*.*')
    .pipe(dest('build/images'))
    .pipe(browserSync.reload({stream: true}))
}

function watchFilesSCSS() {
    watch(
      ['./src/scss/*.scss', './src/scss/**/*.scss'],
      { events: 'all', ignoreInitial: false },
      series(css)
    );
}

function watchFilesHTML() {
  watch(
    ['./src/*.html', './src/**/*.html'],
    { events: 'all', ignoreInitial: false },
    series(html)
  );
}

function watchFilesJS() {
  watch(
    ['./src/js/*.js', './src/js/**/*.js'],
    { events: 'all', ignoreInitial: false },
    series(js)
  );
}

function watchFilesImages() {
  watch(
    ['./src/images/**/*.*'],
    { events: 'all', ignoreInitial: false },
    series(img)
  );
}

function watchFilesFonts() {
  watch(
    ['./src/fonts/*.*'],
    { events: 'all', ignoreInitial: false },
    series(fonts)
  );
}


function serve(done) {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });
  done();
}

exports.js = js;
exports.css = css;
exports.html = html;
exports.img = img;
exports.fonts = fonts;
exports.default = parallel(html, css, js, img, fonts);
exports.serve = parallel(serve, img, fonts, css, js, html, watchFilesImages, watchFilesFonts, watchFilesSCSS, watchFilesJS, watchFilesHTML);