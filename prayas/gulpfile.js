var gulp = require('gulp');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');

//SASS coversion
gulp.task('sass', function () {
    gulp.src('./css/scss/*.scss')
        .pipe(sass({ outputStyle: 'compressed'}).on('error',sass.logError))
        .pipe(gulp.dest('./css/'))
	.pipe(livereload());
    console.log("SASS Convertion Done!");
});


// Watcher
gulp.task('watch', function() {
	 livereload.listen(); 
  gulp.watch('./css/scss/*.scss', ['sass']);  
});

gulp.task('default',['sass','watch']);