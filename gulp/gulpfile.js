const gulp = require('gulp');
const browserSync = require('browser-sync'); // 自动刷新
const sass = require('gulp-sass'); // 编译Sass
const postcss = require('gulp-postcss'); // 编译Sass
const autoprefixer = require('autoprefixer');
const dgbl = require("del-gulpsass-blank-lines"); // 删掉sass空行
// const useref = require('gulp-useref'); // 指定产出路径
// const uglify = require('gulp-uglify'); //压缩
// const minifyCss = require('gulp-minify-css'); //压缩CSS
// const cssnano = require('gulp-cssnano');
const babel = require('gulp-babel'); // bable
const runSequence = require('run-sequence'); // 按照指定顺序运行任务
// const gulpIf = require('gulp-if');
const contentIncluder = require('gulp-content-includer'); // include 公共模块
const imagemin = require('gulp-imagemin'); // 优化图片
const spritesmith = require('gulp.spritesmith'); // 图片精灵
const cache = require('gulp-cache'); // 缓存代理任务。，减少图片重复压缩
const del = require('del'); // 清理生成文件
const config = { // 路径
  baseDir: 'G:/www/work/pcauto/2018/cheshili/pc/dist',
  cssDir: {
    src: 'src/css/**/*.scss',
    dest: 'dist/css'
  },
  jsDir: {
    src: 'src/js/**/*.js',
    dest: 'dist/js'
  },
  htmlDir: {
    src: 'src/*.html',
    src_all: 'src/**/*.html',
    dest: 'dist/'
  },
  imgDir: {
    src: 'src/images/*.png',
    dest: 'dist/images',
    src_icon: 'src/images/icons/*.png',
    dest_icon: 'dist/'
  }
}


gulp.task('browserSync', function(){
  browserSync({
    server: {
      baseDir: config.baseDir,
      open: false
    }
  })
})


gulp.task('sass', function(){
	return gulp.src(config.cssDir.src)
  	.pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
    .pipe(dgbl())
    .pipe(postcss([autoprefixer({browsers: ['last 2 versions', 'Android > 4.4','iOS >= 8', 'Firefox >= 20', 'ie >= 7']})]))
  	.pipe(gulp.dest(config.cssDir.dest))
  	.pipe(reload({ stream: true}))
})


gulp.task('babel', function(){
	return gulp.src(config.jsDir.src)
  	.pipe(babel({
  		presets: ['@babel/env'],
  		plugins: ['@babel/transform-runtime']
  	}))
  	// .pipe(uglify())
  	.pipe(gulp.dest(config.jsDir.dest))
    .pipe(reload({ stream: true}))
})

gulp.task('concat',function() {
  return gulp.src(config.htmlDir.src)
    .pipe(contentIncluder({
        includerReg:/<!\-\-\#include\s+virtual="([^"]+)"\-\->/g
    }))
    .pipe(gulp.dest(config.htmlDir.dest))
    .pipe(reload({ stream: true}))
});


// gulp.task('useref', function() {
//   return gulp.src('src/*.html')
//     .pipe(useref())
//     .pipe(gulpIf('*.js', uglify()))
//     .pipe(gulpIf('*.css', cssnano()))
//     .pipe(gulp.dest('dist'));
// });
gulp.task('spritesmith', function() {
  return gulp.src(config.imgDir.src_icon)
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(spritesmith({
        imgName:'images/strength_icon.png', //合并后大图的名称
        cssName:'css/block/strength_icon.css',
        padding:2// 每个图片之间的间距，默认为0px
    }))

    .pipe(gulp.dest(config.imgDir.dest_icon))
});

gulp.task('images', function() {
  return gulp.src(config.imgDir.src)
    .pipe(cache(imagemin({
      interlaced: true,
    })))

    .pipe(gulp.dest(config.imgDir.dest))
});


gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
})
gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'sass',
    'babel',
    'concat',
    'images',
    'spritesmith',
    callback
  )
})
})

gulp.task('watch', function() {
  gulp.watch(config.cssDir.src, ['sass']);
  gulp.watch(config.jsDir.src, ['babel']);
  gulp.watch(config.htmlDir.src_all, ['concat']);
})

gulp.task('default', function(callback) {
  runSequence([
    'clean:dist',
    'sass',
    'babel',
    'concat',
    'images',
    'spritesmith',
    'browserSync'], 'watch',
    callback
  )
})


