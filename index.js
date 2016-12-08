var dot = require('dot');
var fs = require('fs');

module.exports = function(content) {
  if (this.cacheable) {
    this.cacheable();
  }
  
  dot.templateSettings.selfcontained = true;

  var content = fs.readFileSync(this.resourcePath).toString();

  if (content.indexOf('<script>') !== -1) {
  	var arr = content.split('<script>');
  	var html = arr[0];
  	var js = arr[1];
  	js = js.replace('</script>', '').replace('module.exports = {', 'module.exports = {\ntpl: ' + dot.template(html) + ',');
  	return js;
  } else {
  	return "module.exports = " + dot.template(content);
  }
};
