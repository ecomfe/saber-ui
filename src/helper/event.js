/**
 * Saber UI
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 控件辅助类的DOM事件相关方法
 * @author zfkun(zfkun@msn.com)
 */

define( function ( require ) {

    var lang = require( 'saber-lang' );
    var lib = require( '../lib' );

    /**
     * @override Helper
     */
    var exports = {};


    /**
     * DOM事件存储器键值
     * 仅为控件管理的DOM元素使用，存储在控件实例上
     *
     * @const
     * @type {string}
     */
    var DOM_EVENTS_KEY = '_uiDOMEvent';

    /**
     * 检查元素是否属于全局事件范围的目标元素
     *
     * @param {HTMLElement} element 待检查元素
     * @return {boolean}
     */
    function isGlobalEvent( element ) {
        return element === window
            || element === document
            || element === document.documentElement
            || element === document.body;
    }


    function triggerDOMEvent ( control, element, ev ) {
        var queue = control.domEvents[ ev.currentTarget[ DOM_EVENTS_KEY ] ][ ev.type ];
        if ( queue ) {
            queue.forEach(
                function ( fn ) {
                    fn.call( this, ev );
                },
                control
            );
        }
    }

    /**
     * 为控件管理的DOM元素添加DOM事件
     *
     * @public
     * @param {HTMLElement} element 需要添加事件的DOM元素
     * @param {string} type 事件的类型
     * @param {function} handler 事件处理函数
     */
    exports.addDOMEvent = function ( element, type, handler ) {
        var control = this.control;

        if ( !control.domEvents ) {
            control.domEvents = {};
        }

        var guid = element[ DOM_EVENTS_KEY ];
        if ( !guid ) {
            guid = element[ DOM_EVENTS_KEY ] = lib.getGUID();
        }

        var events = control.domEvents[ guid ];
        if ( !events ) {
            // `events`中的键都是事件的名称，仅`node`除外，
            // 因为DOM上没有`node`这个事件，所以这里占用一下没关系
            events = control.domEvents[ guid ] = { node: element };
        }

        // var isGlobal = isGlobalEvent( element );

        var handlers = events[ type ];

        // 同一个部件元素的同一个DOM事件
        // 仅用一个处理函数处理,存放在队列的`handler`上
        if ( !handlers ) {
            handlers = events[ type ] = [];
            handlers.handler = lang.bind( triggerDOMEvent, null, control, element );
            element.addEventListener( type, handlers.handler, false );
        }

        // 过滤重复监听器
        if ( handlers.indexOf( handler ) < 0 ) {
            handlers.push( handler );
        }
    };

    /**
     * 为控件管理的DOM元素移除DOM事件
     *
     * @public
     * @param {HTMLElement} element 需要删除事件的DOM元素
     * @param {string} type 事件的类型
     * @param {Function=} handler 事件处理函数
     * 如果没有此参数则移除该控件管理的元素的所有`type`DOM事件
     */
    exports.removeDOMEvent = function ( element, type, handler ) {
        var events = this.control.domEvents;
        if ( !events ) {
            return;
        }

        events = events[ element[ DOM_EVENTS_KEY ] ];
        if ( !events || !events[ type ] ) {
            return;
        }

        // 图方便
        events = events[ type ];

        if ( !handler ) {
            events.length = 0;
            element.removeEventListener( type, events.handler, false );
        }
        else {
            var i = events.indexOf( handler );
            if ( i >= 0 ) {
                events.splice( i, 1 );
            }
        }

        delete this.control.domEvents[ type ];
    };

    /**
     * 清除控件管理的DOM元素上的事件
     *
     * @public
     * @param {HTMLElement=} element 控件管理的DOM元素
     * 如果没有此参数则去除所有该控件管理的元素的DOM事件
     */
    exports.clearDOMEvents = function ( element ) {
        var events = this.control.domEvents;
        if ( !events ) {
            return;
        }

        var guid;

        if ( !element ) {
            for ( guid in events ) {
                if ( events.hasOwnProperty( guid ) ) {
                    this.clearDOMEvents( events[ guid ].node );
                }
            }

            this.control.domEvents = null;

            return;
        }

        guid = element[ DOM_EVENTS_KEY ];
        events = events[ guid ];

        // `events`是各种DOM事件的键值对容器
        // 但包含存在一个键值为`node`的DOM对象，需要先移除掉
        // 以避免影响后面的`for`循环处理
        delete events.node;

        // 清除已经注册的事件
        for ( var type in events ) {
            if ( events.hasOwnProperty( type ) ) {
                this.removeDOMEvent( element, type );
            }
        }

        delete this.control.domEvents[ guid ];
    };

    return exports;

});
