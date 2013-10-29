/**
 * Saber UI
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file UI主类
 * @author zfkun(zfkun@msn.com)
 */

define(function ( require ) {

    var lang = require( 'saber-lang' );

    /**
     * 主类
     * 提供UI全局配置、解析、构建等
     * 
     * @exports ui
     * @requires lang
     */
    var ui = {};



    /**
     * 控件库配置数据
     * 
     * @inner
     * @type {Object}
     */
    var config = {
        // 控件主元素的id前缀
        // 控件`render`阶段自动生成时用到
        // see `Control.render` 中的 `helper.getId( this )`
        idAttrPrefix: 'ctrl',

        // 基于已有的DOM结构创建控件时，
        // ui控件的html attribute前缀
        uiPrefix: 'data-ui',

        // 控件的实例标识属性
        instanceAttr: 'data-ctrl-id',

        // 控件的默认class前缀
        uiClassPrefix: 'ui',

        // 控件的皮肤class前缀
        skinClassPrefix: 'skin',

        // 控件的状态class前缀
        stateClassPrefix: 'state',

        // 所有控件的公共class名(不包含前缀)
        // 为了定义有限全局的normalize使用
        uiClassControl: 'ctrl'
    };

    /**
     * 配置控件库全局配置
     * 
     * @public
     * @param {Object} info 控件库配置信息对象
     */
    ui.config = function ( info ) {
        lang.extend( config, info );
    };

    /**
     * 获取配置项
     * 
     * @public
     * @param {string} name 配置项名称
     * @return {string} 配置项值
     */
    ui.getConfig = function ( name ) {
        return config[ name ];
    };



    /**
     * 已注册控件类的容器
     * 
     * @inner
     * @type {Object}
     */
    var components = {};

    /**
     * 注册控件类。
     * 通过类的prototype.type识别控件类型信息。
     * 
     * @public
     * @param {Function} component 控件类
     */
    ui.register = function ( component ) {
        if ( typeof component === 'function' ) {
            var type = component.prototype.type;
            if ( type in components ) {
                throw new Error( type + ' is exists!' );
            }

            components[ type ] = component;
        }
    };

    /**
     * 创建控件实例
     * 
     * @public
     * @param {string} type 控件类型
     * @param {Object} options 控件初始化参数
     * @return {?Control} 新创建的控件实例, 失败返回null
     */
    ui.create = function ( type, options ) {
        var Constructor = components[type];
        if ( Constructor ) {
            delete options.type;
            return new Constructor( options );
        }

        return null;
    };




    /**
     * 已存储控件实例的容器
     * 以实例id为键值存储映射关系
     * 
     * @inner
     * @type {Object}
     */
    var controls = {};


    /**
     * 存储控件实例
     * 
     * @public
     * @param {Control} control 待加控件实例
     */
    ui.add = function( control ) {
        var exists = controls[ control.id ];

        // 根据传入实例的id检索当前存储:
        // 若 不存在，直接加入存储
        // 若 存在, 但不是同一实例，则替换更新
        if ( !exists || exists !== control ) {
            // 存储(或更新)实例
            controls[ control.id ] = control;
        }
    };

    /**
     * 移除控件实例
     * 
     * @public
     * @param {Control} control 待移除控件实例
     */
    ui.remove = function( control ) {
        delete controls[ control.id ];
    };

    /**
     * 通过id获取控件实例。 
     *
     * @public
     * @param {string} id 控件id
     * @return {Control} 根据id获取的控件实例
     */
    ui.get = function ( id ) {
        return controls[ id ];
    };



    /**
     * 从容器DOM元素批量初始化内部的控件渲染
     * 
     * @public
     * @param {HTMLElement=} wrap 容器DOM元素，默认document.body
     * @param {Object=} options 初始化配置参数
     * @param {Object=} options.properties 属性集合，通过id映射
     * @param {Object=} options.valueReplacer 属性值替换函数
     * @return {Array.<Control>} 初始化的控件对象集合
     */
    ui.init = function ( wrap, options ) {
        wrap = wrap || document.body;
        options = options || {};

        var valueReplacer = options.valueReplacer || function (value) {
            return value;
        };

        var uiPrefix = ui.getConfig('uiPrefix');
        var uiPrefixLen = uiPrefix.length;
        var properties = options.properties || {};
        var controls = [];

        // 获取 `wrap` 子元素节点集合
        // 调用 `parseNode` 逐一进行解析
        [].filter.call(
            wrap.getElementsByTagName( '*' ),
            checkNode
        ).forEach( parseNode );


        /**
         * 将字符串数组join成驼峰形式
         * 
         * @inner
         * @param {Array.<string>} source 源字符串数组
         * @return {string}
         */
        function joinCamelCase( source ) {
            function replacer( c ) {
                return c.toUpperCase();
            }

            for ( var i = 1, len = source.length; i < len; i++ ) {
                source[ i ] = source[i].replace( /^[a-z]/, replacer );
            }

            return source.join('');
        }

        /**
         * 不覆盖目标对象成员的extend
         * 
         * @inner
         * @param {Object} target 目标对象
         * @param {Object} source 源对象
         */
        function noOverrideExtend( target, source ) {
            for ( var key in source ) {
                if ( !(key in target) ) {
                    target[ key ] = source[ key ];
                }
            }
        }

        /**
         * 将标签解析的值附加到option对象上
         * 
         * @inner
         * @param {Object} options option对象
         * @param {Array.<string>} terms 经过切分的标签名解析结果
         * @param {string} value 属性值
         */
        function extendToOption( options, terms, value ) {
            if ( 0 === terms.length ) {
                noOverrideExtend(
                    options,
                    ui.parseAttribute( value, valueReplacer )
                );
            }
            else {
                options[ joinCamelCase( terms ) ] = valueReplacer( value );
            }
        }


        /**
         * 判断是否为 HTMLElement 元素节点
         * 
         * @inner
         * @param {Object} node 待检测节点对象
         * @return {boolean}
         */
        function checkNode( node ) {
            return 1 === node.nodeType;
        }

        /**
         * HTMLElement节点解析函数
         * 
         * @inner
         * @param {Element} node 待解析节点
         */
        function parseNode( node ) {
            // 有时候，一个控件会自己把`main.innerHTML`生成子控件，比如`Panel`，
            // 但这边有缓存这些子元素，可能又会再生成一次，所以要去掉
            if ( node.getAttribute( config.instanceAttr ) ) {
                return;
            }

            var controlOptions = {};

            // 分析 `node` 的所有属性节点
            // 指定 `parseAttribute` 调用时的 `this` 为 `controlOptions`
            // 方便内部修改
            [].forEach.call(
                node.attributes,
                parseAttribute,
                controlOptions
            );

            // 根据选项创建控件
            var type = controlOptions.type;
            if ( type ) {
                // 从用户传入的properties中merge控件初始化属性选项
                var controlId = controlOptions.id;
                var customOptions = controlId
                    ? properties[ controlId ]
                    : {};
                for ( var key in customOptions ) {
                    controlOptions[ key ] = valueReplacer(
                        customOptions[ key ]
                    );
                }

                controlOptions.main = node;

                // 创建控件
                var control = ui.create( type, controlOptions );
                if ( control ) {
                    controls.push( control );
                    if ( options.parent ) {
                        options.parent.addChild( control );
                    }
                    control.render();
                }
            }
        }

        /**
         * HTMLElement元素节点属性解析函数
         * 
         * @inner
         * @param {Object} attribute 待解析元素节点属性对象
         */
        function parseAttribute( attribute ) {
            var name = attribute.name;
            var value = attribute.value;

            if ( 0 === name.indexOf( uiPrefix ) ) {
                var terms = name.length == uiPrefixLen
                    ? []
                    : name.slice( uiPrefixLen + 1 ).split( '-' );
                extendToOption( this, terms, value );
            }
        }

        return controls;
    };

    /**
     * 将"name:value[;name:value]"的属性值解析成Object
     * 
     * @param {string} source 属性值源字符串
     * @param {function=} 替换值的处理函数
     * @return {Object}
     */
    ui.parseAttribute = function ( source, valueReplacer ) {
        if ( !source ) {
            return {};
        }

        // 为了让key和value中有`:`或`;`这类分隔符时能正常工作，不采用正则
        // 
        // 分析的原则是：
        // 
        // 1. 找到第1个冒号，取前面部分为key
        // 2. 找下个冒号前的最后一个分号，取前面部分为value
        // 3. 如果字符串没结束，回到第1步
        var result = {}; // 保存结果
        var lastStop = 0; // 上次找完时停下的位置，分隔字符串用
        var cursor = 0; // 当前检索到的字符

        // 为了保证只用一个`source`串就搞定，下面会涉及到很多的游标，
        // 简单的方法是每次截完一段后把`soruce`截过的部分去掉，
        // 不过这么做会频繁分配字符串对象，所以优化了一下保证`source`不变
        while ( cursor < source.length ) {
            // 找key，找到第1个冒号
            while ( cursor < source.length
                && source.charAt( cursor ) !== ':'
            ) {
                cursor++;
            }

            // 如果找到尾也没找到冒号，那就是最后有一段非键值对的字符串，丢掉
            if ( cursor >= source.length ) {
                break;
            }

            // 把key截出来
            var key = source.slice( lastStop, cursor ).trim();
            // 移到冒号后面一个字符
            cursor++;
            // 下次切分就从这个字符开始了
            lastStop = cursor;
            // 找value，要找最后一个分号，这里就需要前溯了，先找到第1个分号
            while ( cursor < source.length
                && source.charAt( cursor ) !== ';'
            ) {
                cursor++;
            }

            // 然后做前溯一直到下一个冒号
            var lookAheadIndex = cursor + 1;
            while ( lookAheadIndex < source.length ) {
                var ch = source.charAt( lookAheadIndex );

                // 如果在中途还发现有分号，把游标移过来
                if ( ch === ';' ) {
                    cursor = lookAheadIndex;
                }

                // 如果发现了冒号，则上次的游标就是最后一个分号了
                if ( ch === ':' ) {
                    break;
                }

                lookAheadIndex++;
            }

            // 把value截出来，这里没有和key一样判断是否已经跑到尾，
            // 是因为我们允许最后一个键值对没有分号结束，
            // 但是会遇上`key:`这样的串，即只有键没有值，
            // 这时我们就认为值是个空字符串了
            var value = source.slice( lastStop, cursor ).trim();
            // 加入到结果中
            result[ key ] = valueReplacer ? valueReplacer( value ) : value;
            // 再往前进一格，开始下一次查找
            cursor++;
            lastStop = cursor;
        }

        return result;
    };


    return ui;

});
