var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

<% var preprocessor_task = usePreprocessor == "less"?"less":"sass" %>
var config = {
      commonLib: '<%= srcFolders["lib"] %>',
      jsLib: '<%= srcFolders["js"] %>/lib',
      styleLib: '<%= srcFolders["less"] %>/lib',
      tmpDist: '<%= srcFolder %>/dist',
      dist: '<%= publicFolder %>'
};

var onError = function (err) {
    console.log(err);
};

/**
 * style task
 * */
<% if(usePreprocessor == "less") { %>
gulp.task('less', function () {

  gulp.src('<%= srcFolders[usePreprocessor] %>/**/*.<%= usePreprocessor %>')
    .pipe(plugins.plumber({
      errorHandler: onError
    }))
    .pipe(plugins.less())
    .pipe(plugins.minifyCss({keepSpecialComments: 0}))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(gulp.dest(config.dist + '/css/'));
});
<% } else { %>
gulp.task('sass', function () {

  gulp.src('<%= srcFolders[usePreprocessor] %>/**/*.scss')
    .pipe(plugins.plumber({
      errorHandler: onError
    }))
    .pipe(plugins.rubySass({
      compass: true,
      style: 'compressed',
      check: true
    }))
    .pipe(plugins.minifyCss({keepSpecialComments: 0}))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(gulp.dest(config.dist + '/css/'));
});
<% } %>

gulp.task('js', function () {
  gulp.src([
    <% if(usePreprocessor == "bootstrap") { %>config.commonLib + '/bootstrap/dist/js/bootstrap.js',<% } %>
    <% if(usePreprocessor == "foundation") { %>config.commonLib + '/foundation/js/foundation.js',<% } %>
    '<%= srcFolders["js"] %>/main.js'
  ])
    .pipe(plugins.concat('app.js'))
    .pipe(plugins.uglify({mangle: true}))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(gulp.dest(config.dist + '/js/'));
});

gulp.task('connect', function() {
  plugins.connect.server({
     root: config.dist,
     port: 9001,
  });
});


/**
 * Watcher tasks
 * */
gulp.task('watch', function () {
    gulp.watch('<%= srcFolders[usePreprocessor] %>/**/*.<%= usePreprocessor %>', ['<%= preprocessor_task %>']);
    gulp.watch('<%= srcFolders["js"] %>/**/*.js', ['js']);
});


//gulp.task('build', ['fonts', 'js_desktop', 'Sass']);
gulp.task('default', [ 'js', '<%= preprocessor_task %>', 'connect']);

