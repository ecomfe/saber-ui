/**
 * Saber UI
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file 实例管理器
 * @author zfkun(zfkun@msn.com)
 */

define(function () {

    /**
     * 实例管理器
     * 所有已注册控件实例的查询、管理
     * 
     * @mixin
     * @module saber-ui/control
     * @type {Object}
     */
    var exports = {};

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
