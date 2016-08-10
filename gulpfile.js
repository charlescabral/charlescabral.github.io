var gulp         = require('gulp');
var cp           = require('child_process');
var del          = require('del');
var concat       = require('gulp-concat');
var shell        = require('gulp-shell');
var express      = require('express');
var util         = require('gulp-util');
var browser_sync = require('browser-sync');
var plumber      = require('gulp-plumber');
var notify       = require('gulp-notify');
var sass         = require('gulp-sass');
var svgmin       = require('gulp-svgmin');
var svgSprite    = require('gulp-svg-sprite');
var svg2png      = require('gulp-svg2png');
var imagemin     = require('gulp-imagemin');
var jshint       = require('gulp-jshint');
var uglify       = require('gulp-uglify');
var bundler      = process.platform === 'win32' ? 'bundle.bat' : 'bundle';
var assets       = { src: '_assets/', dest: 'assets/' };
var svg          = {
    sprite_svg: require('gulp-svg-sprite'),
    svg2png:   require('gulp-svg2png')
}
var paths       = {
    img: {
        src:  assets.src + 'img/',
        dest: assets.dest + 'img/'
    },
    js: {
        src:  assets.src + 'js/',
        dest: assets.dest + 'js/'
    },
    scss: {
        src:  assets.src + 'scss/',
        dest: assets.dest + 'css/'
    },
    svg: {
        dest: assets.src + 'svg/',
        src:  assets.src + 'svg/sprite/*.svg',
        file: assets.src + 'svg/sprite_svg.svg',
        css:  assets.src + 'scss/components/_sprite-svg.scss'
    },
    templates: {
        svg:  assets.src + 'scss/template/'
    }
};

// ============= SERVER BUILDINGS ============= //

gulp.task('default', ['browser-sync', 'watch']);
gulp.task('build', ['clean', 'svg', 'images', 'styles', 'lint', 'scripts']);

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
gulp.task('rebuild', (code) => {
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('error', (error) => gutil.log(util.colors.red(error.message)))
    .on('close', code);
});
gulp.task('jekyll-rebuild', ['rebuild'], function () { browser_sync.reload() });

// Watch
gulp.task('watch', ['jekyll', 'serve'], function () {
    gulp.watch(paths.scss.src + '**/*.scss', ['styles']);
    gulp.watch(paths.js.src + '**/*.js', ['scripts']);
    gulp.watch(['_pages/**/*','_projects/**/*','_posts/**/*', '_data/**/*'], ['jekyll-rebuild']);
});

// Browser_sync
gulp.task('browser-sync', ['jekyll', 'serve'], function() {
    browser_sync({
        server: { baseDir: '_site' }
    });
});



// ============= TASKS BUILDING ============= //

// Clean Pre Build
gulp.task('clean', function (cb) {
    del(['_site/'+ assets.dest +'**/*', assets.dest +'**/*'], function (err, deletedFiles) {});
    cb();
});

// Minify Images
gulp.task('images', function () {
    return gulp.src(paths.img.src + '**/*')
        .pipe(plumber({errorHandler: onError}))
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(paths.img.src))
        .pipe(gulp.dest(paths.img.dest));
});

// Make Sprite SVG and Sass Sprite
gulp.task('sprite_svg', function () {
    return gulp.src(paths.svg.src)
        .pipe(svg.sprite_svg({
            shape: {
                spacing: { padding: 6 }
            },
            mode: {
                css: {
                    dest: '../',
                    layout: 'binary-tree',
                    sprite: paths.svg.file,
                    bust: false,
                    render: {
                        scss: {
                            dest: paths.svg.css,
                            template: paths.templates.svg + '_sprite-tpl.scss'
                        }
                    }
                }
            },
            variables: { mapname: 'icons' }
        }))
        .pipe(gulp.dest(assets.src));
});

// SVG to PNG
gulp.task('svg_png', ['sprite_svg'], function() {
    return gulp.src(paths.svg.file)
        .pipe(svg.svg2png())
        .pipe(gulp.dest(paths.img.src));
});
    
gulp.task('svg', ['svg_png','svgmin']);


// Minify SVG's
gulp.task('svgmin', function () {
    return gulp.src('_assets/svg/**/*.svg')
        .pipe(plumber({errorHandler: onError}))
        .pipe(svgmin())
        .pipe(gulp.dest('_assets/svg'))
        .pipe(gulp.dest('assets/svg'));
});

// Compile SASS
gulp.task('styles', function () {
    return gulp.src(paths.scss.src + 'main.scss')
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(browser_sync.reload({stream:true}))
        .pipe(gulp.dest(paths.scss.dest));
});

// Lint scripts
gulp.task('lint', function () {
    return gulp.src(['gulpfile.js', paths.js.src + '**/*' ])
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint());
});
gulp.task('scripts', ['scripts:jquery', 'scripts:bundle']);

// Compress Javascript
gulp.task('scripts:jquery', function() {
    return gulp.src([paths.js.src + '**/*'])
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint())
        .pipe(uglify())
        .pipe(browser_sync.stream())
        .pipe(gulp.dest(paths.js.dest))
        .pipe(gulp.dest(paths.js.src));
});

// Compress Javascript
gulp.task('scripts:bundle', function() {
    return gulp.src([paths.js.src + '**/*'])
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint())
        // .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js.dest))
        .pipe(gulp.dest(paths.js.src));
});

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
