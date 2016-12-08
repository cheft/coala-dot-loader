# [dot](https://github.com/olado/doT) loader for [webpack](http://webpack.github.io/)

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

``` javascript
var template = require("coala-dot!./file.html");
// => returns file.html compiled as template function
```

### Recommended config

``` javascript
module.exports = {
  module: {
    loaders: [
      { test: /\.html$/, loader: "coala-dot-loader" }
    ]
  }
};
```
