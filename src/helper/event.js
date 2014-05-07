/**
 * Saber UI
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @file aaa
 * @author zfkun(zfkun@msn.com)
 */

define( function ( require ) {

    var lib = require( '../lib' );

    /**
     * @override Helper
     */
    var exports = {};


    /**
     * DOM事件存储器键值
     * 紧为控件管理的DOM元素使用，存储在控件实例上
     *
     * @type {string}
     */
    var domEventsKey = '_uiDOMEvent';

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

        var guid = element[ domEventsKey ];
        if ( !guid ) {
            guid = element[ domEventsKey ] = lib.getGUID();
        }

        var events = control.domEvents[ guid ];
        if ( !events ) {
            // `events`中的键都是事件的名称，仅`element`除外，
            // 因为DOM上没有`element`这个事件，所以这里占用一下没关系
            events = control.domEvents[ guid ] = { element: element };
        }

        // var isGlobal = isGlobalEvent( element );
        var listeners = events[ type ];
        if ( !listeners ) {
            listeners = events[ type ] = [];
        }

        element.addEventListener( type, handler, false );

        listeners.push( handler );
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
        var control = this.control;

        if ( !control.domEvents ) {
            return;
        }

        var events = control.domEvents[ element[ domEventsKey ] ];

        if ( !events || !events[ type ] ) {
            return;
        }

        events[ type ].forEach(
            function ( fn ) {
                if ( !handler || fn === handler ) {
                    element.removeEventListener( type, fn, false );    
                }
            }
        );

        delete events[ type ];
    };

    /**
     * 清除控件管理的DOM元素上的事件
     *
     * @public
     * @param {HTMLElement=} element 控件管理的DOM元素
     * 如果没有此参数则去除所有该控件管理的元素的DOM事件
     */
    exports.clearDOMEvents = function ( element ) {
        var control = this.control;

        if ( !control.domEvents ) {
            return;
        }

        var guid, events;

        if ( !element ) {
            for ( guid in control.domEvents ) {
                if ( control.domEvents.hasOwnProperty( guid ) ) {
                    events = control.domEvents[ guid ];
                    exports.clearDOMEvents( events.element );
                }
            }
            return;
        }

        guid = element[ domEventsKey ];
        events = control.domEvents[ guid ];

        // `events`中存放着各事件类型，只有`element`属性是一个DOM对象，
        // 因此要删除`element`这个键，
        // 以避免`for... in`的时候碰到一个不是数组类型的值
        delete events.element;
        for ( var type in events ) {
            if ( events.hasOwnProperty( type ) ) {
                exports.removeDOMEvent( element, type );
            }
        }
        delete control.domEvents[ guid ];
    };

    return exports;

});