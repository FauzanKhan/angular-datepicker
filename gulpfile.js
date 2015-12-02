var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

gulp.task('compileSass', function(){
	gulp.src('scss/*.scss')
		.pipe(sass())
		.pipe(concat('app.css'))
		.pipe(gulp.dest('css/'));
});

gulp.task('watch', function(){
	gulp.watch('scss/*.scss', ['compileSass']);
})