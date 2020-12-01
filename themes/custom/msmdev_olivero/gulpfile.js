let gulp = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  cleanCss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  browserSync = require('browser-sync').create()

const paths = {
  scss: {
    src: [
      './src/sass/msmdev/msmdev-style.scss',
    ],
    dest: "./css",
    watch: "./src/sass/**/*.scss",

  },
  css: {
    src: "./src/css/**/*.css",
    dest: "./css",
    watch: "./src/css/**/*.css",
  },
  js: {
    materialize: "./src/js/materialize_js/bin/materialize.js",
    dest: "./js",
    watch: "./src/js/**/*.js",
  }
};

// Compile sass into CSS & auto-inject into browsers
function styles() {
  return gulp.src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    // .pipe(postcss([autoprefixer({
    //   browsers: [
    //     'Chrome >= 35',
    //     'Firefox >= 38',
    //     'Edge >= 12',
    //     'Explorer >= 10',
    //     'iOS >= 8',
    //     'Safari >= 8',
    //     'Android 2.3',
    //     'Android >= 4',
    //     'Opera >= 12']
    // })]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(cleanCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSync.stream())
}

// Move the css files into our css folder
function css() {
  return gulp.src([
    paths.css.src,
  ])
    .pipe(gulp.dest(paths.css.dest))
    .pipe(browserSync.stream())
}

// Move the javascript files into our js folder
function js() {
  return gulp.src([
    paths.js.materialize,
    paths.js.aazdev_materialize,
    paths.js.aazdev_override,
    paths.js.fulldev_materialize,
  ])
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream())
}

// Static Server + watching scss/html files
function serve() {
  browserSync.init({
    proxy: 'http://agc.loc:8080',
  })

  gulp.watch([paths.scss.watch,], styles).on('change', browserSync.reload),
    gulp.watch([paths.js.watch,], js).on('change', browserSync.reload)
}

const build = gulp.series(styles, gulp.parallel(css, js, serve))

exports.styles = styles
exports.js = js
exports.serve = serve

exports.default = build