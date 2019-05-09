// 'use strict';

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");
const terser = require("gulp-terser");
const babel = require("gulp-babel");
const webpack = require("webpack-stream");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
const purgecss = require("gulp-purgecss");

sass.compiler = require("node-sass");

// images
gulp.task("images", function() {
  return gulp
    .src("src/images/**/*")
    .pipe(
      imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })
    )
    .pipe(gulp.dest("dist/images/"));
});

// assets
gulp.task("assets", function() {
  return gulp.src("src/assets/**/*").pipe(gulp.dest("dist/assets/"));
});

// scripts
gulp.task("scripts", function() {
  return gulp
    .src(["!src/scripts/bundle.js", "src/scripts/**/*.js"])
    .pipe(
      plumber({
        errorHandler: function(error) {
          console.log(error.message);
          this.emit("end");
        }
      })
    )
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(webpack())
    .pipe(concat("bundle.js"))
    .pipe(terser())
    .pipe(gulp.dest("dist/scripts"));
});

// styles
gulp.task("styles", function() {
  return gulp
    .src("src/styles/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(rename("style.css"))
    .pipe(
      autoprefixer({
        browsers: ["last 10 versions"],
        cascade: false
      })
    )
    .pipe(
      purgecss({
        content: ["src/**/*.html"]
      })
    )
    .pipe(cleancss({ level: "2", minify: "true" }))
    .pipe(gulp.dest("src/styles"))
    .pipe(gulp.dest("dist/styles"));
});

// html
gulp.task("html", function() {
  return gulp.src("src/**/*.html").pipe(gulp.dest("dist"));
});

// default
gulp.task(
  "default",
  gulp.series("images", "assets", "scripts", "styles", "html")
);

// watch
gulp.task("watch", function() {
  gulp.watch("src/images/**/*", gulp.series("images"));
  gulp.watch("src/assets/**/*", gulp.series("assets"));
  gulp.watch("src/scripts/**/*.js", gulp.series("scripts"));
  gulp.watch("src/styles/**/*.scss", gulp.series("styles"));
  gulp.watch("src/**/*.html", gulp.series("html"));
});
