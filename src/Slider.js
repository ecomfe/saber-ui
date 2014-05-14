/**
 * Saber UI
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @file 轮播图控件
 * @author zfkun(zfkun@msn.com)
 */

define(function ( require ) {

    var lang = require( 'saber-lang' );
    var dom = require( 'saber-dom' );
    var Control = require( './Control' );

    /**
     * 轮播图控件
     *
     * @class
     * @constructor
     * @exports Slider
     * @extends Control
     * @requires saber-lang
     * @requires saber-dom
     * @fires Slider#destroy
     * @fires Slider#resize
     * @fires Slider#change
     * @fires Slider#active
     * @fires Slider#inactive
     * @param {Object=} options 初始化配置参数
     * @param {string=} options.id 控件标识
     * @param {HTMLElement=} options.main 控件主元素
     * @param {string=} options.skin 控件皮肤
     * @param {boolean=} options.animate 是否启用切换动画
     * @param {boolean=} options.loop 是否自动循环切换
     * @param {boolean=} options.loopDelay 自动循环切换间隔，单位毫秒
     * @param {boolean=} options.index 初始位置
     * @param {boolean=} options.speed 回弹动画时长，单位毫秒
     * @param {boolean=} options.moveAt 移动侦测阀值，单位像素
     * @param {boolean=} options.switchAt 切换阀值，单位像素
     * @param {string=} options.dotActiveCls dot高亮项样式
     */
    var Slider = function( options ) {
        Control.apply( this, arguments );
    };

    Slider.prototype = {

        /**
         * 控件类型标识
         * 
         * @private
         * @type {string}
         */
        type: 'Slider',

        /**
         * 是否启用切换动画
         *
         * @type {boolean}
         */
        animate: true,

        /**
         * 是否自动循环切换
         *
         * @type {boolean}
         */
        loop: true,

        /**
         * 自动循环切换间隔，单位毫秒
         *
         * @type {number}
         */
        loopDelay: 2000,

        /**
         * 是否启用dot
         * 
         * @type {boolean}
         */
        dot: true,

        /**
         * 初始位置
         *
         * @type {number}
         */
        index: 0,

        /**
         * 回弹动画时长，单位毫秒
         *
         * @type {number}
         */
        speed: 400,

        /**
         * 移动侦测阀值，单位像素
         * 当按下后`移动距离`超过此阀值时才`启动`切换动画
         *
         * @type {number}
         */
        moveAt: 10,

        /**
         * 切换阀值，单位像素
         * 当`移动距离`超过此阀值时才进行`切换`，否则进行`回弹`
         *
         * @type {number}
         */
        switchAt: 30,

        /**
         * dot高亮项样式
         *
         * @type {string}
         */
        dotActiveCls: 'active',


        // initOptions: function ( options ) {
        //     var properties = lang.extend( {}, options );

        //     Control.prototype.initOptions.call( this, properties );
        // }
        
        initStructure: function () {
            var self = this;

            // wrapper
            var wrapper = dom.query( '[data-role=wrapper]', this.main );

            // item
            var items = dom.children( wrapper || this.main ).filter(
                function ( node ) {
                    var role = node.hasAttribute( 'data-role' );
                    return !role || 'item' === role;
                }
            );

            // 若无包装容器，自动构建 & 移动切换项到新容器中
            if ( !wrapper ) {
                wrapper = document.createElement( 'div' );
                dom.setData( wrapper, 'role', 'wrapper' );

                items.forEach(
                    function ( item ) {
                        dom.setData( item, 'role', 'item' );
                        wrapper.appendChild( item );
                    }
                );

                this.main.appendChild( wrapper );
            }
            else {
                items.forEach(
                    function ( item ) {
                        dom.setData( item, 'role', 'item' );
                    }
                );
            }

            // xxx: 考虑是否移除或封闭
            this.length = items.length;
            this.wrapper = wrapper;


            // dot
            if ( self.dot ) {
                var dot = dom.query( '[data-role=dot]', this.main );
                if ( !dot ) {
                    dot = document.createElement( 'div' );
                    dom.setData( dot, 'role', 'dot' );
                    
                    dot.innerHTML = items.map(
                        function ( node, j ) {
                            return '<b' + ( j === 0 ? ' class="' + this + '"' : '') +'></b>';
                        },
                        self.dotActiveCls
                    ).join( '' );

                    this.main.appendChild( dot );
                }

                this.dot = dot;
            }
        },

        initEvent: function () {
            var self = this;

            // 每次拖动开始时的X
            var startX;
            // 上次有效拖动的相对位移值
            var diffX = 0;
            // 上次有效拖动时计算后的X
            var x = 0;

            // 上次拖动完成后的左边距
            this.x = 0;

            // DOM事件聚合, 方便统一管理
            var binds = this.binds = {};

            binds.touchstart = function ( e ) {
                // 这个屏蔽很重要哦，亲~~
                e.preventDefault();

                if ( self.loop ) {
                    self._loop( true );
                }

                startX = e.touches[ 0 ].pageX;
                diffX = 0;
            };

            binds.touchmove = function ( e ) {
                diffX = e.touches[ 0 ].pageX - startX;

                // 超过移动阀值，才进行移动，防止影响内部的点击
                if ( Math.abs( diffX ) > self.moveAt ) {
                    x = self.x + diffX;

                    self._move( x );
                }
            };

            binds.touchend = function ( e ) {
                var diff = Math.abs( diffX );

                // 超过移动阀值，才进行拖动结束后的修正，防止影响内部的点击
                if ( diff < self.moveAt ) {
                    return;
                }

                // update
                self.x = x;
                
                // 达到切换阀值，则根据滑动方向切换
                if ( diff > self.switchAt ) {
                    self.to( self.index + ( diffX < 0 ? 1 : -1 ) );
                }
                // 未达到阀值，则回弹复位
                else {
                    self.to( self.index );
                }

                // 恢复自动轮换
                if ( self.loop ) {
                    self._loop();
                }
            };

            // 屏幕旋转需做下重绘处理
            this.onOriChange = function () {
                var loop = self.loop;

                if ( loop ) {
                    self._loop( true );
                }
                
                self._resize( styleNumber( self.main ) );
                self.to( self.index );

                if ( loop ) {
                    self._loop();
                }
            };

            // dot更新
            if ( self.dot ) {
                this.onDotActive = function ( ev, from, to ) {
                    dom.children( self.dot ).forEach(
                        function ( node, i ) {
                            dom[ i === to ? 'addClass' : 'removeClass' ]( node, this );
                        },
                        self.dotActiveCls
                    );
                };
            }
        },

        /**
         * 重新渲染视图
         * 首次渲染时, 不传入 changes 参数
         * 
         * @override
         * @param {Object=} changes 变更过的属性的集合
         */
        repaint: function ( changes ) {
            // `render` 阶段调用时,不传入 `changes`
            if ( !changes ) {
                this._resize( this.width || styleNumber( this.main ), true );
                this.active();
            }

            // 父类方法最后调用处理
            Control.prototype.repaint.call( this, changes );
        },

        /**
         * 批量设置控件的属性值
         * 
         * @override
         * @param {Object} properties 属性值集合
         */
        setProperties: function ( properties ) {
            if ( properties.hasOwnProperty( 'disabled' ) ) {
                if ( properties.disabled ) {
                    this.inactive();
                }
                else {
                    this.active();
                }
            }

            Control.prototype.setProperties.call( this, properties );
        },

        /**
         * 销毁控件
         *
         * @override
         */
        dispose: function () {
            this.inactive();

            Control.prototype.dispose.call( this );
        },

        _resize: function ( width, isForce ) {
            if ( width == this.width && !isForce ) {
                return this;
            }

            var children = dom.children( this.wrapper );
            var childrenCount = children.length;

            for ( var i = 0; i < childrenCount; i++ ) {
                styleNumber( children[ i ], 'width', width );
            }

            styleNumber( this.wrapper, 'width', width * childrenCount );

            var oldWidth = this.width;
            this.width = width;

            /**
             * @event Slider#resize
             * @param {number} from 上一次的切换项宽度,单位像素
             * @param {number} to 当前的切换项宽度,单位像素
             */
            this.emit( 'resize', oldWidth, width );
        },

        _loop: function ( isStop ) {
            var self = this, delay = self.loopDelay;

            self.timer = clearTimeout( self.timer );

            if ( isStop || this.length < 2 || !delay || delay < 0 ) {
                return;
            }

            self.timer = setTimeout( function () {
                var index = self.index + 1;
                self.to( index < self.length ? index : 0 );
                self._loop();
            }, delay );
        },

        _move: function ( x, speed ) {
            speed = speed || 0;
            this.wrapper.style.cssText += [
                ( this.animate ? '-webkit-transition-duration:' + speed + 'ms;' : '' ),
                '-webkit-transform: translate(' + x + 'px, 0)',
                ' translateZ(0)',
                ';'
            ].join( '' );
        },


        /**
         * 激活控件
         *
         * @public
         * @return {Slider} 当前实例
         */
        active: function () {
            if ( !this.isActive ) {
                this.isActive = true;

                // 控件主元素DOM事件绑定
                toggleDOMEvents( this );
                
                // // 屏幕旋转处理绑定
                // orientationHelper.on( 'change', this.onOriChange );

                // 处理dot高亮
                if ( this.dot ) {
                    this.on( 'change', this.onDotActive );
                }

                // 启动自动切换
                if ( this.loop ) {
                    this._loop();
                }

                /**
                 * @event Slider#active
                 */
                this.emit( 'active' );
            }

            return this;
        },

        /**
         * 禁用控件
         *
         * @public
         * @return {Slider} 当前实例
         */
        inactive: function () {
            if ( this.isActive ) {
                this.isActive = false;

                // 控件主元素DOM事件解绑
                toggleDOMEvents( this, true );

                // // 屏幕旋转处理解绑
                // orientationHelper.off( 'change', this.onOriChange );

                // dot高亮
                if ( this.dot ) {
                    this.off( 'change', this.onDotActive );
                }

                // 停止自动切换
                this._loop( true );

                /**
                 * @event Slider#inactive
                 */
                this.emit( 'inactive' );
            }

            return this;
        },

        /**
         * 切换到指定项
         *
         * @public
         * @param {number} index 目标项的位置
         * @return {Slider} 当前实例
         */
        to: function ( index ) {
            var from = this.index;

            // 防越界
            index = Math.max( 0, Math.min( this.length - 1, index ) );

            // 提前更新,以防不测- -
            this.index = index;

            // 计算X轴偏移
            this.x = 0 - this.width * index;

            this._move( this.x, this.speed );

            // 排除回弹
            if ( from !== index ) {
                /**
                 * @event Slider#change
                 * @param {number} from 原来显示项的位置
                 * @param {number} to 当前显示项的位置
                 */
                this.emit( 'change', from, index );
            }

            return this;
        },

        /**
         * 切换到上一项
         *
         * @public
         * @return {Slider} 当前实例
         */
        prev: function () {
            return this.to( this.index - 1 );
        },

        /**
         * 切换到下一项
         *
         * @public
         * @return {Slider} 当前实例
         */
        next: function () {
            return this.to( this.index + 1 );
        }

    };


    lang.inherits( Slider, Control );

    require( './main' ).register( Slider );


    /**
     * 设置/获取 元素的数字值类型的样式
     * 为了方便处理数字值类型的样式
     *
     * @inner
     * @param {HTMLElement} node 元素
     * @param {string} name 样式名,如`width`,`height`,`margin-left`等数字类型的样式
     * @param {number=} val 样式值(不含单位),传入时则为设置样式
     * @return {number=} 没有传入`val`参数时返回获取到的值，否则返回`undefined`
     */
    function styleNumber ( node, name, val ) {
        name = name || 'width';
        
        if ( arguments.length > 2 ) {
            return dom.setStyle( node, name, ( parseInt( val, 10 ) || 0 ) + 'px' );
        }

        return parseInt( dom.getStyle( node, name ), 10 ) || 0;
    }

    /**
     * Slider 控件相关DOM事件管理
     *
     * @inner
     * @param {Slider} slider `Slider`实例对象
     * @param {boolean} isOff 是否移除绑定事件
     */
    function toggleDOMEvents ( slider, isOff ) {
        var main = slider.main;
        var binds = slider.binds;

        if ( !main || !binds ) {
            return;
        }

        for ( var type in binds ) {
            slider.helper[ isOff ? 'removeDOMEvent' : 'addDOMEvent' ]( slider.main, type, binds[ type ] );
        }
    }


    return Slider;

});
