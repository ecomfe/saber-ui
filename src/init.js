/**
 * Saber UI
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file 构建器
 * @author zfkun(zfkun@msn.com)
 */

define(function ( require ) {

    var getConfig = require( './config' ).getConfig;
    var createComponent = require( './component' ).create;
    var parseAttribute = require( './parse' ).parseAttribute;

    /**
     * 构建器
     * 
     * @member ui
     * @exports module:ui~init
     * @type {Object}
     */
    var exports = {};

    /**
     * 从容器DOM元素批量初始化内部的控件渲染
     * 
     * @public
     * @param {HTMLElement=} wrap 容器DOM元素，默认document.body
     * @param {Object=} options 初始化配置参数
     * @param {Object=} options.properties 属性集合，通过id映射
     * @param {Object=} options.valueReplacer 属性值替换函数
     * @param {Function=} options.success 渲染完成回调函数
     * @return {Array.<Control>} 初始化的控件对象集合
     */
    exports.init = function ( wrap, options ) {
        wrap = wrap || document.body;
        options = options || {};

        var valueReplacer = options.valueReplacer || function (value) {
            return value;
        };

        var instanceAttr = getConfig( 'instanceAttr' );
        var uiPrefix = getConfig( 'uiPrefix' );
        var uiPrefixLen = uiPrefix.length;
        var properties = options.properties || {};
        var controls = [];

        // 获取 `wrap` 子元素节点集合
        // 调用 `parseNode` 逐一进行解析
        [].filter.call(
            wrap.getElementsByTagName( '*' ),
            checkNode
        ).forEach( parseNode );

        // 初始化构建通知
        if ( 'function' === typeof options.success ) {
            options.success( controls );
        }


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
                    parseAttribute( value, valueReplacer )
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
            if ( node.getAttribute( instanceAttr ) ) {
                return;
            }

            var controlOptions = {};

            // 分析 `node` 的所有属性节点
            // 指定 `parseAttr` 调用时的 `this` 为 `controlOptions` 方便内部修改
            [].forEach.call(
                node.attributes,
                parseAttr,
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
                var control = createComponent( type, controlOptions );
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
        function parseAttr( attribute ) {
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

    return exports;

});
