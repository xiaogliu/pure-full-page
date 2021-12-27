import gulp from "gulp";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
import concat from "gulp-concat";
import cleanCSS from "gulp-clean-css";
import rename from "gulp-rename";
import dartSass from 'sass'
import gulpSass from 'gulp-sass'

const sass = gulpSass(dartSass)

const paths = {
  styles: {
    src: "./src/css/pureFullPage.scss",
    dest: "./dist",
    npmDest: "./lib", // Used to build npm lib files
  },
  scripts: {
    src: ["./src/js/utils.js", "./src/js/pureFullPage.js"],
    dest: "./dist",
    npmDest: "./lib",
  },
};

const transferCSS = () =>
  gulp
  .src(paths.styles.src)
  .pipe(sass().on("error", sass.logError))
  .pipe(cleanCSS({ compatibility: "*" }))
  .pipe(rename("pureFullPage.min.css"))
  .pipe(gulp.dest(paths.styles.dest))
  .pipe(gulp.dest(paths.styles.npmDest));

const transferJS = () =>
  gulp
  .src(paths.scripts.src)
  .pipe(concat("pureFullPage.min.js"))
  .pipe(babel())
  .pipe(uglify())
  .pipe(gulp.dest(paths.scripts.dest))
  .pipe(gulp.dest(paths.scripts.npmDest));

export const watch = () => {
  gulp.watch(paths.styles.src, transferCSS);
  gulp.watch(paths.scripts.src, transferJS);
};

// build files
export const build = gulp.parallel(transferCSS, transferJS);
