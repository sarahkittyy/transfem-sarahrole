var gulp = require('gulp');
var ts = require('gulp-typescript');

let tsproj = ts.createProject('tsconfig.json');

gulp.task('default', ()=>{
	return gulp.src('src/**/*.ts')
	.pipe(tsproj())
	.pipe(gulp.dest('dist'));
});