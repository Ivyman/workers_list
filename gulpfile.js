'use strict';
// project folders
// /src 
//  |_/assets
//  |   |__/img
//  |   |__/sass
//  |   |__/js
//  |_index.pug


// build folder
//
// :::: path for IMG ::::
// background: #222 url('/assets/img/tablet.jpg')
//
// /build
//  |_/assets
//  |   |__/img
//  |   |__/sass
//  |   |__/js
//  |_index.html
          

// Other
let gulp 			= require('gulp'),
	watch 			= require('gulp-watch'),
	concat 			= require('gulp-concat'),
	rename 			= require('gulp-rename'),
	server			= require('gulp-server-livereload'),
	del 			  = require('del'),
	runSequence = require('run-sequence');

 // CSS plugins
let CSSmin = require('gulp-clean-css'),
		sass     = require('gulp-sass'),
 		uncss    = require('gulp-uncss'),
 		prefix   = require('gulp-autoprefixer');

 // JS plugins
let JSmin  = require('gulp-jsmin'),
    babel  = require('gulp-babel'),
    JShint = require('gulp-jshint');

// HTML plugins
let pug     = require('gulp-pug'),
		HTMLmin = require('gulp-html-minifier');

// IMG plugins
var imageMin = require('gulp-imagemin');

let srcPath   = './src',
 		buildPath = './dist';


// img
gulp.task('img', () => {
	return gulp.src(`${srcPath}/assets/img/*`)
		.pipe(gulp.dest(`${buildPath}/assets/img`))
});
gulp.task('img-build', () => {
	return gulp.src(`${buildPath}/assets/img/*`)
		.pipe(imageMin())
		.pipe(gulp.dest(`${buildPath}/assets/img`))
});

// fonts
gulp.task('fonts', () => {
	return gulp.src(`${srcPath}/assets/fonts/*`)
		.pipe(gulp.dest(`${buildPath}/assets/fonts`))
});

// js
gulp.task('js', () => {
	return gulp.src(`${srcPath}/assets/js/**/*.js`)
		.pipe(concat('bundle.js'))
		.pipe(JShint({ esversion: 6 }))
		.pipe(JShint.reporter()) // set up style errors type
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest(`${buildPath}/assets/js`));
});
gulp.task('js-build', () => {
	return  gulp.src(`${buildPath}/assets/js/*.js`)
		.pipe(JSmin())
		.pipe(gulp.dest(`${buildPath}/assets/js`))
});

// pug
gulp.task('pug', () => {
	return gulp.src(`${srcPath}/*.pug`)
		.pipe(pug({ pretty: true }))
		.pipe(gulp.dest(buildPath))
});
gulp.task('html-build', () => {
	return gulp.src(`${buildPath}/*.html`)
        .pipe(HTMLmin({
        	collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest(buildPath))
});

// sass
gulp.task('sass', () => {
	return gulp.src(`${srcPath}/assets/sass/main.sass`)
		.pipe(sass()).on('error', sass.logError)
		.pipe(prefix('last 10 versions'))
		.pipe(gulp.dest(`${buildPath}/assets/css`));
});
gulp.task('css-build', () => {
	return gulp.src(`${buildPath}/assets/css/*`)
		.pipe(uncss({
			html: [`${buildPath}/*.html`]
		}))
		.pipe(CSSmin())
		// .pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(`${buildPath}/assets/css`))
});


// clean deploy path
gulp.task('clean:dist', () => {
	return del.sync('./dist');
});

// boxes
gulp.task('dev-box', ['pug', 'js', 'sass', 'img', 'fonts']);
gulp.task('prod-box', ['html-build', 'js-build', 'css-build', 'img-build', 'fonts']);

// watch
gulp.task('watch', () => {
	gulp.watch([`${srcPath}/assets/sass/**/*.sass`, `${srcPath}/layout/**/*.sass`], ['sass']);
	gulp.watch(`${srcPath}/**/*.pug`, ['pug']);
	gulp.watch(`${srcPath}/assets/fonts/**/*`, ['fonts']);
	gulp.watch(`${srcPath}/assets/js/**/*.js`, ['js']);
	gulp.watch(`${srcPath}/assets/img/**/*`, ['img']);
});

// server
gulp.task('server', () => {
	gulp.src(buildPath)
		.pipe(server({
			livereload: true,
			open: true
		}))
});

// build
gulp.task('build', () => {
	runSequence('clean:dist', 'dev-box', 'prod-box')
});

// dev
gulp.task('default', () => {
	runSequence('clean:dist', ['dev-box', 'watch'], 'server')
});