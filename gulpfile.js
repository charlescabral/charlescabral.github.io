var gulp        = require('gulp');
var cp          = require('child_process');
var del         = require('del');
var concat      = require('gulp-concat');
var shell       = require('gulp-shell');
var express     = require('express');
var browserSync = require('browser-sync');
var plumber     = require('gulp-plumber');
var notify      = require('gulp-notify');
var sass        = require('gulp-sass');
var imagemin    = require('gulp-imagemin');
var jshint      = require('gulp-jshint');
var uglify      = require('gulp-uglify');
var bundler     = process.platform === 'win32' ? 'bundle.bat' : 'bundle';

var onError = function(err) {
    notify.onError({
                title:    'Gulp',
                subtitle: 'Failure!',
                message:  'Error: <%= error.message %>',
                sound:    'Beep'
            })(err);
    this.emit('end');
};

gulp.task('default', ['browser-sync', 'watch']);
gulp.task('bower', function() { return bower() });
gulp.task('build', ['clean', 'images', 'styles', 'lint', 'scripts']);

gulp.task('serve', function () {
    var server = express();
    server.use(express.static('_site'));
    server.listen(3333);
});

gulp.task('watch', ['jekyll', 'serve'], function () {
    browserSync.reload();
    gulp.watch('_assets/images/**/*', ['images']);
    gulp.watch('_assets/scss/**/*.scss', ['styles']);
    gulp.watch('_assets/js/**/*.js', ['scripts']);
    gulp.watch(['_assets/scss/**/*'], ['jekyll']);
    gulp.watch(['*.html', '**/*.html', '**/*.md', '!assets/**', '!_assets/**', '!_site/**', '!_site/**/*'], ['jekyll']);
});


gulp.task('browser-sync', ['jekyll', 'serve'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

// Cleanup
gulp.task('clean', function (cb) {
    // Force cleaning first before all other tasks
    del(['_site', '_site/assets/css/**/*', '_site/assets/img/**/*', '_site/assets/js/**/*', 'assets/css/**/*', 'assets/img/**/*', 'assets/js/**/*'], function (err, deletedFiles) {
        //console.log('Files deleted:', deletedFiles.join(', '));
    });
    cb();
});

// Process images
gulp.task('images', function () {
    return gulp.src('_assets/img/**/*')
        .pipe(plumber({errorHandler: onError}))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest('assets/img'))
        .pipe(gulp.dest('_site/assets/img')); // Copy to static dir
});

// Compile style sheets
gulp.task('styles', function () {
    return gulp.src('_assets/scss/main.scss')
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('assets/css'))
        .pipe(gulp.dest('_site/assets/css')); // Copy to static dir
});

// Lint scripts
gulp.task('lint', function () {
    return gulp.src(['gulpfile.js', '_assets/js/**/*.js'])
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint());
});

gulp.task('scripts', ['scripts:jquery', 'scripts:bundle']);

// Compress jquery
gulp.task('scripts:jquery', function() {
    return gulp.src(['_assets/js/**/*.js'])
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint())
        .pipe(uglify())
        .pipe(gulp.dest('assets/js'))
        .pipe(gulp.dest('_site/assets/js')); // Copy to static dir
});

gulp.task('scripts:bundle', function() {
    return gulp.src(['_assets/js/**/*.js'])
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint())
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js'))
        .pipe(gulp.dest('_site/assets/js')); // Copy to static dir
});

// Compile pages with Jekyll
gulp.task('jekyll', function () {
     return cp.spawn(bundler, ['exec', 'jekyll', 'build', '--drafts', '--quiet'], {stdio: 'inherit'});
});