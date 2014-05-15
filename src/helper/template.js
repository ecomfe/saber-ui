/**
 * Saber UI
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 控件辅助类的模板相关方法
 * @author zfkun(zfkun@msn.com)
 */

define( function ( require ) {

    var ui = require( '../main' );

    /**
     * @override Helper
     */
    var exports = {};

    /**
     * 设置模板引擎实例
     *
     * @param {etpl.Engine} engine 模板引擎实例
     */
    exports.setTemplateEngine = function ( engine ) {
        this.templateEngine = engine;
    };

    return exports;

});
