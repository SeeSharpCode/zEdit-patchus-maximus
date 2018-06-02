const fs = require('fs'),
      gulp = require('gulp'),
      clean = require('gulp-clean'),
      include = require('gulp-include'),
      rename = require('gulp-rename'),
      zip = require('gulp-zip');

gulp.task('clean', function () {
    return gulp.src('dist', { read: false })
        .pipe(clean());
});

gulp.task('build', ['clean'], function() {
    gulp.src('index.js')
        .pipe(include())
        .on('error', console.log)
        .pipe(gulp.dest('dist'));

    gulp.src('partials/*.html')
        .pipe(gulp.dest('dist/partials'));

    gulp.src('config/*.json')
        .pipe(gulp.dest('dist/config'));

    return gulp.src('module.json')
        .pipe(gulp.dest('dist'));
});

gulp.task('deploy', ['build'], function () {
    gulp.src('dist/**')
        .pipe(gulp.dest('../zEdit_Alpha_v0.4.1 Portable_x64/modules/patchusMaximus'));
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['deploy']);
    gulp.watch('index.js', ['deploy']);
});

gulp.task('release', function() {
    let moduleInfo = JSON.parse(fs.readFileSync('module.json')),
        moduleId = moduleInfo.id,
        moduleVersion = moduleInfo.version,
        zipFileName = `${moduleId}-v${moduleVersion}.zip`;

    console.log(`Packaging ${zipFileName}`);

    gulp.src('dist/**/*', { base: 'dist/'})
        .pipe(rename((path) => path.dirname = `${moduleId}/${path.dirname}`))
        .pipe(zip(zipFileName))
        .pipe(gulp.dest('.'));
});

gulp.task('default', ['build']);