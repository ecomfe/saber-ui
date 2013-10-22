/**
 * Saber
 * 
 * @file UI主类
 * @author zfkun(zfkun@msn.com)
 */

define( function ( require ) {

    var Lang = require( 'saber-lang' );
    var ui = {};


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
     * @public
     * @param {string=} prefix 前缀
     * @return {string} 新唯一id字符串
     */
    ui.getGUID = function ( prefix ) {
        prefix = prefix || 'sui';
        return prefix + counter++;
    };



    /**
     * 控件库配置数据
     * 
     * @inner
     * @type {Object}
     */
    var config = {
        // 基于已有的DOM结构创建控件时，
        // ui控件的html attribute前缀
        uiPrefix: 'data-ui',

        // 控件的默认class前缀
        uiClassPrefix: 'ui',

        // 控件的状态class前缀
        stateClassPrefix: 'state'
    };

    /**
     * 配置控件库全局配置
     * 
     * @public
     * @param {Object} info 控件库配置信息对象
     */
    ui.config = function ( info ) {
        Lang.extend( config, info );
    };

    /**
     * 获取配置项
     * 
     * @public
     * @param {string} name 配置项名称
     * @return {string} 配置项值
     */
    ui.getConfig = function ( name ) {
        return config[ name ];
    };


    /**
     * 已注册控件容器
     * 
     * @inner
     * @type {Object}
     */
    var components = {};

    /**
     * 注册控件类。
     * 通过类的prototype.type识别控件类型信息。
     * 
     * @public
     * @param {Function} component 控件类
     */
    ui.register = function ( component ) {
        if ( typeof component === 'function' ) {
            var type = component.prototype.type;
            if ( type in components ) {
                throw new Error( type + ' is exists!' );
            }

            components[ type ] = component;
        }
    };

    /**
     * 创建控件
     * 
     * @param {string} type 控件类型
     * @param {Object} options 控件初始化参数
     * @return {?Control} 新创建的控件实例, 失败返回null
     */
    ui.create = function ( type, options ) {
        var Constructor = components[type];

        if ( Constructor ) {
            delete options.type;
            return new Constructor( options );
        }

        return null;
    };

    ui.dispose = function ( ctrl ) {
        // TODO
    };



    ui.get = function ( id ) {
        // TODO
        return components;
    };

    ui.init = function ( wrap, options ) {
        // TODO
    };


    return ui;
});
