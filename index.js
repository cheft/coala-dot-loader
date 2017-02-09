var dot = require('dot');
var fs = require('fs');
var loaderUtils = require('loader-utils');

module.exports = function(content) {
  if (this.cacheable) {
    this.cacheable();
  }
  
  var query = loaderUtils.parseQuery(this.query);
  dot.templateSettings.selfcontained = true;
  dot.templateSettings.varname = query.varname || 'data';

  var content = fs.readFileSync(this.resourcePath).toString();
  
  var regexp = /<script>([\w|\W]*?)<\/script>/;
  var matchs = regexp.exec(content);
  if (!matchs || (matchs.length && matchs[1].trim().length === 0)) {
    return "module.exports = " + dot.template(content);
  } else {
    var html = content.replace(regexp, '');
    return matchs[1].replace(/module.exports[\s]*=[\s]*{/, 'module.exports = {\n\ttpl: ' + dot.template(html) + ',');
  }
};
