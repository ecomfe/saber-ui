/**
 * Saber UI
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file 组件管理器
 * @author zfkun(zfkun@msn.com)
 */

define(function () {

    /**
     * 组件管理器
     * 注册新组件或创建已注册组件
     * 
     * @mixin
     * @module saber-ui/component
     * @type {Object}
     */
    var exports = {};

    /**
     * 已注册控件类的容器
     * 
     * @inner
     * @type {Object}
     */
    var components = {};

    /**
     * 注册控件类。
     * 通过类的`prototype`.`type`识别控件类型信息。
     * 
     * @public
     * @param {Function} component 控件类
     */
    exports.register = function ( component ) {
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
    exports.create = function ( type, options ) {
        var Constructor = components[ type ];
        if ( Constructor ) {
            delete options.type;
            return new Constructor( options );
        }

        return null;
    };

    return exports;

});
