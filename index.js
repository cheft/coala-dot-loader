var dot = require('dot');
var fs = require('fs');

module.exports = function(content) {
  if (this.cacheable) {
    this.cacheable();
  }
  
  dot.templateSettings.selfcontained = true;
  dot.templateSettings.varname = 'data'

  var content = fs.readFileSync(this.resourcePath).toString();
  
  var regexp = /<script>([\w|\W]*?)<\/script>/;
  var matchs = regexp.exec(content);
  if (!matchs) {
    return "module.exports = " + dot.template(content);
  } else if (matchs[1].trim() == '') {
    var html = content.replace(regexp, '');
    return 'module.exports = {tpl: ' + dot.template(html) + '};';
  } else {
    var html = content.replace(regexp, '');
    return matchs[1].replace('<script>', '').replace('module.exports = {', 'module.exports = {\n\ttpl: ' + dot.template(html) + ',').replace('</script>', '');
  }
};
