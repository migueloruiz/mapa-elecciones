
// ===== Gulp Includes ===============================================================================================================

// Gulps Generales
// ====================================
const gulp			 = require('gulp');
const plumber		= require('gulp-plumber');
const browserSync = require('browser-sync');
const gutil = require('gulp-util');
const reload = browserSync.reload;

// Compilacion y más
// ====================================
const compass = require('gulp-compass'); //Compilador SASS/SCSS
const jade = require('gulp-jade'); // Compilador Jade/Pug

// Edicion y Minificacion de Archivos
// ====================================
const uglify = require('gulp-uglify'); // Minificar
const concat = require('gulp-concat'); // Concatenar
const rename = require('gulp-rename'); // Renombrar
const changed = require('gulp-changed'); // Rectificaccion de cambio en arcvhivo destino
const changedInPlace = require('gulp-changed-in-place'); // Rectificaccion de cambio en arcvhivo origen
const header = require('gulp-header'); // Escritura de Header para TimeStamp

// Parametros
// ====================================
const SRC = './';
const DEST = './';
const JStoMIN = [
	'./js/scripts.js',
	'./js/lib.js',
	'./js/en-vivo.js',
	'./js/mapa-elecciones.js',
	'!js/*.min.js' // no minificar los archivos ya Minificados
];

// ===== Gulp Tasks ===============================================================================================================

// SASS >> CSS con SASS(3.3.3) y Compass(1.0.1)
// =============================================
gulp.task('compass', function buildCSS() {
	return gulp.src(SRC + 'sass/*.sass')
				.pipe(plumber({
					errorHandler: function (error) {
						console.log("<======= Compass Error ========>");
						console.log(error.message);
						this.emit('end');
				}}))
				.pipe(changedInPlace())
				.pipe(changed('./css/', {extension: '.css'}))
				.pipe(compass({
						style:      'compact',
						environment: 'development',
						css:        './css',
						sass:       './sass',
						image:      './img',
						javascript: './js',
						font:       './css/fonts',
						time:       true
				}))
});
gulp.task('compassWatch', ['compass'] , reload );

// Jade >> HTML
// Nota: No verifica por modificaciones en los includes
// ======================================================
gulp.task('jade', function buildHTML() {
	return gulp.src(SRC + 'jade/*.jade')
				.pipe(plumber({
					errorHandler: function (error) {
						console.log("<======= Jade Error ========>");
						console.log(error.message);
						this.emit('end');
					}
				}))
				// .pipe(changedInPlace())
				// .on('start', function(){ gutil.log('JADE >>> HTML'); })
				.pipe(changed('./', {extension: '.html'}))
				.pipe(jade({
					pretty: true
				}))
				.pipe(plumber.stop())
				.pipe(gulp.dest(function(file) {
						gutil.log(gutil.colors.magenta('----') ,getFileName(file.history[0]),gutil.colors.cyan('▸'),getFileName(file.history[1]) );
						return './';
				}))
});
gulp.task('jadeWatch', ['jade'] ,reload);

// Includes.Jade Update == Jade Templetes >> HTML
// Nota: Verifica cambios en los Includes
// y actualiza todos los templates
// ======================================================
gulp.task('allJadesUpdates', function updateHTML() {
	return gulp.src(SRC + 'jade/*.jade')
				.on('start', function(){ gutil.log('JADE >>> HTML'); })
				.pipe(plumber({
					errorHandler: function (error) {
						console.log("<======= Jade Error ========>");
						console.log(error.message);
						this.emit('end');
					}
				}))
				.pipe(jade({
					pretty: true
				}))
				.pipe(plumber.stop())
				.pipe(gulp.dest(function(file) {
					gutil.log(gutil.colors.magenta('----') ,getFileName(file.history[0]),gutil.colors.cyan('▸'),getFileName(file.history[1]) );
					return './';
				}))
});
gulp.task('includeUpWatch', ['allJadesUpdates'] ,reload);

// All js in /Libs >> LibJs
// ====================================
gulp.task('concatLibJs', function buildJS() {
	var date = new Date();
	var timeStamp = '/*lib.js generado el :' + date + '*/\n\n';
	return gulp.src(SRC + 'js/libs/*.js')
					.pipe(plumber({
						errorHandler: function (error) {
							console.log("<======= Uglify-js Error ========>");
							console.log(error.message);
							this.emit('end');
					}}))
					.pipe(changedInPlace())
					.pipe(changed('./js/', {extension: '.js'}))
					.pipe(concat('lib.js'))
					.pipe(header(timeStamp))
					.pipe(gulp.dest(function(file) {
							gutil.log(gutil.colors.magenta('----') ,getFileName('/libs'),gutil.colors.cyan('▸'),getFileName('lib.js'));
							return './js/';
					}))
});

// Js >>> min.Js
// ====================================
gulp.task('minJs', function minJS() {
	var date = new Date();
	var timeStamp = '/* Generado el :' + date + ' */\n\n';
	return gulp.src( JStoMIN )
					.pipe(plumber({
						errorHandler: function (error) {
							console.log("<======= Uglify-js Error ========>");
							console.log(error.message);
							this.emit('end');
					}}))
					.pipe(changedInPlace())
					.pipe(changed('./js/', {extension: 'min.js'}))
					.pipe(rename({suffix: '.min'}))
					.pipe(uglify())
					.pipe(header(timeStamp))
					.pipe(plumber.stop())
					.pipe(gulp.dest(function(file) {
							gutil.log(gutil.colors.magenta('----') ,getFileName(file.history[0]),gutil.colors.cyan('▸'),getFileName(file.history[1]) );
							return './js/';
					}))
});
gulp.task('jsMinWatch', ['minJs'], reload);


// browser-sync Init
// ====================================
gulp.task('browser-sync-init', function() {
		browserSync({
				server: DEST,
				browser: 'google chrome'
		});
});

// Start Code
// ====================================
gulp.task('compileProject', ['compass','concatLibJs','minJs','allJadesUpdates','browser-sync-init'], function() {
		gulp.watch(SRC + 'jade/*.jade', ['jadeWatch']);
		gulp.watch(SRC + 'jade/includes/*.jade', ['includeUpWatch']);
		gulp.watch(SRC + 'sass/*.sass', ['compassWatch']);
		gulp.watch(SRC + 'js/libs/*.js', ['concatLibJs']);
		gulp.watch([SRC + 'js/*.js' ,'!./js/*.min.js'], ['jsMinWatch']);
});

// ===== Custome Fuctions ===============================================================================================================
var getFileName = function( url ) {
	var index = url.lastIndexOf("/") + 1;
	return filename = url.substr(index);
}
