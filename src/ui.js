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
     * GUID生成基数
     * 
     * @inner
     * @type {number}
     */
    var counter = 0x861005;

    /**
     * 生成全局唯一id
     * 
     * @public
     * @param {string=} prefix 前缀
     * @return {string} 新唯一id字符串
     */
    ui.getGUID = function ( prefix ) {
        prefix = prefix || 'sui';
        return prefix + counter++;
    };



    /**
     * 控件库配置数据
     * 
     * @inner
     * @type {Object}
     */
    var config = {
        // 基于已有的DOM结构创建控件时，
        // ui控件的html attribute前缀
        uiPrefix: 'data-ui',

        // 控件的默认class前缀
        uiClassPrefix: 'ui',

        // 控件的状态class前缀
        stateClassPrefix: 'state'
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
     * 销毁控件
     * 
     * @public
     * @param {Control} control 控件实例
     */
    ui.dispose = function ( control ) {
        // 实例存储容器更新
        if ( controls[ control.id ] ) {
            delete controls[ control.id ];
        }

        control.dispose();
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

        // TODO
    };


    return ui;

});
