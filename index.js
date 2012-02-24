var lessFiles = __dirname + '/less_files'
  , cssFiles = __dirname + '/css_files';

var less = require('less')
  , fs = require('fs');

var onModify = function(filename){
  var lessCss = fs.readFileSync(lessFiles + '/' + filename).toString();
  less.render(lessCss, function(err, css) {
    var newFilename = cssFiles + '/' + filename.replace(/\.less$/, '.css');
    fs.writeFileSync(newFilename, css);
  });
}

var watchList = fs.readdirSync(lessFiles); // Array with `less_files` dir contents

watchList.filter(function(path){
  return path.match(/\.less$/); // Filter not .less files
}).forEach(function(path){
  console.log('Watching', path);
  fs.watch(lessFiles + '/' + path, function(event, filename){
    if(filename){
      onModify(filename);
    }
  });
});
