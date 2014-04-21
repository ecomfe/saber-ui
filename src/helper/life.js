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
     * @param {Control} control 控件实例
     */
    exports.dispose = function ( control ) {
        // 清理DOM事件绑定
        this.clearDOMEvents( control );

        // 删除实例存储
        ui.remove( control );
    };


    return exports;

});