/**
 * Saber UI
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @file 控件管理器
 * @author zfkun(zfkun@msn.com)
 */

define(function () {

    /**
     * 控件管理器
     * 注册/创建 新控件、已注册控件实例 查询/管理
     * 
     * @mixin
     * @module saber-ui/control
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
     * 注册控件类
     * 通过类的`prototype.type`识别控件类型信息
     * 
     * @public
     * @param {Function} component 控件类
     */
    exports.register = function ( component ) {
        if ( 'function' === typeof component ) {
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





    /**
     * 控件实例存储器
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
    exports.add = function( control ) {
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
    exports.remove = function( control ) {
        delete controls[ control.id ];
    };

    /**
     * 通过id获取控件实例
     * 
     * @public
     * @param {string} id 控件id
     * @return {Control} 根据id获取的控件实例
     */
    exports.get = function ( id ) {
        return controls[ id ];
    };

    return exports;

});
