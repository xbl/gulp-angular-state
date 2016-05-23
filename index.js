var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var readJsFile = require('./readJsFile');
var fs = require('fs');
var path = require('path');

// 常量
var PLUGIN_NAME = 'gulp-angular-state';

// 插件级别函数 (处理文件)
function gulpAngularState(injectFile, options) {
	if (!injectFile) {
		throw new PluginError(PLUGIN_NAME, 'Missing injectFile text!');
	}
	// 默认domain
	options = options || { domain: '' };
	
	var str = fs.readFileSync(injectFile, 'utf8'),
		stateTemplate = '',
		beginOffset = 0;
	str.replace(/\/\*+[\s\S]*inject:controller([^*]*?)\*\//, function (match, p1, index) {
		stateTemplate = p1;
		beginOffset = index + match.length;
	});
	
	var endOffset = str.search(/\/\*+\s*endInject\s*\*\//),
		beginStr = str.substring(0, beginOffset),
		endStr = str.substring(endOffset, str.length);
	var injectStr = '';
	
	// 创建一个让每个文件通过的 stream 通道
	return through.obj(function(file, encoding, cb) {
		// 关于file的文档：https://github.com/gulpjs/vinyl
		if (file.isStream()) {
			this.emit('error', new PluginError(PLUGIN_NAME, 'Stream not supported!'));
			return cb();
		}
		// 确保文件进去下一个插件
		// this.push(file);
		var filepath = file.path.replace(file.cwd, '');
		if (file.isBuffer()) {
			var arr = readJsFile(file.contents.toString(), filepath, options);
			if(!arr.length) {
				return cb();
			}
			
			arr.forEach(function(stateObj, i) {
				// 这里有一个bug，不设置file会报错...
				injectStr += gutil.template(stateTemplate, { state: stateObj, file: '' });
			});
			var newFile = new gutil.File({
				base: path.join(__dirname),
				cwd: __dirname,
				path: path.join(__dirname, path.basename(injectFile))
			});
			newFile.contents = new Buffer(beginStr + injectStr + endStr, 'utf-8');
			// 输出新文件
			this.push(newFile);
			cb();
			// 写入自身文件
			// fs.writeFile(injectFile, beginStr + injectStr + endStr, 'utf8', function(err) {
			// 	cb();
			// });
		}
	});
}

// 暴露（export）插件的主函数
module.exports = gulpAngularState;