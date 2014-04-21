/**
 * Saber UI
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @file 基础工具库
 * @author zfkun(zfkun@msn.com)
 */

define( function ( require ) {

    var lib = {};

    /**
     * GUID生成基数
     * 
     * @inner
     * @type {number}
     */
    var counter = 0x861005;

    /**
     * 生成全局唯一id
     *
     * @param {string=} prefix 前缀
     * @return {string} 新唯一id字符串
     */
    lib.getGUID = function ( prefix ) {
        prefix = prefix || 'ui';
        return prefix + counter++;
    };

    return lib;

});