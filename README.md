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
   var gulpState = require('./gulp-angular-state');
   var watch = require('gulp-watch');

   gulp.task('angularState', function () {
   	gulp.src('./module/**/*.js')
   		.pipe(gulpState('./env/Aconfig.js'))
   		.pipe(gulp.dest('./'));
   });

   gulp.task('default', ['angularState']);
   ```

3. 编写路由模板文件(`./env/Aconfig.js`)

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
   		 /** endInject */
   	}]);
   })();
   ```

4. 添加controller

   ```javascript
   (function () {
   	'use strict';
   	var app = angular.module('MainCtrlModule', []);
   	/**
   	 * 一级页面主controller
   	 * @At('main', '/main')
   	 * @Template("./index.html")
   	 * @Style('./index.css')
   	 */
   	app.controller('TemplateHeaderFooterCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
   		console.log('一级页面主controller');
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
   				controller: 'TemplateHeaderFooterCtrl',
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

## API

**@At(stateName, url)**

stateName: 参考ui-router state name

url: 参考ui-router url

**@Template(templatePath)**

模板的路径

**@Style(cssPath)**

样式文件路径

**state对象**

```json
{
  name: '',
  url: '',
  template: '',
  ctrlName: '',
  loadFileArr: ['ctrl js file path', 'css file path']
}
```







