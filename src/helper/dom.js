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
     * 获取控件用于生成css class的类型
     *
     * @inner
     * @param {Control} control 控件实例
     * @return {string}
     */
    function getControlClassType( control ) {
        return control.type.toLowerCase();
    }

    /**
     * 将参数用`-`连接成字符串
     *
     * @inner
     * @param {...string} var_args 待连接的字符串组
     * @return {string} 连接后的合成字符串
     */
    function joinByStrike() {
        return [].slice.call( arguments ).join( '-' );
    }

    /**
     * 批量添加class到目标元素
     *
     * @inner
     * @param {HTMLElement} element 目标元素
     * @param {Array} classes 待添加的class数组
     */
    function addClasses( element, classes ) {
        classes.forEach(
            function ( cls ) {
                dom.addClass( this, cls );
            },
            element
        );
    }

    /**
     * 批量删除目标元素的class
     *
     * @inner
     * @param {HTMLElement} element 目标元素
     * @param {Array} classes 待删除的class数组
     */
    function removeClasses( element, classes ) {
        classes.forEach(
            function ( cls ) {
                dom.removeClass( this, cls );
            },
            element
        );
    }

    /**
     * 获取控件相关的class数组
     *
     * @public
     * @param {string=} part 控件内部件名称
     * @return {Array.<string>}
     */
    exports.getPartClasses = function ( part ) {
        // main:
        //   ui-{commonCls} 为了定义有限全局的normalize
        //   ui-{type}
        //   skin-{skinname}
        //   skin-{skinname}-{type}  移动端暂时废弃( .ui-{type}.skin-{skinname} )
        // part:
        //   ui-{type}-{part}
        //   skin-{skinname}-{type}-{part}

        var type = getControlClassType( this.control );
        var skin = this.control.skin;
        var prefix = ui.getConfig( 'uiClassPrefix' );
        var skinPrefix = ui.getConfig( 'skinClassPrefix' );
        var commonCls = ui.getConfig( 'uiClassControl' );
        var classes = [];

        if ( part ) {
            classes.push( joinByStrike( prefix, type, part ) );
            if ( skin ) {
                classes.push( joinByStrike( skinPrefix, skin, type, part ) );
            }
        }
        else {
            classes.push(
                joinByStrike( prefix, commonCls ),
                joinByStrike( prefix, type )
            );
            if ( skin ) {
                classes.push(
                    joinByStrike( skinPrefix, skin ),
                    joinByStrike( skinPrefix, skin, type )
                );
            }
        }

        return classes;
    };

    /**
     * 添加控件相关的class
     *
     * @public
     * @param {string=} part 控件内部件名称
     * @param {HTMLElement=} element 控件内部件元素
     */
    exports.addPartClasses = function ( part, element ) {
        element = element || this.control.main;
        if ( element ) {
            addClasses(
                element,
                this.getPartClasses( part )
            );
        }
    };

    /**
     * 移除控件相关的class
     *
     * @public
     * @param {string=} part 控件内部件名称
     * @param {HTMLElement=} element 控件内部件元素
     */
    exports.removePartClasses = function ( part, element ) {
        element = element || this.control.main;
        if ( element ) {
            removeClasses(
                element,
                this.getPartClasses( part, element )
            );
        }
    };

    /**
     * 获取控件状态相关的class数组
     *
     * @public
     * @param {string} state 状态名称
     * @return {Array.<string>}
     */
    exports.getStateClasses = function ( state ) {
        // ui-{type}-{statename}
        // state-{statename}
        // skin-{skinname}-{statename}
        // skin-{skinname}-{type}-{statename}

        var type = getControlClassType( this.control );
        var classes = [
            joinByStrike( ui.getConfig( 'uiClassPrefix' ), type, state ),
            joinByStrike( ui.getConfig( 'stateClassPrefix' ), state )
        ];

        var skin = this.control.skin;
        if ( skin ) {
            var skinPrefix = ui.getConfig( 'skinClassPrefix' );
            classes.push(
                joinByStrike( skinPrefix, skin, state ),
                joinByStrike( skinPrefix, skin, type, state )
            );
        }

        return classes;
    };

    /**
     * 添加控件状态相关的class
     *
     * @public
     * @param {string} state 状态名称
     */
    exports.addStateClasses = function ( state ) {
        if ( this.control.main ) {
            addClasses( this.control.main, this.getStateClasses( state ) );
        }
    };

    /**
     * 移除控件状态相关的class
     *
     * @public
     * @param {string} state 状态名称
     */
    exports.removeStateClasses = function ( state ) {
        if ( this.control.main ) {
            removeClasses( this.control.main, this.getStateClasses( state ) );
        }
    };


    return exports;

});