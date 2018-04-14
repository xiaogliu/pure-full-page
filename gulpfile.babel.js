import babel from 'gulp-babel';
import gulp from 'gulp';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';

const srcFiles = [
  './src/no_module/js/components/utils.js',
  './src/no_module/js/components/pureFullPage.js',
];

gulp.task('transferJS', () => {
  gulp
    .src(srcFiles)
    .pipe(concat('pureFullPage.min.js'))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});
