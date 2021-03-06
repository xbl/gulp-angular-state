var path = require('path');

module.exports = function (data, filepath, options) {
	var stateArr = [];
	var moduleName = path.basename(filepath, '.js') + 'Module';

	data.replace(/\/\*[/\*{2}][\s\S]*?\}\]\);/ig, function (match, offset, string) {
		var stateObj = {};
		stateObj['moduleName'] = moduleName;
		stateObj['moduleFile'] = filepath;
		var loadFileArr = stateObj['loadFileArr'] = [options.domain + filepath];
		if(!match) {
			console.log('没有匹配到controller注解');
			// return ;
		}
		
		// 匹配Description
		match.replace(/\*{2}([\s\S]*?)@/ig, function (at, description) {
			description = description.replace(/\*/gi, '').trim();
			stateObj['description'] = description;
		});
		
		// 匹配@At
		match.replace(/\@At\(([^*]*?),([^*]*?)\)/ig, function (at, name, url) {
			// 替换引号
			name = name.replace(/[\'\"]*/ig, '').trim();
			url = url.replace(/[\'\"]*/ig, '').trim();
			stateObj['name'] = name;
			stateObj['url'] = url;
		});
		
		// 匹配@Template
		match.replace(/\@Template\(([^*]*?)\)/ig, function (tempalte, str) {
			// 替换引号
			str = str.replace(/[\'\"]*/ig, '').trim();
			var temp = path.format({
				dir: path.dirname(filepath),
				base: str
			});
			temp = path.normalize(temp).replace(/\\/g, '/');
			stateObj['template'] = options.domain + temp;
		});
		
		// 匹配@Style
		match.replace(/\@Style\(([^*]*?)\)/ig, function (tempalte, str) {
			// 替换引号
			str = str.replace(/[\'\"]*/ig, '').trim();
			var temp = path.format({
				dir: path.dirname(filepath),
				base: str
			});
			temp = path.normalize(temp).replace(/\\/g, '/');
			stateObj['style'] = temp;
			loadFileArr.push(options.domain + temp);
		});
		
		// 匹配@Custom
		match.replace(/\@Custom\(\{([\s\S]*?)\}\)/ig, function (tempalte, str) {
			// 去掉*号、换行、tab和两个以上空格
			str = str.replace(/[\*\n]/g, '').replace(/(\s{2,})/g, ' ').trim();
			stateObj['custom'] = str;
		});
		
		// 匹配ctrlName
		match.replace(/\.controller\(([^*?]*?),/ig, function (ctrl, ctrlName) {
			// 替换引号
			ctrlName = ctrlName.replace(/[\'\"]*/ig, '').trim();
			stateObj['ctrlName'] = ctrlName;
		});
		
		stateArr.push(stateObj);
	});
	
	return stateArr;
};