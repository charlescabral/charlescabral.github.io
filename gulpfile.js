var gulp        = require('gulp');
var cp          = require('child_process');
var del         = require('del');
var concat      = require('gulp-concat');
var shell       = require('gulp-shell');
var express     = require('express');
var util        = require('gulp-util');
var browserSync = require('browser-sync');
var plumber     = require('gulp-plumber');
var notify      = require('gulp-notify');
var sass        = require('gulp-sass');
var svgmin      = require('gulp-svgmin');
var imagemin    = require('gulp-imagemin');
var jshint      = require('gulp-jshint');
var uglify      = require('gulp-uglify');
var bundler     = process.platform === 'win32' ? 'bundle.bat' : 'bundle';

// Alerts Error
var onError = function(err) {
    notify.onError({
                title:    'Gulp',
                subtitle: 'Cagada detected!',
                message:  'Error: <%= error.message %>',
                sound:    'Beep'
            })(err);
    this.emit('end');
};

gulp.task('default', ['browser-sync', 'watch']);
gulp.task('build', ['clean', 'images', 'svgmin', 'styles', 'lint', 'scripts']);

// Build Server Jekyll 
gulp.task('serve', function () {
    var server = express();
    server.use(express.static('_site'));
    server.listen(3333);
});

// Build Jekyll 
gulp.task('jekyll', function () {
     return cp.spawn(bundler, ['exec', 'jekyll', 'build', '--drafts', '--quiet'], {stdio: 'inherit'});
});

// Rebuild Jekyll 
gulp.task('rebuild-jekyll', (code) => {
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('error', (error) => gutil.log(util.colors.red(error.message)))
    .on('close', code);
});

// Watch
gulp.task('watch', ['jekyll', 'serve'], function () {
    gulp.watch('_assets/scss/**/*.scss', ['styles']);
    gulp.watch('_assets/js/**/*.js', ['scripts']);
    gulp.watch(['_pages/**', '_pages/**/*'], ['rebuild-jekyll']);
});

// Browsersync
gulp.task('browser-sync', ['jekyll', 'serve'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});


// ============= BUILDING TASKS ============= //

// Clean Pre-Build
gulp.task('clean', function (cb) {
    del(['_site/assets/**/*'], function (err, deletedFiles) {});
    cb();
});

// Minify Images
gulp.task('images', function () {
    return gulp.src('_assets/img/**/*')
        .pipe(plumber({errorHandler: onError}))
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('_assets/img'))
        .pipe(gulp.dest('assets/img'));
});

// Minify SVG's
gulp.task('svgmin', function () {
    return gulp.src('_assets/svg/**/*')
        .pipe(plumber({errorHandler: onError}))
        .pipe(svgmin())
        .pipe(gulp.dest('_assets/svg'))
        .pipe(gulp.dest('assets/svg'));
});

// Compile SASS
gulp.task('styles', function () {
    return gulp.src('_assets/scss/main.scss')
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('assets/css'));
});

// Lint scripts
gulp.task('lint', function () {
    return gulp.src(['gulpfile.js', '_assets/js/**/*.js'])
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint());
});
gulp.task('scripts', ['scripts:jquery', 'scripts:bundle']);

// Compress Javascript
gulp.task('scripts:jquery', function() {
    return gulp.src(['_assets/js/**/*.js'])
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint())
        .pipe(uglify())
        .pipe(gulp.dest('assets/js'))
        .pipe(gulp.dest('_site/assets/js'));
});

// Compress Javascript
gulp.task('scripts:bundle', function() {
    return gulp.src(['_assets/js/**/*.js'])
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint())
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js'))
        .pipe(gulp.dest('_site/assets/js'));
});