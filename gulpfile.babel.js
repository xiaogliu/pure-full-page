import babel from 'gulp-babel';
import gulp from 'gulp';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';

gulp.task('babel', () => {
  gulp
    .src('./src/no_module/js/components/pureFullPage.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename('pureFullPage.min.js'))
    .pipe(gulp.dest('./dist'));
  console.log(111);
});
