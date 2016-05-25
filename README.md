# gulp-angular-state

> ​	虽然AngularJs 1.x 新的项目已经很少有人选择，但企业中作为稳定选型仍然有着重要地位，在实际的开发中配置路由模板以及样式文件的加载成了开发者的巨大负担，所以这个插件就诞生了！

## Quick start

1. 下载插件

   ```shell
   npm install --save gulp-angular-state
   ```

2. 编写`gulpfile.js`

   ```javascript
   var gulp = require('gulp');
   var statePlugin = require('./gulp-angular-state');
   var watch = require('gulp-watch');

   var SRC = './src';

   /**
    * 初始化controller到路由文件
    */
   gulp.task('init:controller', function () {
   	return gulp.src('./src/module/**/*.controller.js', {base: SRC})
   			.pipe(statePlugin.controller('./env/RouterConfig.js'))
   			.pipe(gulp.dest(SRC));
   });
   /**
    * 初始化service和directive添加到ModuleConfig
    */
   gulp.task('init:module', function() {
   	return gulp.src(['./src/module/**/*.service.js', './src/directive/**/*.directive.js'], {base: SRC})
   			.pipe(statePlugin.module('./env/ModuleConfig.js'))
   			.pipe(gulp.dest(SRC));
   });

   gulp.task('default', ['init:controller', 'init:module']);
   ```

3. 编写路由模板文件(`./env/RouterConfig.js`)

   ```javascript
   (function () {
   	'use strict';
   	var app = angular.module('RouterConfig', ['ui.router', 'oc.lazyLoad']);	

   	app.config(['$stateProvider', function ($stateProvider) {
   		
   		/** inject:controller
   		// <%= state.description %>
   		$stateProvider
   			.state('<%= state.name %>', {
   				url: '<%= state.url %>',
   				templateUrl: '<%= state.template %>',
   				controller: '<%= state.ctrlName %>',
   				resolve: {
   					load: ['$ocLazyLoad', function ($ocLazyLoad) {
   						return $ocLazyLoad.load(['<%= state.loadFileArr.join("','") %>']);
   					}]
   				}
   			});
   		 */
   		 /** endInject */
   	}]);
   })();
   ```

4. 添加controller

   ```javascript
   (function () {
   	'use strict';
   	var app = angular.module('Main.controller', [['Second.service']]);
   	/**
   	 * 一级页面主controller
   	 * @At('main', '/main')
   	 * @Template("./index.html")
   	 * @Style('./index.css')
   	 */
   	app.controller('MainCtrl', ['$scope', '$rootScope', 'sayHiService', function ($scope, $rootScope, sayHiService) {
   		console.log('一级页面主controller');
   		sayHiService();
   	}]);

   	/**
   	 * Login controller
   	 * @At('login', '/login')
   	 * @Template("./login.html")
   	 * @Style("./login.css");
   	 */
   	app.controller('LoginCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) { }]);
   })();
   ```

5. 结果

   ```javascript
   (function () {
   	'use strict';
   	var app = angular.module('Aconfig', ['ui.router', 'oc.lazyLoad']);	

   	app.config(['$stateProvider', function ($stateProvider) {
   		
   		/** inject:controller
   		// <%= state.description %>
   		$stateProvider
   			.state('<%= state.name %>', {
   				url: '<%= state.url %>',
   				templateUrl: '<%= state.template %>',
   				controller: '<%= state.ctrlName %>',
   				resolve: {
   					load: ['$ocLazyLoad', function ($ocLazyLoad) {
   						return $ocLazyLoad.load(['<%= state.loadFileArr.join("','") %>']);
   					}]
   				}
   			});
   		 */
   		// 一级页面主controller
   		$stateProvider
   			.state('main', {
   				url: '/main',
   				templateUrl: '/module/main/index.html',
   				controller: 'MainCtrl',
   				resolve: {
   					load: ['$ocLazyLoad', function ($ocLazyLoad) {
   						return $ocLazyLoad.load(['/module/main/MainCtrl.js','/module/main/index.css']);
   					}]
   				}
   			});
   		 
   		// Login controller
   		$stateProvider
   			.state('login', {
   				url: '/login',
   				templateUrl: '/module/main/login.html',
   				controller: 'LoginCtrl',
   				resolve: {
   					load: ['$ocLazyLoad', function ($ocLazyLoad) {
   						return $ocLazyLoad.load(['/module/main/MainCtrl.js','/module/main/login.css']);
   					}]
   				}
   			});
   		 /** endInject */
   	}]);
   })();
   ```

## Service 和Directive

> Service 还算好，Directive要包含模板，感觉不是很好

1. 编写模块别名文件(`./env/ModuleConfig.js`)

   ```javascript
   (function () {
   	'use strict';
   	var app = angular.module('ModuleConfig', ['oc.lazyLoad']);

   	app.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
   		var modules = [];
   		/**
   		 * inject:service
   		 modules[modules.length] = {name: '<%= module.name %>', files: ['<%= module.path %>']};
   		 */
   		/** endInject */
   		
   		// 模块定义别名
   		$ocLazyLoadProvider.config({
   			modules: modules,
   			debug: false,
   		});
   	}]);
   })();
   ```

2. 新建`Second.service.js`文件

   ```javascript
   (function() {
   	"use strict";
   	var app = angular.module('Second.service', []);
   	// 
   	app.factory('sayHiService', ['$q', function($q) { 
   		return function(scriptSrc) {
   			console.log('Hello service');
   		};
   	}]);
   })();
   ```

   ​

3. 结果

   ```javascript
   (function () {
   	'use strict';
   	var app = angular.module('ModuleConfig', ['oc.lazyLoad']);

   	app.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
   		var modules = [];
   		/**
   		 * inject:service
   		 modules[modules.length] = {name: '<%= module.name %>', files: ['<%= module.path %>']};
   		 */
   		 
   		 modules[modules.length] = {name: 'Second.service', files: ['/module/main/Second.service.js']};
   		 
   		 /** endInject */
   		
   		// 模块定义别名
   		$ocLazyLoadProvider.config({
   			modules: modules,
   			debug: false,
   		});
   	}]);
   })();
   ```

   ​

## API

### statePlugin.controller('路由模板文件')

> 读取就是中的@At、@Template、@Style等信息添加到模板文件；

**@At(stateName, url)**

stateName: 参考ui-router state name

url: 参考ui-router url

**@Template(templatePath)**

模板的路径

**@Style(cssPath)**

样式文件路径

**state对象**

```javascript
{
  name: '',
  url: '',
  template: '',
  ctrlName: '',
  loadFileArr: ['ctrl js file path', 'css file path']
}
```

### statePlugin.module('模块别名模板文件')

> 创建Service和Directive时会自动添加到别名文件中

**module对象**

```javascript
{
  name: '',
  path: ''
}
```

