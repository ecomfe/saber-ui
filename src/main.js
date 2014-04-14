/**
 * Saber UI
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @file 公共部分
 * @author zfkun(zfkun@msn.com)
 */

define(function ( require ) {

    var extend = require( 'saber-lang/extend' );

    /**
     * 公共部分
     * 提供UI全局配置、注册、管理、插件、解析、构建等
     * 
     * @exports saber-ui
     * @mixes module:saber-ui/config
     * @mixes module:saber-ui/control
     * @mixes module:saber-ui/plugin
     * @mixes module:saber-ui/parse
     * @mixes module:saber-ui/init
     * @requires saber-lang/extend
     * @requires saber-ui/config
     * @requires saber-ui/control
     * @requires saber-ui/plugin
     * @requires saber-ui/parse
     * @requires saber-ui/init
     */
    var exports = {};

    extend(
        exports,
        require( './config' ),
        require( './control' ),
        require( './plugin' ),
        require( './parse' ),
        require( './init' )
    );

    return exports;

});
