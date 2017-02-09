var dot = require('dot');
var fs = require('fs');
var path = require('path');
var loaderUtils = require('loader-utils');

function unique(array) {
  var seen = new Set;
  return array.filter(function(item) {
    if (!seen.has(item.path)) {
      seen.add(item.path);
      return true;
    }
  });
}

function replaceAll(find, replace, str) {
  var find = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  return str.replace(new RegExp(find, 'g'), replace);
}

function parseImageUrl(context, content) {
  // 匹配 html 和 css 中所有图片路径，包括 <img src=""> data-xxx="" background: url()等
  var re = /(\"|\'){1}([^("|')]*\.(png|jpg|gif)\??.*?)(\"|\'){1}/g;
  var resources = [];
  while (arr = re.exec(content)) {
    var url = arr[2];
    if (url.substr(0, 4) != 'http') {
      var fullPath = path.join(context, url).replace(/\\/g, '\\\\');

      try {
        fs.statSync(fullPath);
        resources.push({
          path: url,
          Path: fullPath
        });
      } catch (err) {
        throw new Error('[' + fullPath + ']: it does not exist.');
      }
    }
  }

  return resources;
}

module.exports = function(content) {
  if (this.cacheable) {
    this.cacheable();
  }

  var query = loaderUtils.parseQuery(this.query);
  dot.templateSettings.selfcontained = true;
  dot.templateSettings.varname = query.varname || 'data';

  var regexp = /<script>([\w|\W]*?)<\/script>/;
  var matches = regexp.exec(content);
  var html = content.replace(regexp, '');

  // 解析 script 标签以外的内容中的所有图片地址
  var resources = unique(parseImageUrl(this.context, html));
  var complied = dot.template(html) + '';

  // 将图片已资源形式引入
  for (var i = resources.length - 1; i >= 0; i--) {
    complied = replaceAll(resources[i].path, '\'+require(\"' + resources[i].Path + '\")+\'', complied);
  }

  if (!matches || (matches.length && matches[1].trim().length === 0)) {
    return 'module.exports = ' + complied;
  } else {
    return matches[1].replace(/module.exports\s*=\s*{/, 'module.exports = {\n\ttpl: ' + complied + ',');
  }

};
