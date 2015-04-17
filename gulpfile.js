var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var server = require('gulp-server-livereload');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglifyjs');

var tsProject = ts.createProject({
    out: 'mjollnir.js'
});

gulp.task('min', function() {
    gulp.src('js/vendor/*.js')
        .pipe(uglify('vendor.min.js'))
        .pipe(gulp.dest('js'))
});

gulp.task('srv', function () {
    gulp.src('.')
        .pipe(server({
            livereload: false,
            directoryListing: false,
            open: false
        }));
});

gulp.task('ts', function () {

    var tsResult = gulp.src(['ts/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return merge([
        tsResult.dts.pipe(gulp.dest('js')),
        tsResult.js
            .pipe(gulp.dest('js'))
    ]);
});