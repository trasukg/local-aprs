var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-csso');
var ngAnnotate = require('browserify-ngannotate');
var browserify = require('browserify', { transform: [ngAnnotate]});
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');

gulp.task('html', function(){
  return gulp.src('./client/*.html')
    .pipe(gulp.dest('./built-web/'));
});

gulp.task('less', function(){
  return gulp.src('./client/less/*.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest('./built-web/css'));
});

gulp.task('css', function(){
  return gulp.src('./client/css/*')
    .pipe(minifyCSS())
    .pipe(gulp.dest('./built-web/css'));
});

gulp.task('default', [ 'browserify', 'html', 'less', 'css' ]);


gulp.task('browserify', function() {
    return browserify('./client/app.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('app.js'))
        .pipe(buffer())
        // Start piping stream to tasks!
        .pipe(sourcemaps.init({loadMaps: true}))
        /*.pipe(uglify())*/
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./built-web/'));
});
