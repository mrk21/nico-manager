var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var revDel = require('rev-del');
var named = require('vinyl-named');
var proxy = require('proxy-middleware');
var path = require('path');
var url = require('url');
var minimist = require('minimist');
var nib = require('nib');
var webpack = require('webpack');
var _ = require('lodash');

var args = minimist(process.argv.slice(2));

var to_param = function(){
  return _.chain(arguments)
    .map(function(v){ return _.pairs(v); })
    .flatten()
    .map(function(v){ return v.join('='); })
    .join('&')
    .value()
  ;
};

var rails_root = path.join(__dirname, '../public');

var ts_config = {
  module: 'commonjs',
  noImplicitAny: true
};

var webpack_config = {
  devtool: 'source-map',
  resolve: {
    extensions: ['','.ts','.js']
  },
  module: {
    loaders: [
      {test: /\.ts$/, loader: 'webpack-espower!ts?'+ to_param(ts_config, {sourceMap: true}) +'!ts-jsx'}
    ]
  }
};

var jsx = function(){
  var jsxLoader = require('ts-jsx-loader');
  var through = require('through2');
  
  var context = {
    query: '',
    cacheable: function(){},
    emitError: function(e){ throw e; }
  };
  
  function transform(file, encoding, callback){
    var result = jsxLoader.call(context, file.contents.toString('utf8'));
    var output = new $.util.File({
      cwd: file.cwd,
      base: file.base,
      path: file.path
    });
    output.contents = new Buffer(result);
    this.push(output);
    return callback();
  }
  
  function flush(callback){
    return callback();
  }
  
  return through.obj(transform, flush);
};

gulp.task('default', ['build']);
gulp.task('build', ['js','css','node']);

gulp.task('js', function(){
  return gulp.src('src/index.ts')
    .pipe($.webpack(_.merge(webpack_config, {
      output: {
        filename: 'bundle.js',
      }
    })))
    .pipe(gulp.dest('build/assets/javascripts'))
  ;
});

gulp.task('css', function(){
  return gulp.src('src/index.styl')
    .pipe($.sourcemaps.init())
    .pipe($.stylus({use: nib()}))
    .pipe($.rename('bundle.css'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('build/assets/stylesheets'))
  ;
});

var nodeTask = function(done){
  return gulp.src(['src/**/*.ts', 'test/**/*.ts'], {base: '.'})
    .pipe($.sourcemaps.init())
    .pipe(jsx())
    .pipe($.typescript(_.merge(ts_config, {
      module: 'commonjs',
      sourceRoot: __dirname + '/src'
    }))).js
    .on('error', function(){
      this.emit('end', true);
    })
    .on('end', function(error){
      if (!error && done) {
        setTimeout(done, 100);
      }
    })
    .pipe($.espower())
    .pipe($.insert.prepend("require('source-map-support').install();"))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('build/node'))
  ;
};

gulp.task('node', function(){
  return nodeTask();
});

gulp.task('karma', function(){
  return gulp.src('test/unit/**/*_test.ts')
    .pipe(named())
    .pipe($.webpack(_.merge(webpack_config, {
      plugins: [
        new webpack.NormalModuleReplacementPlugin(/^.*\/init_dom$/, __dirname + '/test/unit/empty'),
        new webpack.NormalModuleReplacementPlugin(/^nock$/, __dirname + '/test/unit/empty'),
        new webpack.NormalModuleReplacementPlugin(/^sinon$/, __dirname + '/test/unit/empty')
      ]
    })))
    .pipe(gulp.dest('build/karma'))
  ;
});

gulp.task('clean', function(done){
  del([
    'build',
    path.join(rails_root, 'index.html'),
    path.join(rails_root, 'assets'),
  ], {force: true}, done);
});

gulp.task('install', ['js','css'], function(done){
  var dest = path.join(rails_root, 'assets');
  var manifest = path.join(dest, 'rev-manifest.json');
  
  gulp.src('build/assets/**/*')
    .pipe($.rev())
    .pipe($.revReplace({manifest: gulp.src(manifest)}))
    .pipe(gulp.dest(dest))
    .pipe($.rev.manifest())
    .pipe(revDel({dest: dest, force: true}))
    .pipe(gulp.dest(dest))
    .on('end', function(){
      gulp.src('src/index.html')
        .pipe($.revReplace({manifest: gulp.src(manifest)}))
        .pipe(gulp.dest(rails_root))
        .on('end', done)
      ;
    });
  ;
});

gulp.task('test', function(){
  var options = {};
  if (args.grep) options.grep = args.grep;
  if (args.watch) {
    gulp.watch('src/**/*.ts', ['test']);
    gulp.watch('test/unit/**/*.ts', ['test']);
  }
  
  return nodeTask(function(){
    gulp.src('build/node/test/unit/**/*_test.js')
      .pipe($.plumber())
      .pipe($.mocha(options))
    ;
  });
});

gulp.task('browser-test', ['karma'], function(){
  var action = 'run';
  if (args.watch) {
    action = 'watch';
    gulp.watch('src/**/*.ts', ['karma']);
    gulp.watch('test/unit/**/*.ts', ['karma']);
  }
  
  gulp.src('build/karma/**/*.js')
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: action
    }))
  ;
});

gulp.task('server', ['js','css'], function(){
  gulp.watch('src/**/*.html');
  gulp.watch('src/**/*.styl', ['css']);
  gulp.watch('src/**/*.ts', ['js']);
  
  gulp.src(['src','build'])
    .pipe($.webserver({
      livereload: true,
      open: true,
      middleware: [
        function(req, res, next){
          console.log(req.method, req.url);
          return next();
        },
        (function(){
          var options = url.parse('http://localhost:3000/api');
          options.route = '/api';
          return proxy(options);
        }())
      ]
    }));
});
