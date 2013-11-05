/**
 * Saber UI
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file UI主类
 * @author zfkun(zfkun@msn.com)
 */

define(function ( require ) {

    var extend = require( 'saber-lang/extend' );

    /**
     * 主类
     * 提供UI全局配置、注册、管理、解析、构建等
     * 
     * @module ui
     * @exports ui
     * @requires lang~extend
     * @requires ui~config
     * @requires ui~component
     * @requires ui~control
     * @requires ui~parse
     * @requires ui~init
     */
    var ui = {};

    extend(
        ui,
        require( './config' ),
        require( './component' ),
        require( './control' ),
        require( './parse' ),
        require( './init' )
    );

    return ui;

});
