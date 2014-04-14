/**
 * Saber UI
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @file 插件管理器
 * @author zfkun(zfkun@msn.com)
 */

define(function () {

    /**
     * 插件管理器
     * 
     * @mixin
     * @module saber-ui/plugin
     * @type {Object}
     */
    var exports = {};

    /**
     * 已注册插件类的容器
     * 
     * @inner
     * @type {Object}
     */
    var plugins = {};

    /**
     * 注册插件类
     * 通过类的`prototype.type`识别插件类型信息
     * 
     * @public
     * @param {Function} plugin 插件类
     */
    exports.registerPlugin = function ( plugin ) {
        if ( 'function' === typeof plugin ) {
            var type = plugin.prototype.type;
            if ( type in plugins ) {
                throw new Error( 'plugin ' + type + ' is exists!' );
            }

            plugins[ type ] = plugin;
        }
    };

    /**
     * 激活插件
     * 
     * @public
     * @param {Control} control 目标控件实例
     * @param {String} pluginName 待激活插件名
     * @param {Object=} options 插件配置项
     */
    exports.activePlugin = function ( control, pluginName, options ) {
        var activedPlugins = control.plugins || ( control.plugins = {} );
        var plugin = activedPlugins[ pluginName ];

        if ( !plugin && ( plugin = plugins[ pluginName ] ) ) {
            control.plugins[ pluginName ] = new plugin( control, options );
        }
    };

    /**
     * 禁用插件
     * 暂时不实现，视后续需要补充
     * 
     * @public
     * @param {Control} control 目标控件实例
     * @param {(String= | Array=)} pluginName 待禁用插件名
     * 单个禁用传入插件名, 批量禁用传入数组, 全部禁用不传入
     */
    exports.inactivePlugin = function ( control, pluginName ) {
        // TODO: 暂时不实现，视后续需要补充
    };

    /**
     * 销毁插件
     * 
     * @public
     * @param {Control} control 目标控件实例
     * @param {(String= | Array=)} pluginName 待销毁插件名
     * 单个删除传入插件名, 批量删除传入数组, 全部删除不传入
     */
    exports.disposePlugin = function ( control, pluginName ) {
        var activedPlugins = control.plugins;
        var names;

        if ( !activedPlugins ) {
            return;
        }

        if ( Array.isArray( pluginName ) ) {
            names = pluginName;
        }
        else if ( !pluginName ) {
            names = Object.keys( activedPlugins );
        }
        else if ( 'string' === typeof pluginName ) {
            names = [ pluginName ];
        }

        names.forEach(function ( name ) {
            if ( name && activedPlugins[ name ] ) {
                activedPlugins[ name ].dispose();
                delete activedPlugins[ name ];
            }
        });
    };

    return exports;

});
