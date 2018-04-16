let gulp = require('gulp'),
    clean = require('gulp-clean'),
    include = require('gulp-include');

gulp.task('clean', function () {
    return gulp.src('dist', { read: false })
        .pipe(clean());
});

gulp.task('build', ['clean'], function () {
    gulp.src('index.js')
        .pipe(include())
        .on('error', console.log)
        .pipe(gulp.dest('dist'));

    gulp.src('partials/*.html')
        .pipe(gulp.dest('dist/partials'));

    gulp.src('config/*.json')
        .pipe(gulp.dest('dist/config'));

    gulp.src('module.json')
        .pipe(gulp.dest('dist'));
});

gulp.task('clean-deploy', function () {
    return gulp.src('../zEdit Alpha v0.3.0 - Portable/modules/patchus-maximus', { read: false })
        .pipe(clean({force: true}));
});

gulp.task('deploy', ['clean-deploy'], function() {
    gulp.src('dist/**')
        .pipe(gulp.dest('../zEdit Alpha v0.3.0 - Portable/modules/patchus-maximus'));
});

gulp.task('default', ['build']);