/**
 * Saber UI
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 控件常用方法的辅助类
 * @author zfkun(zfkun@msn.com)
 */

define( function ( require ) {

    /**
     * 控件辅助类
     *
     * @constructor
     * @param {Control} control 关联的控件实例
     */
    var Helper = function ( control ) {
        this.control = control;
    };

    Helper.prototype = {

        constructor: Helper

        // TODO: mixin event/dom/life/template
    };

    return Helper;

});