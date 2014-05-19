/**
 * Saber UI
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 控件辅助类的DOM相关方法
 * @author zfkun(zfkun@msn.com)
 */

define( function ( require ) {

    var dom = require( 'saber-dom' );
    var ui = require( '../main' );

    /**
     * @override Helper
     */
    var exports = {};

    /**
     * 获取用于控件dom元素的id
     *
     * @public
     * @param {string=} part 控件内部件名称
     * @return {string}
     */
    exports.getId = function ( part ) {
        return ui.getConfig( 'idAttrPrefix' )
            + '-'
            + this.control.id
            + ( part ? '-' + part : '' );
    };


    /**
     * 获取控件部件元素对应的class
     *
     * @public
     * @param {string=} part 控件内部件名称
     * @return {string}
     */
    exports.getClass = function ( part ) {
        var classParts = [
            ui.getConfig( 'uiClassPrefix' ),
            this.control.type.toLowerCase()
        ];

        if ( part ) {
            classParts.push( part );
        }

        return classParts.join( '-' );
    };

    /**
     * 添加控件部件元素对应的class
     *
     * @public
     * @param {string=} part 控件内部件名称
     * @param {HTMLElement=} element 控件内部件元素
     */
    exports.addClass = function ( part, element ) {
        element = element || this.control.main;
        if ( element ) {
            dom.addClass( element, this.getClass( part ) );
        }
    };

    /**
     * 移除控件部件元素对应的class
     *
     * @public
     * @param {string=} part 控件内部件名称
     * @param {HTMLElement=} element 控件内部件元素
     */
    exports.removeClass = function ( part, element ) {
        element = element || this.control.main;
        if ( element ) {
            dom.removeClass( element, this.getClass( part ) );
        }
    };


    /**
     * 添加控件状态相关的UI属性
     *
     * @public
     * @param {string} state 状态名称
     */
    exports.addState = function ( state ) {
        if ( this.control.main ) {
            addUIData( this.control.main, state );
        }
    };

    /**
     * 移除控件状态相关的UI属性
     *
     * @public
     * @param {string} state 状态名称
     */
    exports.removeState = function ( state ) {
        if ( this.control.main ) {
            removeUIData( this.control.main, state );
        }
    };


    function getUIData ( element ) {
        if ( element ) {
            return ( dom.getData( element, 'ui' ) || '' )
                .trim()
                .replace( /\s\s+/g, ' ' )
                .split( ' ' );
        }

        return [];
    }


    function addUIData ( element, val ) {
        var data = getUIData( element );
        if ( data.length && data.indexOf( val ) < 0 ) {
            data.push( val );
            dom.setData( element, 'ui', data.join( ' ' ) );
        }
    }

    function removeUIData ( element, val ) {
        var data = getUIData( element );
        if ( data.length ) {
            data = data.filter( function ( v ) {
                return v !== val;
            } ).join( ' ' );
            dom.setData( element, 'ui', data );
        }
    }


    return exports;

});
