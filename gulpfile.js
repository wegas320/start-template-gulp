const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const rename = require('gulp-rename');

function styles() {
    return gulp
        .src('./src/sass/**/*.sass')
        .pipe(sass())
        .pipe(concat('style.css'))
        .pipe(
            autoprefixer({
                browsers: ['last 2 version'],
                cascade: false
            })
        )
        .pipe(
            cleanCSS({
                level: 2
            })
        )
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}

function html() {
    return gulp
        .src('./src/*.html')
        .pipe(gulp.dest('./build/'))
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp
        .src('./src/js/**/*.js')
        .pipe(concat('script.js'))
        .pipe(
            babel({
                presets: ['@babel/env']
            })
        )
        .pipe(
            uglify({
                toplevel: true
            })
        )
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}

function browserReload(done) {
    browserSync.reload();
    done();
}
function watchFiles() {
    gulp.watch('./src/sass/**/*.sass', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch('./src/**/*.html', html);
}
function sync() {
    browserSync.init({
        server: {
            baseDir: 'build'
        },
        port: 3000
    });
}

gulp.task(
    'default',
    gulp.series(scripts, html, styles, gulp.parallel(sync, watchFiles))
);