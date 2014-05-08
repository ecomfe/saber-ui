/**
 * Saber UI
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 控件常用方法的辅助类
 * @author zfkun(zfkun@msn.com)
 */

define( function ( require ) {

    var extend = require( 'saber-lang/extend' );


    /**
     * 控件辅助类
     *
     * @exports Helper
     * @class
     * @constructor
     * @param {Control} control 关联的控件实例
     */
    var Helper = function ( control ) {
        this.control = control;
    };

    extend(
        Helper.prototype,
        require( './helper/dom' ),
        require( './helper/event' ),
        require( './helper/life' ),
        require( './helper/template' )
    );

    return Helper;

});