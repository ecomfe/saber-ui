/**
 * Saber UI
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 选项卡滚动插件
 * @author zfkun(zfkun@msn.com)
 */

define(function ( require ) {

    var bind = require( 'saber-lang/bind' );
    var dom = require( 'saber-dom' );
    var SaberScroll = require( 'saber-scroll' );

    /**
     * 选项卡滚动插件
     *
     * @constructor
     * @exports TabScroll
     * @class
     * @requires saber-lang
     * @requires saber-scroll
     * @param {Tab} tab 选项卡控件实例
     * @param {Object=} options 插件配置项
     * 此参数不做加工过滤，直接传给`saber-scroll`构造函数
     */
    var Scroll = function( tab, options ) {
        /**
         * 选项卡控件实例
         *
         * @public
         * @type {Tab}
         */
        this.target = tab;
        this.initOptions( options );
    };

    Scroll.prototype = {

        /**
         * 插件类型标识
         *
         * @private
         * @type {string}
         */
        type: 'TabScroll',

        /**
         * 插件初始化
         *
         * @protected
         * @param {Object=} options 构造函数传入的配置参数
         * 此参数不做加工过滤，直接传给`saber-scroll`构造函数
         */
        initOptions: function ( options ) {
            this.options = options || {};

            if ( this.target.rendered ) {
                this.render();
            }
            else {
                this.target.on(
                    'afterrender',
                    this.onRender = bind( this.render, this )
                );
            }
        },

        /**
         * 初始化DOM结构，仅在第一次渲染时调用
         *
         * @protected
         */
        initStructure: function () {
            var tab = this.target;
            var trigger = dom.query( '[data-role=navigator]', tab.main );

            // 初始化前需要确保`saber-scroll`的标准结构复合要求
            // `<container><main>...</main></container>`
            //
            // 1. 查找`scroller`部件元素，并检查是否为`控件主元素`的`第一子元素`
            //    若没找到，则自动创建并插入到第一子元素位置
            //    若找到，但不是第一子元素，则直接移动到第一子元素位置
            var firstChild = tab.main.children[ 0 ];
            var scroller = dom.query( '[data-role=scroll]', tab.main );
            if ( firstChild !== scroller ) {
                if ( !scroller ) {
                    scroller = document.createElement( 'div' );
                }

                tab.main.insertBefore( scroller, firstChild );
                scroller.appendChild( trigger );
            }

            // 确保`scroller`部件元素设置了正确的`id`和`role`
            scroller.id = tab.helper.getId( 'scroller' );
            dom.setData( scroller, 'role', 'scroll' );

            // 这里最后检查并确保`navigator`部件元素
            // 是`scroller`部件元素的`第一子元素`
            if ( scroller.children[ 0 ] !== trigger ) {
                scroller.insertBefore( trigger, scroller.children[ 0 ] );
            }

            dom.setStyle( tab.main, 'overflow', 'hidden' );
        },

        /**
         * 初始化所有事件监听
         *
         * @protected
         */
        attachEvents: function () {
            var tab = this.target;

            this.onRepaint = bind( this.repaint, this );
            tab.on( 'add', this.onRepaint );
            tab.on( 'remove', this.onRepaint );
            // TODO: 暂时先这么用，待优化
            window.addEventListener( 'resize', this.onRepaint );

            this.onEnable = bind( this.enable, this );
            tab.on( 'enable', this.onEnable );
            tab.on( 'show', this.onEnable );

            this.onDisable = bind( this.disable, this );
            tab.on( 'disable', this.onDisable );
            tab.on( 'hide', this.onDisable );
        },

        /**
         * 释放所有事件监听
         *
         * @protected
         */
        detachEvents: function() {
            var tab = this.target;

            tab.off( 'afterrender', this.onRender );

            // TODO: 暂时先这么用，待优化
            window.removeEventListener( 'resize', this.onRepaint );
            tab.off( 'add', this.onRepaint );
            tab.off( 'remove', this.onRepaint );

            tab.off( 'enable', this.onEnable );
            tab.off( 'show', this.onEnable );

            tab.off( 'disable', this.onDisable );
            tab.off( 'hide', this.onDisable );

            this.onRender = this.onRepaint = this.onEnable = this.onDisable = null;
        },

        /**
         * 渲染插件
         *
         * @public
         */
        render: function () {
            if ( this.rendered ) {
                return;
            }

            this.rendered = !0;

            this.initStructure();

            this.scroller = SaberScroll( this.target.main, this.options );

            this.attachEvents();
        },

        /**
         * 销毁插件
         *
         * @public
         */
        dispose: function () {
            this.detachEvents();

            this.scroller.scrollTo( 0, 0 );
            this.scroller.destroy();

            this.target = this.scroller = null;
        },

        /**
         * 启用插件
         *
         * @public
         */
        enable: function () {
            this.scroller.enable();
        },

        /**
         * 禁用插件
         *
         * @public
         */
        disable: function () {
            this.scroller.disable();
        },

        /**
         * 重置插件
         *
         * @public
         */
        repaint: function () {
            this.scroller.repaint();
        }

    };

    require( '../main' ).registerPlugin( Scroll );

    return Scroll;

});
