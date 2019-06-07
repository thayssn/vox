const { src, dest, watch, series, parallel } = require('gulp');
const bs = require('browser-sync').create(),
  sass = require('gulp-sass'),
  babel = require('gulp-babel'),
  concat = require('gulp-concat'),
  njks = require('gulp-nunjucks-render'),
  plumber = require('gulp-plumber');

const PUBLIC_DIR = './public';
const STATIC_DIR = './public/static';
const HTML_DIR = './public';
const SRC_DIR = './src';
const SRC_HTML = './templates';

// Local Server
const serve = () => {
  bs.init({
    server: {
      baseDir: PUBLIC_DIR
    }
  });
  watch(`${SRC_DIR}/scss/**/**`, css);
  watch(`${SRC_DIR}/js/**/**`, js);
  watch(`${SRC_DIR}/img/**/**`, img);
  watch(`${SRC_HTML}/**/**`, html);
};

const html = () =>
  src(`${SRC_HTML}/**.html`)
    .pipe(plumber())
    .pipe(njks({ path: [SRC_HTML] }))
    .pipe(dest(PUBLIC_DIR))
    .pipe(bs.stream());

const css = () =>
  src([
    `scss/style.scss`
  ],{ cwd: SRC_DIR })
    .pipe(plumber())
    .pipe(sass())
    .pipe(dest(`${STATIC_DIR}/css`))
    .pipe(bs.stream());

const js = () =>
  src([
    `${SRC_DIR}/js/**/**`,
  ])
    .pipe(plumber())
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(concat('scripts.js'))
    .pipe(dest(`${STATIC_DIR}/js`))
    .pipe(bs.stream());

const img = () =>
  src(`${SRC_DIR}/img/**/**`)
    .pipe(plumber())
    .pipe(dest(`${STATIC_DIR}/img`));

const build = series(parallel(html, css, js, img), serve);
const production = parallel(html, css, js, img);

module.exports = {
  serve,
  html,
  css,
  js,
  production,
  default: build
};
