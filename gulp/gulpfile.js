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


gulp.task('browserSync', function(){
	browserSync({
		server: {
			baseDir: 'dist'
		}
	})
})


gulp.task('sass', function(){
	return gulp.src('src/css/**/*.scss')
	.pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
  .pipe(dgbl())
  .pipe(postcss([autoprefixer({browsers: ['last 2 versions', 'Android > 4.4','iOS >= 8', 'Firefox >= 20']})]))
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.reload({  // 只有被改变的地方局部刷新
		stream: true
	}))
})

gulp.task('babel', function(){
	return gulp.src('src/js/**/*.js')
	.pipe(babel({
		presets: ['@babel/env'],
		plugins: ['@babel/transform-runtime']
	}))
	// .pipe(uglify())
	.pipe(gulp.dest('dist/js'))
})

gulp.task('concat',function() {
    gulp.src('src/*.html')
        .pipe(contentIncluder({
            includerReg:/<!\-\-\#include\s+virtual="([^"]+)"\-\->/g
        }))
        .pipe(gulp.dest('dist/'))
});

// gulp.task('useref', function() {
//   return gulp.src('src/*.html')
//     .pipe(useref())
//     .pipe(gulpIf('*.js', uglify()))
//     .pipe(gulpIf('*.css', cssnano()))
//     .pipe(gulp.dest('dist'));
// });
gulp.task('images', function() {
  return gulp.src('src/images/icon/*.png')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(spritesmith({
        imgName:'images/sprite.png', //合并后大图的名称
        cssName:'css/block/sprite.css',
        padding:2// 每个图片之间的间距，默认为0px
        // cssTemplate:(data)=>{
        // // data为对象，保存合成前小图和合成打大图的信息包括小图在大图之中的信息
        //    let arr = [],
        //         width = data.spritesheet.px.width,
        //         height = data.spritesheet.px.height,
        //         url =  data.spritesheet.image
        //     // console.log(data)
        //     data.sprites.forEach(function(sprite) {
        //         arr.push(
        //             '.icon-'+sprite.name+
        //             '{'+
        //                 'background: url('+url+') '+
        //                 'no-repeat '+
        //                 sprite.px.offset_x+' '+sprite.px.offset_y+';'+
        //                 'background-size: '+ width+' '+height+';'+
        //                 'width: '+sprite.px.width+';'+
        //                 'height: '+sprite.px.height+';'+
        //             '}\n'
        //         )
        //     })
        //     // return "@fs:108rem;\n"+arr.join("")
        //     return arr.join('')
        // }
    }))

    .pipe(gulp.dest('dist/'))
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
    // ['useref', 'images'],
    callback
  )
})

gulp.task('watch', function() {
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/**/*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);
})

gulp.task('default', function(callback) {
  runSequence(['clean:dist','sass', 'babel', 'browserSync', 'concat', 'images'], 'watch',
    callback
  )
})


