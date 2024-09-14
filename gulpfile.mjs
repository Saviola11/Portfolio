import gulp from 'gulp';
import { series, parallel } from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import cssnano from 'gulp-cssnano';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import optipng from 'imagemin-optipng';
import svgo from 'imagemin-svgo';
import sourcemaps from 'gulp-sourcemaps';
import clean from 'gulp-clean';
import kit from 'gulp-kit';
import browserSync from 'browser-sync';

const bs = browserSync.create();
const sass = gulpSass(dartSass);

const paths = {
	html: './html/**/*.kit',
	sass: './src/sass/**/*.scss',
	js: './src/js/**/*.js',
	img: './src/img/*',
	dist: './dist/',
	sassDest: './dist/css',
	jsDest: './dist/js',
	imgDest: './dist/img',
};

function sassCompiler(done) {
	gulp
		.src(paths.sass)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cssnano())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.sassDest));
	done();
}

function javaScript(done) {
	gulp
		.src(paths.js)
		.pipe(sourcemaps.init())
		.pipe(babel({ presets: ['@babel/env'] }))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.jsDest));
	done();
}

function convertImages(done) {
	gulp
		.src(paths.img)
		.pipe(imagemin()) 
		.pipe(gulp.dest(paths.imgDest));
	done();
}
function handleKits(done) {
	gulp.src(paths.html).pipe(kit()).pipe(gulp.dest('./'));
	done();
}

function cleanStuff(done) {
	gulp.src(paths.dist, { read: false, allowEmpty: true }).pipe(clean());
	done();
}

function startBrowersSync(done) {
	bs.init({
		server: {
			baseDir: './',
		},
	});
	done();
}

function watchForChanges(done) {
	gulp.watch('./*.html').on('change', bs.reload);
	gulp
		.watch(
			[paths.html, paths.sass, paths.js],
			parallel(handleKits, sassCompiler, javaScript)
		)
		.on('change', bs.reload);
	gulp.watch(paths.img, convertImages).on('change', bs.reload);
	done();
}

const MainFunctions = parallel(
	handleKits,
	sassCompiler,
	javaScript,
	convertImages
);

export { cleanStuff };
export default series(MainFunctions, startBrowersSync, watchForChanges);
