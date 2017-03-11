var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    concatCss = require('gulp-concat-css'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    bourbon = require('node-bourbon'),
    autoprefixer = require('gulp-autoprefixer'),
    spritesmith = require('gulp.spritesmith');

gulp.task('sass', function() {
  return gulp.src(['app/scss/main.scss', 'app/scss/media.scss'])
  .pipe(sass({
      includePaths: bourbon.includePaths
  }))
  .pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'], {cascade: true}))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function() {
  return gulp.src(['app/libs/jquery.js', 'app/libs/*.js'])
  .pipe(concat('libs.min.js'))
  .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', function() {
  return gulp.src(['app/libs/*.css'])
  .pipe(concatCss('libs.min.css'))
  .pipe(cssnano())
  .pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});

gulp.task('default', ['browser-sync', 'css-libs', 'sass', 'scripts'], function() {
  gulp.watch('app/scss/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/*.js', browserSync.reload);
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('img', function() {
  return gulp.src('app/img/**/*')
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  })))
  .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts', 'css-libs'], function() {

  gulp.src(['app/css/*.css'])
  .pipe(gulp.dest('dist/css'));

  gulp.src(['app/fonts/**/*'])
  .pipe(gulp.dest('dist/fonts'));

  gulp.src(['app/js/*.js'])
  .pipe(gulp.dest('dist/js'));

  gulp.src(['app/*.html'])
  .pipe(gulp.dest('dist'));
});

gulp.task('sprite', function() {
  var spriteData = gulp.src('app/img/icon/*png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss'
  }));
  return spriteData.pipe(gulp.dest('app/img/'));
});

gulp.task('clear', function() {
  return cache.clearAll();
});
