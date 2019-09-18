### 1.目录结构

	1. android/  					// Android的原生开发目录，可以用Android Studio打开进行原生开发。
	2. ios/								// Ios的原生开发目录，可以用Xcode打开进行原生开发。
	3. node_modules/			// 存放所有的项目依赖库，配置package.json之后执行“npm install”后自动创建的文件夹。
	4. .babelrc						// Babel的配置文件,Babel是一个广泛使用的转码器，可以将ES6代码转为ES5代码，从而在现有环境执行。babelrc用来设置转码规则和插件。
	5. .buckconfig				// buck的配置文件，buck是Facebook推出的一款高效率的APP项目构建工具
	6. .flowconfig				// Flow是Facebook旗下一个为JavaScript进行静态类型检测的检测工具。它可以在JavaScript的项目中用来捕获常见的bugs，比如隐式类型转换，空引用等等。
	7. .gitattributes			// git属性文件设定一些项目特殊的属性。比如要比较Word文档的不同；对strings程序进行注册；合并冲突的时候不想合并某些文件等等。
	8. gitignore 					// 用来配置git需要忽略的文件
	9. app.json						// 配置了name和displayName，不过没有发现在哪里使用到了。
	10. index.js					// 项目入口文件，可以在android的MainApplication中的ReactNativeHost中重写getJSMainModuleName()方法更改; 在Ios的AppDelegate.m文件的didFinishLaunchingWithOptions方法中通过jsBundleURLForBundleRoot可以更改入口文件。
	11. package.json			//  package.json定义了项目所需要的各种模块，以及项目的配置信息（比如名称、版本、许可证等元数据）。npm install命令根据这个配置文件，自动下载所需的模块，也就是配置项目所需的运行和开发环境。
	12. yarn.lock					// Yarn 是 一个由 Facebook 创建的新 JavaScript 包管理器；每次添加依赖或者更新包版本，yarn都会把相关版本信息写入yarn.lock文件。这样可以解决同一个项目在不同机器上环境不一致的问题。
	13. babel.config.js		// babel的配置文件
	14. metro.config.js		// metro的配置文件
	15. .eslintrc.js			// eslint代码检测工具配置
	15. app/							// 项目源代码目录

### 2.eslint配置

	1. 安装eslint  npm install eslint -g
	2. 进入项目安装
		"babel-eslint": "^10.0.1",
		"eslint": "^5.15.3",
		"eslint-config-airbnb": "^17.1.0",
		"eslint-config-prettier": "^4.1.0",
		"eslint-plugin-babel": "^5.3.0",
		"eslint-plugin-import": "^2.16.0",
		"eslint-plugin-jsx-a11y": "^6.2.1",
		"eslint-plugin-prettier": "^3.0.1",
		"eslint-plugin-react": "^7.12.4",
	3. eslint --init
	4. 修改.eslintrc.js 配置文件
	module.exports = {
	    // 环境里定义了一组预定义的全局变量
	    "env": {
		"browser": true,
		"commonjs": true,
		"es6": true,
		"jasmine": true
	    },
	    // extends属性表示启用一系列核心规则，若有plugins属性表示同时启用插件的核心规则
	    // "extends": "eslint:recommended",
	    "extends": "airbnb",
	    // 设置解析器
	    "parser": "babel-eslint",
	    // 解析器选项
	    "parserOptions": {
		// 表示一些附加特性的对象，支持JSX
		"ecmaFeatures": {
		    "jsx": true
		},
		// ECMAScript的版本
		"ecmaVersion": 2018,
		"sourceType": "module"
	    },
	    // 全局变量配置
	    "globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly"
	    },
	    // 支持使用第三方插件，在使用插件之前，你必须使用npm安装它
	    "plugins": [
		"react",
		"jsx-a11y",
		"import"
	    ],
	    // 规则配置
	    "rules": {
		"indent": ["off", "tab"],
		"linebreak-style": ["error", "windows"],
		"quotes": ["error", "single"],
		"semi": ["error", "always"],
		"react/jsx-indent-props": ["error", 4],
		"react/no-direct-mutation-state": 2,
		"no-console": 0,
		"no-debugger": 2,
	    }
	};
	5. 配置项rules相关配置参考：0,1,2分别表示：开启检查、警告、错误
		"rules": {
	    "quotes": [2, "single"], //单引号
	    "no-console": 0, //不禁用console
	    "no-debugger": 2, //禁用debugger
	    "no-var": 0, //对var警告
	    "semi": 0, //不强制使用分号
	    "no-irregular-whitespace": 0, //不规则的空白不允许
	    "no-trailing-spaces": 1, //一行结束后面有空格就发出警告
	    "eol-last": 0, //文件以单一的换行符结束
	    "no-unused-vars": [2, {"vars": "all", "args": "after-used"}], //不能有声明后未被使用的变量或参数
	    "no-underscore-dangle": 0, //标识符不能以_开头或结尾
	    "no-alert": 2, //禁止使用alert confirm prompt
	    "no-lone-blocks": 0, //禁止不必要的嵌套块
	    "no-class-assign": 2, //禁止给类赋值
	    "no-cond-assign": 2, //禁止在条件表达式中使用赋值语句
	    "no-const-assign": 2, //禁止修改const声明的变量
	    "no-delete-var": 2, //不能对var声明的变量使用delete操作符
	    "no-dupe-keys": 2, //在创建对象字面量时不允许键重复
	    "no-duplicate-case": 2, //switch中的case标签不能重复
	    "no-dupe-args": 2, //函数参数不能重复
	    "no-empty": 2, //块语句中的内容不能为空
	    "no-func-assign": 2, //禁止重复的函数声明
	    "no-invalid-this": 0, //禁止无效的this，只能用在构造器，类，对象字面量
	    "no-redeclare": 2, //禁止重复声明变量
	    "no-spaced-func": 2, //函数调用时 函数名与()之间不能有空格
	    "no-this-before-super": 0, //在调用super()之前不能使用this或super
	    "no-undef": 2, //不能有未定义的变量
	    "no-use-before-define": 2, //未定义前不能使用
	    "camelcase": 0, //强制驼峰法命名
	    "jsx-quotes": [2, "prefer-double"], //强制在JSX属性（jsx-quotes）中一致使用双引号
	    "react/display-name": 0, //防止在React组件定义中丢失displayName
	    "react/forbid-prop-types": [2, {"forbid": ["any"]}], //禁止某些propTypes
	    "react/jsx-boolean-value": 2, //在JSX中强制布尔属性符号
	    "react/jsx-closing-bracket-location": 1, //在JSX中验证右括号位置
	    "react/jsx-curly-spacing": [2, {"when": "never", "children": true}], //在JSX属性和表达式中加强或禁止大括号内的空格。
	    "react/jsx-indent-props": [2, 4], //验证JSX中的props缩进
	    "react/jsx-key": 2, //在数组或迭代器中验证JSX具有key属性
	    "react/jsx-max-props-per-line": [1, {"maximum": 1}], // 限制JSX中单行上的props的最大数量
	    "react/jsx-no-bind": 0, //JSX中不允许使用箭头函数和bind
	    "react/jsx-no-duplicate-props": 2, //防止在JSX中重复的props
	    "react/jsx-no-literals": 0, //防止使用未包装的JSX字符串
	    "react/jsx-no-undef": 1, //在JSX中禁止未声明的变量
	    "react/jsx-pascal-case": 0, //为用户定义的JSX组件强制使用PascalCase
	    "react/jsx-sort-props": 2, //强化props按字母排序
	    "react/jsx-uses-react": 1, //防止反应被错误地标记为未使用
	    "react/jsx-uses-vars": 2, //防止在JSX中使用的变量被错误地标记为未使用
	    "react/no-danger": 0, //防止使用危险的JSX属性
	    "react/no-did-mount-set-state": 0, //防止在componentDidMount中使用setState
	    "react/no-did-update-set-state": 1, //防止在componentDidUpdate中使用setState
	    "react/no-direct-mutation-state": 2, //防止this.state的直接变异
	    "react/no-multi-comp": 2, //防止每个文件有多个组件定义
	    "react/no-set-state": 0, //防止使用setState
	    "react/no-unknown-property": 2, //防止使用未知的DOM属性
	    "react/prefer-es6-class": 2, //为React组件强制执行ES5或ES6类
	    "react/prop-types": 0, //防止在React组件定义中丢失props验证
	    "react/react-in-jsx-scope": 2, //使用JSX时防止丢失React
	    "react/self-closing-comp": 0, //防止没有children的组件的额外结束标签
	    "react/sort-comp": 2, //强制组件方法顺序
	    "no-extra-boolean-cast": 0, //禁止不必要的bool转换
	    "react/no-array-index-key": 0, //防止在数组中遍历中使用数组key做索引
	    "react/no-deprecated": 1, //不使用弃用的方法
	    "react/jsx-equals-spacing": 2, //在JSX属性中强制或禁止等号周围的空格
	    "no-unreachable": 1, //不能有无法执行的代码
	    "comma-dangle": 2, //对象字面量项尾不能有逗号
	    "no-mixed-spaces-and-tabs": 0, //禁止混用tab和空格
	    "prefer-arrow-callback": 0, //比较喜欢箭头回调
	    "arrow-parens": 0, //箭头函数用小括号括起来
	    "arrow-spacing": 0 //=>的前/后括号
	  }

### 3.app/ 源代码目录结构

	1. assets/          // 静态资源目录
	2. assets/images/   // 静态资源目录---图片目录 
	3. pages/           // 项目页面目录
	4. api/             // 项目api接口目录
	5. components/      // 公共组件目录
	6. lib/             // 公共模块方法
	7. model/           // redux model管理配置
	8. router/          // 路由模块控制
	9. dva/             // redux 功能管理
	10. lang/           // 国际化语言管理
	11. model/          // 全局model配置
	12. test/           // 测试代码
	13. index.js        // 项目入口文件配置
	14. models.js       // redux models模块路径文件
