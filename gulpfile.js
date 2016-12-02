var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('copyplugins', function() {
   gulp.src('./bower_components/ionic/fonts/*')
   .pipe(gulp.dest('./www/lib/ionic/fonts'))
   gulp.src('./bower_components/ionic/js/ionic.bundle.min.js')
   .pipe(gulp.dest('./www/lib/ionic'))   
   gulp.src('./bower_components/ngCordova/dist/ng-cordova.min.js')
   .pipe(gulp.dest('./www/lib'))
   gulp.src('./bower_components/underscore/underscore-min.js')
   .pipe(gulp.dest('./www/lib'))   
   gulp.src('./bower_components/ionic-content-banner/dist/ionic.content.banner.min.js')
   .pipe(gulp.dest('./www/lib'))
   gulp.src('./bower_components/ionic-content-banner/dist/ionic.content.banner.min.css')
   .pipe(gulp.dest('./www/lib'))   
   gulp.src('./bower_components/pouchdb/dist/pouchdb.min.js')
   .pipe(gulp.dest('./www/lib'));
   gulp.src('./bower_components/ionic-image-lazy-load/ionic-image-lazy-load.js')
   .pipe(gulp.dest('./www/lib'));
    
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
