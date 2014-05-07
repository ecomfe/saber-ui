/**
 * Saber UI
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @file 控件辅助类的DOM相关方法
 * @author zfkun(zfkun@msn.com)
 */

define( function ( require ) {

    var ui = require( '../main' );

    /**
     * @override Helper
     */
    var exports = {};

     /**
     * 销毁控件
     *
     * @public
     */
    exports.dispose = function () {
        var control = this.control;

        /**
         * @event Control#beforedispose
         * @param {Object} ev 事件参数对象
         * @param {string} ev.type 事件类型
         * @param {Control} ev.target 触发事件的控件对象
         */
        control.emit( 'beforedispose' );

        // 清理DOM事件
        this.clearDOMEvents();

        // 清理实例存储
        ui.remove( control );

        // 清理插件
        ui.disposePlugin( control );


        /**
         * @event Control#afterdispose
         * @param {Object} ev 事件参数对象
         * @param {string} ev.type 事件类型
         * @param {Control} ev.target 触发事件的控件对象
         */
        control.emit( 'afterdispose' );

        // 清理自定义事件
        control.off();
    };


    return exports;

});