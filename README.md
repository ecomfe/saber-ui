# saber-ui

[`SaberUI`](https://github.com/ecomfe/saber-ui)的公共部分。`ECOM UI v1.1`规范实现。

提供全局配置、控件注册、实例管理、插件管理、构建解析等功能


## Dependencies

+ [saber-lang](https://github.com/ecomfe/saber-lang)


## Usage

通过[`edp`](https://github.com/ecomfe/edp)导入

	edp import saber-ui


## API

### 全局配置

#### .config([info])

配置全局参数

`info`: 配置信息对象。类型`Object`，参数`可选`，可包含项如下:

+ `idAttrPrefix`: 控件主元素的ID前缀。默认值`ctrl`
+ `uiPrefix`: 静态化构建时控件配置信息所在DOM属性名的前缀。默认值`data-ui`
+ `instanceAttr`: 控件实例的标识属性名。默认值`data-ctrl-id`
+ `uiClassPrefix`: 控件的默认class前缀。默认值`ui`
+ `skinClassPrefix`: 控件皮肤的默认class前缀。默认值`skin`
+ `stateClassPrefix`: 控件状态的默认class前缀。默认值`state`
+ `uiClassControl`: 控件公共class前缀。默认值`ctrl`

例子

```javascript
require('saber-ui').config({ uiPrefix: 'data-myui' });
```

***注: 全局配置的变化影响面较广，若非必需，尽量不要修改全局配置。***

#### .getConfig(name)

获取指定全局配置项

`name`: 配置项名称。类型`String`，取值参考[`.config`](#configinfo)的`info`参数。

注：`name`值有效时返回对应的配置项值，否则返回`undefined`。


### 控件注册

#### .register(component)

注册控件类。根据控件类的`prototype.type`识别控件类型信息。

`component`: 控件类。类型`Function`，即控件类的构造函数。

#### .create(type, [options])

创建控件实例

`type`: 控件类型名。类型`String`。

`options`: 控件初始化参数。类型`Object`，参数`可选`。

注：`type`对应控件若已注册，返回新创建实例，否则返回`null`。


### 实例管理

#### .add(control)

存储控件实例

`control`: 待存储控件实例。类型[`Control`](https://github.com/ecomfe/saber-control)。

注：存储时会根据`control`的`id`检索当前存储，若不存在，直接加入存储，若已存在但不是同一实例，则覆盖存储，其他情况，不做存储。

#### .remove(control)

移除控件实例

`control`: 待移除控件实例。类型[`Control`](https://github.com/ecomfe/saber-control)。

#### .get(id)

通过id获取控件实例

`id`: 欲获取的控件的id。类型`String`。

注：查询到则返回控件实例，否则返回`undefined`


### 插件管理

#### .registerPlugin(plugin)

注册插件类。通过类的`prototype.type`识别插件类型信息。

`plugin`: 插件类。类型`Function`，即插件类的构造函数。

注：若`plugin`已注册，则会抛出形如`plugin {plugin.type} is exists!`的异常

#### .activePlugin(control, pluginName, [options])

激活插件

`control`: 目标控件实例。类型[`Control`](https://github.com/ecomfe/saber-control)。

`pluginName`: 待激活插件名。类型`String`。

`options`: 插件配置项。类型`Object`，参数`可选`。

注：`pluginName`参数必须为已注册插件的名称，且在`control`上未激活过，否则什么都不会发生。

#### .inactivePlugin(control, [pluginName])

禁用插件

`control`: 目标控件实例。类型[`Control`](https://github.com/ecomfe/saber-control)。

`pluginName`: 待禁用插件名。类型`String`或`Array`，参数`可选`。为`String`时仅禁用对应插件，为`Array`时批量禁用对应插件，为空时禁用全部插件。

***注：此API暂时不实现，视后续需要补充***

#### .disposePlugin(control, [pluginName])

销毁插件

`control`: 目标控件实例。类型[`Control`](https://github.com/ecomfe/saber-control)。

`pluginName`: 待销毁插件名。类型`String`或`Array`，参数`可选`。为`String`时仅销毁对应插件，为`Array`时批量销毁对应插件，为空时销毁全部插件。


### DOM解析

#### .parseAttribute(source, [valueReplacer])

将`"name:value[;name:value]"`的属性值解析成`Object`。主要为[`.init`](#initwrap-options)服务。

`source`: 属性值源字符串

`valueReplacer`: 替换值的处理函数。类型`Function`，参数`可选`。


### 自动构建

#### .init(wrap, [options])

从容器DOM元素批量初始化内部的控件渲染，并返回初始化的控件对象集合数组

`wrap`: 容器DOM元素。类型`HTMLElement`，默认值`document.body`。

`options`: 初始化配置参数。类型`Object`，参数`可选`，可包含项如下:

+ `properties`: 自定义属性集合，类型`Object`
+ `valueReplacer`: 属性值替换函数，类型`Function`
+ `success`: 渲染完成回调函数，类型`Function`

注：若`wrap`内为空或不存在有效控件结构，则返回空数组`[]`

例子

```html
<div id="app">
	<button data-ui="type:Button">button</button>
	<div data-ui="type:Tab">
		<ul data-role="navigator">
			<li>Tab1</li>
			<li>Tab2</li>
			<li>Tab3</li>
		</ul>
	</div>
</div>
```
```javascript
require( 'saber-ui' ).init( document.getElementById( 'app' ) );
```

===

[![Saber](https://f.cloud.github.com/assets/157338/1485433/aeb5c72a-4714-11e3-87ae-7ef8ae66e605.png)](http://ecomfe.github.io/saber/)