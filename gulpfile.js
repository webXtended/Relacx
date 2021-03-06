var gulp = require("gulp");
var babel = require('gulp-babel');
var babelHelpers = require('gulp-babel-external-helpers');
var uglify = require('gulp-uglify');
var pump = require('pump');
var rename = require("gulp-rename");
var handlebars = require('gulp-compile-handlebars');
var concat = require('gulp-concat');

gulp.task("default",["compress", "copyToDocs"]);

gulp.task("babel", function(){
    return gulp.src("src/relacx.jsx")
    .pipe(babel({
        presets: ['react', ['es2015',{ "modules": false }]]
    }))
    .pipe(gulp.dest("dist/"));
});

gulp.task('compress', ["babel", "concat"], function (cb) {
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


gulp.task('concat',["babel"], function() {
    return gulp.src(['src/relacx_npm.js', 'dist/relacx.js'])
        .pipe(concat('relacx_npm.js',{newLine:"\n"}))
        .pipe(gulp.dest('dist'));
});


gulp.task("makeHTML", function(){
    return gulp.src('docs/hbs/pages/*.hbs')
        .pipe(handlebars({}, {
            ignorePartials: true,
            batch: ['docs/hbs/partials']
        }))
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(gulp.dest('docs'));
});


gulp.task("copyToDocs", ["babel", "compress"],function(){
    gulp.src("dist/*.js")
        .pipe(gulp.dest("docs/js/resources"))  ;
});


gulp.task("babel_test", function(){
    return gulp.src("test/jsx/*.jsx").
    pipe(babel({
        presets: ['react', 'es2015'],
        plugins: ["external-helpers"]
    }))
    .pipe(gulp.dest("test/js"));
});

gulp.task("babel_withHelpers", function(){
    return gulp.src("src/*.jsx")
        .pipe(babel({
            presets: ['react', 'es2015'],
            plugins: ["external-helpers"]
        }))
        .pipe(babelHelpers('helpers.js'))
        .pipe(gulp.dest("dist/"));
});
