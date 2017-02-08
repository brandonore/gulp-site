/*---------------------------------------
* Start/initialize variables
* ---------------------------------------*/
'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var maps = require('gulp-sourcemaps');
var del = require('del');
var imagemin = require('gulp-imagemin');
var connect = require('gulp-connect');

var paths = {
    sass: 'sass/**/*.scss',
    js: 'js/**/*.js',
    imgs: 'images/*'   
}

/*---------------------------------------
* Concat and minify files/images
* ---------------------------------------*/

// Concat all .js files in 'js/' directory and save to 'all.js'
gulp.task('concatScripts', function() {
    return gulp.src(paths.js)
    .pipe(maps.init())
    .pipe(concat('all.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('js'));
});

// Minify 'all.js' and copy to the directory dist/scripts for deployment
gulp.task('scripts', ['concatScripts'], function() {
    return gulp.src('js/all.js')
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(connect.reload());
});

// Compile all .sass/.scss files to css and save to global.css
gulp.task('compileSass', function() {
    return gulp.src(paths.sass)
    .pipe(maps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('css'));
});

// Rename 'global.css' and copy to the directory dist/styles for deployment
gulp.task('styles', ['compileSass'], function() {
    return gulp.src('css/global.css')
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(connect.reload());
});


// Minify/optimize any images and copy to the directory dist/content for deployment
gulp.task('images', function() {
    return gulp.src(paths.imgs)
    .pipe(imagemin())
    .pipe(gulp.dest('dist/content'));
});

/*---------------------------------------
* Clean and build
* ---------------------------------------*/

// Clean task -- remove any folders and files in the dist/ directory
gulp.task('clean', function() {
    del(['dist/*']);
});

// Build task -- clean first
gulp.task('build', ['clean', 'scripts', 'styles', 'images']);

// Default task -- start build
gulp.task('default', function() {
    gulp.start('build');
});

/*---------------------------------------
* Serve and watch
* ---------------------------------------*/

// Watch js and sass/scss files for changes
gulp.task('watch', ['build'], function(){
    gulp.watch([paths.js, '!js/**/*.map'], ['scripts']);
    gulp.watch([paths.sass, '!css/**/*.map'], ['styles']);
});

// Setup live server
gulp.task('connect', function() {
    connect.server({
        port: 3000,
        livereload: true
    });
});

// Build, serve and watch files for changes
gulp.task('serve', ['watch', 'connect']);

