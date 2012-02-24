var lessFiles = __dirname + '/less_files'
  , cssFiles = __dirname + '/css_files';

var less = require('less')
  , fs = require('fs');

var onModify = function(filename){
  fs.readFile(lessFiles + '/' + filename, function(err, lessCss){
    if(err)
      throw new Error(err);

    lessCss = lessCss.toString();

    less.render(lessCss, function(err, css) {
      var newFilename = cssFiles + '/' + filename.replace(/\.less$/, '.css');
      fs.writeFile(newFilename, css);
    });
  });
}

fs.readdir(lessFiles, function(err, files){
  if(err)
    throw new Error(err);

  files.filter(function(path){
    return path.match(/\.less$/); // Filter not .less files
  }).forEach(function(path){
    console.log('Watching', path);
    fs.watch(lessFiles + '/' + path, function(event, filename){
      if(filename){
        onModify(filename);
      }
    });
  });
});

