var lessDir = __dirname + '/less_files'
  , cssDir = __dirname + '/css_files';

var less = require('less')
  , LessParser = less.Parser

  , path = require('path')
  , join = path.join

  , fs = require('fs')
  , onModify
  , relations = {}
  , watch;


onModify = function(filename){
  console.log('Changed', filename);
  if(relations[filename])
    filename = relations[filename];
  console.log('Which relate on', filename);
  var path, lessParser, contents;

  path = join(lessDir, filename);
  if(!filename.match(/\.less$/) || !fs.statSync(path).isFile())
    return;

  lessParser = new LessParser({
    paths: [ lessDir ],
    filename: filename
  });

  contents = fs.readFileSync(path).toString();
  lessParser.parse(contents, function(err, tree){
    if(err)
      throw new Error(err);

    var cssFilename = filename.replace(/less$/, 'css');
    fs.writeFileSync(join(cssDir, cssFilename), tree.toCSS());
    // Relations
    tree.rules.forEach(function(rule){
      if(rule.path){
        watch(rule.path);
        relations[rule.path] = filename;
      }
    });
  });

}

watch = function(filename){
  if(relations[filename])
    return;

  var path;
  if(filename.charAt(0) == '/')
    path = filename;
  else
    path = join(lessDir, filename);

  fs.watch(path, function(){
    onModify(filename);
  });
}

fs.readdirSync(lessDir).forEach(onModify);
watch(lessDir);
