/**
 * Saber UI
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @file 按钮控件
 * @author zfkun(zfkun@msn.com)
 */

define(function ( require ) {

    var lang = require( 'saber-lang' );
    var dom = require( 'saber-dom' );
    var Control = require( './Control' );

    /**
     * 按钮控件
     * 
     * @constructor
     * @exports Button
     * @class
     * @extends Control
     * @requires saber-lang
     * @requires saber-dom
     * @requires Control
     * @fires Button#click
     * @param {Object=} options 初始化配置参数
     * @param {string=} options.id 控件标识
     * @param {HTMLElement=} options.main 控件主元素
     * @param {string=} options.skin 控件皮肤
     * @param {*=} options.* 其余初始化参数由各控件自身决定
     */
    var Button = function( options ) {
        Control.apply( this, arguments );
    };

    Button.prototype = {

        /**
         * 控件类型标识
         * 
         * @private
         * @type {string}
         */
        type: 'Button',

        /**
         * 按钮显示文字
         * 
         * @private
         * @type {string}
         * @default ''
         */
        content: '',

        /**
         * 初始化控件选项
         *
         * @override
         * @protected
         * @param {Object} options 构造函数传入的选项
         */
        initOptions: function ( options ) {
            var properties = lang.extend( {
                content: this.content || this.main.innerHTML
            }, options );

            Control.prototype.initOptions.call( this, properties );
        },

        /**
         * 初始化事件交互
         *
         * @protected
         * @override
         */
        initEvent: function () {
            var self = this;

            this.helper.addDOMEvent(
                this.main,
                'click',
                function ( e ) {
                    if ( !self.isDisabled() && !self.isHidden() ) {
                        /**
                         * @event Button#click
                         * @param {Object} ev 事件参数对象
                         * @param {string} ev.type 事件类型
                         * @param {Control} ev.target 触发事件的控件对象
                         * @param {Object} e MouseEvent对象
                         */
                        self.emit( 'click', e );
                    }
                }
            );
        },

        /**
         * 创建控件主元素
         * 
         * @override
         * @return {HTMLElement}
         */
        createMain: function () {
            return document.createElement( 'BUTTON' );
        },

        /**
         * 重新渲染视图
         * 首次渲染时, 不传入 changes 参数
         * 
         * @override
         * @param {Object=} changes 变更过的属性的集合
         */
        repaint: function ( changes ) {
            var main = this.main;

            // 首次渲染时, changes 不传入. see `Control#render`
            // 非首次渲染, changes 必传入. see `Control#setProperties`
            // 这里做下处理节约代码量
            changes = changes || this;

            if ( changes.hasOwnProperty( 'height' ) ) {
                dom.setStyle( main, 'height', this.height );
            }

            if ( changes.hasOwnProperty( 'width' ) ) {
                dom.setStyle( main, 'width', this.width );
            }

            if ( changes.hasOwnProperty( 'content' ) ) {
                main.innerHTML = this.content;
            }

            // 父类方法最后调用处理
            Control.prototype.repaint.call( this, changes );
        },

        /**
         * 设置按钮内容
         * 
         * @public
         * @param {string} content 要设置的按钮内容
         */
        setContent: function ( content ) {
            // 这里不能用 `this.set`, 会产生死循环的...
            this.setProperties( { content: content } );
        }

    };

    lang.inherits( Button, Control );

    require( './main' ).register( Button );

    return Button;

});
