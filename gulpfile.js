'use strict';
// project folders
// /src 
//  |_/assets
//  |   |__/img
//  |   |__/scss
//  |   |__/coffee
//  |_index.pug


// build folder
//
// :::: path for IMG ::::
// ex: background: #222 url('/assets/img/tablet.jpg')
//
// /build
//  |_/assets
//  |   |__/images
//  |   |__/styles
//  |   |__/scripts
//  |_index.html
          

// Other
const gulp 				= require('gulp'),
			watch 			= require('gulp-watch'),
			concat 			= require('gulp-concat'),
			server			= require('gulp-server-livereload'),
			del 			  = require('del'),
			fs 					= require('fs'),
			runSequence = require('run-sequence');

// CSS plugins
const CSSmin 	 = require('gulp-clean-css'),
			sass     = require('gulp-sass'),
 			prefix   = require('gulp-autoprefixer');

// JS plugins
const JSmin  = require('gulp-jsmin'),
 			coffee = require('gulp-coffee');

// HTML plugins
const pug = require('gulp-pug'),
			data = require('gulp-data');

const srcPath   = `${__dirname}/src`,
 			buildPath = `${__dirname}/dist`;


// Img
gulp.task('images', () => {
	return gulp.src(`${srcPath}/img/*`)
		.pipe(gulp.dest(`${buildPath}/assets/images`));
});

// Font
gulp.task('fonts', () => {
	return gulp.src(`${srcPath}/fonts/*`)
		.pipe(gulp.dest(`${buildPath}/assets/fonts`));
});

// Coffee
gulp.task('scripts', function() {
	gulp.src(`${srcPath}/coffee/**/*.coffee`)
		.pipe(coffee({bare: true}))
		.pipe(JSmin())
		.pipe(gulp.dest(`${buildPath}/assets/scripts`));
});

// Pug
gulp.task('markup', () => {
	return gulp.src(`${srcPath}/index.pug`)
		.pipe(data((file) => {
			return JSON.parse(fs.readFileSync(`${srcPath}/data.json`))
		}))
		.pipe(pug({ pretty: true }))
		.pipe(gulp.dest(buildPath));
});

// Scss
gulp.task('styles', () => {
	return gulp.src(`${srcPath}/scss/styles.scss`)
		.pipe(sass()).on('error', sass.logError)
		.pipe(prefix('last 6 versions'))
		.pipe(CSSmin())
		.pipe(gulp.dest(`${buildPath}/assets/styles`));
});

// Clean deploy path
gulp.task('clean:dist', () => {
	return del.sync('./dist');
});

// Watch
gulp.task('watch', () => {
	gulp.watch([`${srcPath}/scss/**/*.scss`, `${srcPath}/layout/**/*.scss`], ['styles']);
	gulp.watch(`${srcPath}/**/*.pug`, ['markup']);
	gulp.watch(`${srcPath}/fonts/**/*`, ['fonts']);
	gulp.watch(`${srcPath}/coffee/**/*.coffee`, ['scripts']);
	gulp.watch(`${srcPath}/img/**/*`, ['images']);
});

// Server
gulp.task('server', () => {
	gulp.src(buildPath)
		.pipe(server({
			livereload: true,
			open: true
		}));
});

// Dev
gulp.task('default', () => {
	runSequence('clean:dist', ['markup', 'scripts', 'styles', 'images', 'fonts', 'watch'], 'server');
});