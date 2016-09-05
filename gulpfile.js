// ============= VARS ============= //

var gulp         = require('gulp');
    cp           = require('child_process'),
    del          = require('del'),
    concat       = require('gulp-concat'),
    shell        = require('gulp-shell'),
    express      = require('express'),
    util         = require('gulp-util'),
    browser_sync = require('browser-sync'),
    plumber      = require('gulp-plumber'),
    notify       = require('gulp-notify'),
    sass         = require('gulp-sass'),
    neat         = require('node-neat').includePaths,
    normalize    = require('node-normalize-scss').includePaths,
    sequence     = require('gulp-sequence').use(gulp),
    svgmin       = require('gulp-svgmin'),
    svgstore     = require('gulp-svgstore'),
    inject       = require('gulp-inject'),
    cheerio      = require('gulp-cheerio'),
    svgSprite    = require('gulp-svg-sprite'),
    svg2png      = require('gulp-svg2png'),
    imagemin     = require('gulp-imagemin'),
    jshint       = require('gulp-jshint'),
    uglify       = require('gulp-uglify'),
    teste        = require('path'),
    bundler      = process.platform === 'win32' ? 'bundle.bat' : 'bundle',
    assets       = { src: '_assets/', dest: 'assets/' };
    includes     = { dest: '_includes/' };
var svg          = { sprite_svg: require('gulp-svg-sprite'), svg2png: require('gulp-svg2png') }
var paths        = {
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
        src:    assets.src + 'img/svg/',
        dest:   assets.dest + 'img/svg/',
        sprite: assets.src + 'img/svg/sprite/*.svg',
        file:   assets.src + 'img/svg/sprite-svg.svg',
        css:    assets.src + 'scss/helpers/_sprite_svg.scss'
    },
    templates: {
        svg:  assets.src + 'scss/template/'
    }
};


// ============= SERVER BUILDINGS ============= //

gulp.task('default', ['browser-sync', 'watch']);
gulp.task('build', ['clean', 'img', 'styles', 'lint', 'scripts']);
gulp.task('img', sequence('svg_min_all', 'sprite_svg', 'svg_inject', 'svg_min_build', 'svg_png', 'images'));
gulp.task('scripts', ['scripts:vendor', 'scripts:plugins']);

// ============= //

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
    gulp.watch(paths.scss.src + '**/*.scss', ['styles', 'jekyll-rebuild']);
    gulp.watch(paths.js.src + '**/*.js', ['scripts', 'jekyll-rebuild']);
    gulp.watch(['_pages/**/*','_projects/**/*','_posts/**/*', '_data/**/*', '_includes/**/*', '_layouts/**/*'], ['jekyll-rebuild']);
});

// Browser Sync
gulp.task('browser-sync', ['jekyll', 'serve'], function() {
    browser_sync({
        server: { baseDir: '_site' }
    });
});



// ============= IMAGES BUILDING ============= //

// Clean Pre Build
gulp.task('clean', function (cb) {
    del(['_site/'+ assets.dest +'**/*', assets.dest +'**/*'], function (err, deletedFiles) {});
    cb();
});

// Minify SVG's
gulp.task('svg_min_all', function () {
    return gulp.src(paths.svg.src + '**/*.svg')
        .pipe(plumber({errorHandler: onError}))
        .pipe(svgmin())
        .pipe(gulp.dest(paths.svg.src));
});

// Minify SVG's
gulp.task('svg_min_build', function () {
    return gulp.src(paths.svg.src + '**/*.svg')
        .pipe(plumber({errorHandler: onError}))
        .pipe(svgmin(function (file) {
            var prefix = teste.basename(file.relative, teste.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(gulp.dest(paths.svg.dest));
});


gulp.task('svg_inject', function () {
    var svgs = gulp
        .src(paths.svg.src + 'inject/*.svg')
        .pipe(svgstore({ inlineSvg: true }))
        .pipe(cheerio({
            run: function ($) {
                $('svg').attr('style',  'display:none')
                $('svg').attr('version',  '1.1')
                $('svg').attr('xmlns',  'http://www.w3.org/2000/svg')
                $('svg').attr('xmlns:xlink',  'http://www.w3.org/1999/xlink')
                $('svg').attr('preserveAspectRatio',  'xMidYMid meet')
            },
            parserOptions: { xmlMode: false }
        }));

    function fileContents (filePath, file) {
        return file.contents.toString();
    }

    return gulp
        .src(includes.dest + 'head_svg.html')
        .pipe(inject(svgs, { transform: fileContents }))
        .pipe(gulp.dest(includes.dest));
});

// Make Sprite SVG and Sass Sprite
gulp.task('sprite_svg', function () {
    return gulp.src(paths.svg.sprite)
        .pipe(svg.sprite_svg({
            shape: {
                spacing: { padding: 6 }
            },
            mode: {
                css: {
                    dest: '../',
                    layout: 'vertical',
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
            variables: { mapname: 'icon' }
        }))
        .pipe(gulp.dest(assets.src));
});

// SVG to PNG
gulp.task('svg_png', function() {
    return gulp.src(paths.svg.file)
        .pipe(plumber({errorHandler: onError}))
        .pipe(svg.svg2png())
        .pipe(gulp.dest(paths.img.src));
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


// ============= CODE BUILDING ============= //

// Compile SASS
gulp.task('styles', function () {
    return gulp.src(paths.scss.src + 'main.scss')
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass({
            includePaths: [].concat(normalize, neat),
            outputStyle: 'compressed'
        }))
        .pipe(gulp.dest(paths.scss.dest));
});

// Lint scripts
gulp.task('lint', function () {
    return gulp.src(['gulpfile.js', paths.js.src + '**/*.js' ])
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint());
});

// Compress Javascript
gulp.task('scripts:vendor', function() {
    return gulp.src([paths.js.src + '*.js', paths.js.src + 'vendor/*.js'])
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint())
        .pipe(uglify())
        .pipe(gulp.dest(paths.js.dest));
});

gulp.task('scripts:plugins', function() {
    return gulp.src([paths.js.src + 'plugins/*.js'])
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint())
        .pipe(concat('plugins.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js.dest));
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
