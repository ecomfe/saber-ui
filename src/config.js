/**
 * Saber UI
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file 配置器
 * @author zfkun(zfkun@msn.com)
 */

define(function ( require ) {

    var extend = require( 'saber-lang/extend' );

    /**
     * 配置器
     * UI全局配置管理及查询
     * 
     * @member ui
     * @exports module:ui~config
     * @type {Object}
     */
    var exports = {};

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
    exports.config = function ( info ) {
        extend( config, info );
    };

    /**
     * 获取配置项
     * 
     * @public
     * @param {string} name 配置项名称
     * @return {string} 配置项值
     */
    exports.getConfig = function ( name ) {
        return config[ name ];
    };

    return exports;

});
