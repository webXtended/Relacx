var gulp = require("gulp");
var babel = require('gulp-babel');
var babelHelpers = require('gulp-babel-external-helpers');
var uglify = require('gulp-uglify');
var pump = require('pump');
var rename = require("gulp-rename");

gulp.task("default",["compress", "copyToDocs"]);

gulp.task("babel", function(){
    return gulp.src("src/*.jsx").
    pipe(babel({
        presets: ['react', 'es2015'],
        plugins: ["external-helpers"]
    }))
    .pipe(babelHelpers('helpers.js'))
    .pipe(gulp.dest("dist/"));
});

gulp.task('compress', ["babel"], function (cb) {
    pump([
            gulp.src(['!dist/*.min.js', 'dist/*.js']),
            uglify(),
            rename({ suffix: '.min' }),
            gulp.dest('dist')
        ],
        function(){
            if(cb){
                cb()
            }
        }
    );
});


gulp.task("copyToDocs", function(){
    gulp.src("dist/*.js")
        .pipe(gulp.dest("docs/js/resources"))  ;
});