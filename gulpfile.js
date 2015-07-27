var gulp = require('gulp'),
		  gutil = require('gulp-util'),
		  coffee = require('gulp-coffee'),
		  browserify = require('gulp-browserify'),
		  compass = require('gulp-compass'),
		  connect = require('gulp-connect'),
		  concat = require('gulp-concat')
		  ;

var env,
		  coffeeSources,
		  jsSources,
		  sassSources,
		  htmlSources,
		  jsonSources,
		  outputDir,
		  sassStyle;

coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = ['builds/development/*.html'];
jsonSources = ['builds/development/js/*.json'];

gulp.task('log', function () {
	gutil.log('workflows examples ...');
});

gulp.task('coffee', function () {
	gulp.src(coffeeSources)
			  .pipe(coffee({bare: true}))
			  .on('error', gutil.log)
			  .pipe(gulp.dest('components/scripts'))
			  ;
});

gulp.task('js', function () {
	gulp.src(jsSources)
			  .pipe(concat('script.js'))
			  .on('error', gutil.log)
			  .pipe(browserify())
			  .pipe(gulp.dest('builds/development/js'))
			  .pipe(connect.reload())
			  ;
});

gulp.task('compass', function () {
	gulp.src(sassSources)
			  .pipe(compass({
				  sass: 'components/sass',
				  image: 'builds/development/images',
				  style: 'expanded'
			  }))
			  .on('error', gutil.log)
			  .pipe(gulp.dest('builds/development/css'))
			  .pipe(connect.reload())
			  ;
});

gulp.task('watch', function () {
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch(htmlSources, ['html']);
	gulp.watch(jsonSources, ['json']);
});

gulp.task('connect', function () {
	connect.server({
		root: 'builds/development/',
		port: 8888,
		livereload: true
	});
});

gulp.task('html', function () {
	gulp.src('builds/development/*.html')
			  .pipe(connect.reload())
			  ;
});

gulp.task('json', function () {
	gulp.src('builds/development/js/*.json')
			  .pipe(connect.reload())
			  ;
});

gulp.task('all', ['coffee', 'js', 'compass']);

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);
