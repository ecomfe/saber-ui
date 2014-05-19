/**
 * Saber UI
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 选项卡控件
 * @author zfkun(zfkun@msn.com)
 */

define(function ( require ) {

    var lang = require( 'saber-lang' );
    var string = require( 'saber-string' );
    var dom = require( 'saber-dom' );
    var ui = require( './main' );
    var Control = require( './Control' );

    /**
     * 选项卡控件
     *
     * @constructor
     * @exports Tab
     * @class
     * @extends Control
     * @requires saber-lang
     * @requires saber-string
     * @requires saber-dom
     * @requires saber-control
     * @fires Tab#add
     * @fires Tab#remove
     * @fires Tab#change
     * @param {Object=} options 初始化配置参数
     * @param {string=} options.id 控件标识
     * @param {HTMLElement=} options.main 控件主元素
     * @param {string=} options.skin 控件皮肤
     * @param {*=} options.* 其余初始化参数由各控件自身决定
     */
    var Tab = function() {
        Control.apply( this, arguments );
    };

    Tab.prototype = {

        /**
         * 控件类型标识
         *
         * @private
         * @type {string}
         */
        type: 'Tab',

        /**
         * 当前活动的标签页的索引
         *
         * @private
         * @type {number}
         * @default 0
         */
        activeIndex: 0,

        /**
         * 标签页排列方向
         * 有效值 `horizontal` 或 `vertical`
         *
         * @private
         * @type {string}
         * @default 'horizontal'
         */
        orientation: 'horizontal',

        /**
         * 标签页内容的模板
         *
         * @private
         * @type {string}
         * @default '${title}'
         */
        itemTemplate: '${title}',

        /**
         * 是否支持滚动
         *
         * @private
         * @type {boolean}
         * @default false
         */
        scroll: false,

        /**
         * 标签页的列表
         *
         * @private
         * @type {Array}
         * @default []
         * @example
         * // 每一项是具有title和panel属性的Object。
         * // title属性为字符串，代表显示的标题。
         * // panel属性指定一个容器HTMLElement的id，为可选属性。
         * [
         *      { title: 'one', panel: 'panel1' },
         *      { title: 'two', panel: 'panel2' },
         *      { title: 'three', panel: 'panel3' },
         *      { title: 'four' }
         * ]
         */
        tabs: [],

        /**
         * 初始化控件选项
         *
         * @override
         * @protected
         * @param {Object} options 构造函数传入的选项
         */
        initOptions: function ( options ) {
            var properties = lang.extend( {
                tabs: this.tabs
            }, options );


            // 找到了`[data-role="navigator"]`的元素，抛弃其它配置，
            // 否则，尝试找到第一个ul子元素，找到同上
            // 且这个配置会覆盖用户传入的`tabs`选项
            var trigger = dom.query( '[data-role=navigator]', this.main ) || dom.query( 'ul', this.main );
            if ( trigger ) {
                // 清空用户传入的配置数据
                properties.tabs = [];

                // 存储选项卡对应元素，减少后续的dom查询次数
                this.triggers = [].slice.call( dom.queryAll( 'li', trigger ) );

                // 解析DOM重新生成`options`.`tabs`配置数据
                this.triggers.forEach(
                    function ( node ) {
                        // 生成对应配置参数并存储，待最后更新
                        properties.tabs.push({
                            title: node.textContent || node.innerText || node.getAttribute( 'title' ),
                            panel: node.getAttribute( 'data-for' )
                        });
                    },
                    this
                );

                // 这里做下存储，给`initStructrue`用下
                this.trigger = trigger;
            }

            Control.prototype.initOptions.call( this, properties );
        },

        /**
         * 初始化DOM结构，仅在第一次渲染时调用
         *
         * @override
         * @protected
         */
        initStructure: function () {
            var trigger = this.trigger;
            var needRebuild = !trigger;

            // 到这里已经没用了
            this.trigger = null;
            delete this.trigger;

            // 若`init`执行后，不存在`trigger`变量，
            // 则需要动态构建必要结构`ul > li * n`
            // 这里先构建总容器元素`ul`
            if ( needRebuild ) {
                trigger = document.createElement( 'ul' );
                this.main.insertBefore( trigger, this.main.firstChild || null );
            }

            // 初始化`navigator`元素相关属性、样式及事件
            dom.setData( trigger, 'role', 'navigator' );
            this.helper.addDOMEvent( trigger, 'click', lang.bind( clickTab, this ) );

            // 动态构建所有tab元素
            // 这行不能提前到上面的三行之前执行
            // 因 `rebuildTabs` 内部用到了 `getId` 查找页卡容器
            // 所以，需要等上面三行初始化完成后才行
            if ( needRebuild ) {
                rebuildTabs( this );
            }
            else {
                // 静态构建时确保所有`trigger`生成了正确的class
                this.triggers.forEach(
                    function ( node ) {
                        dom.setData( node, 'role', 'trigger' );
                    }
                );
            }

            // `navigator`部件滚动支持
            if ( this.scroll ) {
                // 初始化`TabScroll`插件
                ui.activePlugin( this, 'TabScroll', ( this.options.plugin || {} ).scroll );
            }

            // 激活默认项
            // activateTab( this, this.activeIndex );
        },

        /**
         * 创建控件主元素
         *
         * @override
         * @protected
         * @return {HTMLElement}
         */
        createMain: function () {
            return document.createElement( 'div' );
        },

        /**
         * 重新渲染视图
         * 首次渲染时, 不传入 changes 参数
         *
         * @override
         * @param {Object=} changes 变更过的属性的集合
         */
        repaint: function ( changes ) {
            Control.prototype.repaint.apply( this, arguments );

            // 仅允许渲染后的重绘
            if ( changes && changes.hasOwnProperty( 'tabs' ) ) {
                rebuildTabs( this, changes.tabs );
            }

            // 首次渲染 或 更改了激活项索引，则更新重绘
            if ( !changes || changes.hasOwnProperty( 'activeIndex' ) ) {
                activateTab( this, this.activeIndex );
            }

            // 同上
            if ( !changes || changes.hasOwnProperty( 'orientation' ) ) {
                this.removeState( 'vertical' );
                this.removeState( 'horizontal' );
                this.addState( this.orientation );
            }

            // 属性`scroll`的变化，需要通过插件管理器同步做下处理
            // 目前暂时实现的比较粗狂：
            // `false` -> `true`: 重新激活插件(实际内部是重新创建实例)
            // `true` -> `false`: 直接销毁插件
            // TODO: 若`scroll`频繁的设置，可能会带来一定的开销，待后续优化
            if ( changes && changes.hasOwnProperty( 'scroll' ) ) {
                if ( this.scroll ) {
                    ui.activePlugin( this, 'TabScroll', ( this.options.plugin || {} ).scroll );
                }
                else {
                    ui.disposePlugin( this, 'TabScroll' );
                }
            }
        },

        /**
         * 批量设置控件的属性值
         *
         * @override
         * @param {Object} properties 属性值集合
         */
        setProperties: function ( properties ) {
            // 控件禁用状态下，不响应数据更新类操作
            // 注意:
            // 这里直接使用了`delete`，外部调用时小心使用
            // 若不希望传入的参数被更改，最好传入副本进来
            // TODO: 找时间考虑换种方式
            if ( this.disabled && this.rendered ) {
                delete properties.tabs;
                delete properties.activeIndex;
            }

            // 防止因传入非number类型值引起不必要的repaint
            // 比如 `ui.init` 静态化构建时:
            // 在 `render` 之前的 `initOptions` 过程中
            // 会存在 `setProperties` 调用，
            // 而此时的大部分 `property` 的值因都是从DOM属性解析而来
            // 所以都是字符串值, 这里就需要提前做下转化以防万一
            if ( properties.hasOwnProperty( 'activeIndex' )
                && 'string' === typeof properties.activeIndex ) {
                properties.activeIndex = properties.activeIndex | 0;
            }

            // 如果`tabs`配置变了，则会导致`navigator`整个重新渲染，
            // 则后续的`repaint`处理`activeIndex`会产生一次浪费，
            // 因此这里直接把`activeIndex`放自己身上，等`navigator`渲染后使用，
            // 不再把`activeIndex`加入到`changes`集合中去
            if ( properties.tabs ) {
                if ( !properties.hasOwnProperty( 'activeIndex' ) ) {
                    // 如果仅改变`tabs`，则由于标签页的数量变化，
                    // 确认现在激活的标签页是不是还在新的`tabs`中，
                    // 如果不在了，则激活第1个标签
                    var currentActiveTab = this.tabs[ this.activeIndex ];
                    var activeIndex = -1;
                    properties.tabs.some(function ( tabItem, i ) {
                        if ( tabItem === currentActiveTab ) {
                            activeIndex = i;
                            return true;
                        }
                    });

                    // 只有当激活的元素变了的时候，才需要触发`activate`事件，
                    // 事件的触发由`properties`里有没有`activeIndex`决定，
                    // 因此如果新的`tabs`中没有原来激活的那个标签，则要触发一下
                    if ( activeIndex === -1 ) {
                        // 为了让基类`setProperties`检测到变化，
                        // 先把`this.activeIndex`改掉
                        this.activeIndex = -1;
                        properties.activeIndex = 0;
                    }
                    else {
                        this.activeIndex = activeIndex;
                    }
                }
            }

            // `properties`里设置了`activeIndex`
            // 则要调用检测方法判定是否允许改变
            // 若检测返回`false`，则不做更新并移除`activeIndex`项
            if ( properties.hasOwnProperty( 'activeIndex' ) ) {
                var allowChange = this.beforeChange(
                    this.activeIndex,
                    properties.activeIndex
                );
                if ( allowChange === false ) {
                    delete properties.activeIndex;
                }
            }

            Control.prototype.setProperties.call( this, properties );
        },

        /**
         * 切换选项卡前校验
         * 主要给予使用者更多的灵活控制，默认返回true，不允许切换则需返回false
         *
         * @public
         * @param {number} oldIndex 原选中项索引值
         * @param {number} newIndex 新选中项索引值
         * @return {boolean} 是否执行切换
         */
        beforeChange: function ( oldIndex, newIndex ) {
            return true;
        },

        /**
         * 添加一个标签页
         *
         * @public
         * @param {Object} tabItem 标签页配置对象
         * @param {string} tabItem.title 标签页的标题
         * @param {string=} tabItem.panel 标签页对应的容器的id
         */
        add: function ( tabItem ) {
            this.insert( tabItem, this.tabs.length );
        },

        /**
         * 在指定位置添加一个标签页
         *
         * @public
         * @param {Object} tabItem 标签页配置对象
         * @param {string} tabItem.title 标签页的标题
         * @param {string=} tabItem.panel 标签页对应的容器的id
         * @param {number} index 新标签页要插入的位置索引
         * @fires Tab#add
         */
        insert: function( tabItem, index ) {
            if ( this.isDisabled() ) {
                return;
            }

            index = Math.max( Math.min( index, this.tabs.length ), 0 );

            this.tabs.splice( index, 0, tabItem );

            var trigger = dom.query( '[data-role=navigator]' );
            var tabElement = createTabElement( this, tabItem, false );
            trigger.insertBefore(
                tabElement,
                trigger.children[ index ] || null
            );

            // 由于实例存储着一份`tabs`对应的DOM元素集合
            // 这里也需要同步插入更新
            this.triggers.splice( index, 0, tabElement );

            // 如果原来是没有标签页的，则新加的这个默认激活
            if ( this.tabs.length === 1 ) {
                this.activeIndex = 0;
                activateTab( this, 0, -1 );
            }
            else {
                // 如果在当前激活的标签前面插入一个，则`activeIndex`需要变化，
                // 但视图是不用刷新的
                if ( index <= this.activeIndex ) {
                    this.activeIndex++;
                }

                // 新加入的标签默认要隐藏起来
                if ( tabItem.panel ) {
                    // `saber-dom`.`hide`方法必须传入`HTMLElement`
                    // 否则会报错...
                    var panelElement = dom.g( tabItem.panel );
                    if ( panelElement ) {
                        dom.hide( panelElement );
                    }
                }
            }

            /**
             * @event Tab#add
             * @param {Object} ev 事件参数对象
             * @param {string} ev.type 事件类型
             * @param {Tab} ev.target 触发事件的控件对象
             * @param {Object} data 当前激活的标签信息
             * @param {number} data.index 标签索引
             * @param {Object} data.tab 标签数据项
             * @param {string} data.tab.title 标签显示标题
             * @param {string=} data.tab.panel 标签关联的dom容器id
             */
            this.emit( 'add', { index: index, tab: tabItem } );
        },

        /**
         * 移除一个标签页
         *
         * @public
         * @param {Object} tabItem 标签页配置对象
         */
        remove: function ( tabItem ) {
            if ( this.isDisabled() ) {
                return;
            }

            // 这里使用`while`是解决`this.tabs`在嵌套循环里被修改带来的问题
            // 若这里使用`for`循环来处理，则会因为`removeByIndex`里
            // 直接修改了`this.tabs`(`slice`)而发生各种定位错误
            // 此坑很隐晦，修改需谨慎
            // TODO: 每次都`indexOf`，性能上貌似一般，待想到好方法再修改
            var index = 0;
            while ( (index = this.tabs.indexOf( tabItem, index )) >= 0 ) {
                this.removeByIndex( index );
            }
        },

        /**
         * 移除指定索引的标签页
         *
         * @public
         * @param {number} index 需要移除的标签页的索引
         * @fires Tab#remove
         */
        removeByIndex: function ( index ) {
            if ( this.isDisabled() ) {
                return;
            }

            var removed = this.tabs.splice( index, 1 )[ 0 ];
            if ( !removed ) {
                return;
            }

            // 由于实例存储着一份`tabs`对应的DOM元素集合
            // 这里也需要同步插入更新
            var tabElement = this.triggers.splice( index, 1 )[ 0 ];

            // 从DOM树移除先
            tabElement.parentNode.removeChild( tabElement );

            // 如果删的标签在当前激活的标签的前面，
            // 则当前激活的标签的下标其实改变了，`activeIndex`是要调整的，
            // 但这种情况下实际激活的还是同一个标签，不用重新渲染
            if ( index < this.activeIndex ) {
                this.activeIndex--;
            }
            // 如果正好激活的标签被删了，则把激活标签换成当前的后一个，
            // 如果没有后一个了，则换成最后一个，这需要重新渲染
            else if ( index === this.activeIndex ) {
                // 由于可能`activeIndex`没变，因此不能走`setProperties`流程
                this.activeIndex = Math.min(
                    this.activeIndex,
                    this.tabs.length - 1
                );
                activateTab( this, this.activeIndex );
            }

            // 隐藏对应的关联panel元素
            if ( removed.panel ) {
                var panelElement = dom.g( removed.panel );
                if ( panelElement ) {
                    dom.hide( panelElement );
                }
            }

            /**
             * @event Tab#remove
             * @param {Object} ev 事件参数对象
             * @param {string} ev.type 事件类型
             * @param {Tab} ev.target 触发事件的控件对象
             * @param {Object} data 当前移除的标签信息
             * @param {number} data.index 标签索引
             * @param {Object} data.tab 标签数据对象
             * @param {string} data.tab.title 标签显示标题
             * @param {string=} data.tab.panel 标签关联的dom容器id
             */
            this.emit( 'remove', { index: index, tab: removed } );
        },

        /**
         * 选择激活标签
         *
         * @public
         * @param {number} index 需要激活的标签页索引
         */
        select: function ( index ) {
            if ( this.isDisabled() ) {
                return;
            }

            if ( index !== this.activeIndex && this.triggers[ index ] ) {
                this.set( 'activeIndex', index );
            }
        },

        /**
         * 获取标签页内容的HTML
         *
         * @public
         * @param {Object} tabItem 标签页数据项
         * @return {string}
         */
        getItemHTML: function ( tabItem ) {
            return string.format(
                this.itemTemplate,
                {
                    title: string.encodeHTML( tabItem.title )
                }
            );
        }

    };


    /**
     * 点击某个标签时的切换逻辑
     *
     * @inner
     * @param {Event} event DOMEvent对象
     */
    function clickTab( event ) {
        var main = this.main;
        var target = event.target;
        var tabElement = target;

        if ( this.isDisabled() ) {
            return;
        }

        while ( tabElement && tabElement.nodeName !== 'LI' ) {
            // 尽量减少回溯深度，最多回溯至主控元素
            if ( main === tabElement ) return;
            tabElement = tabElement.parentNode;
        }

        if ( tabElement && tabElement.nodeName === 'LI' ) {
            this.triggers.some(
                function ( tab, i ) {
                    if ( tab === tabElement ) {
                        if ( 'close' === dom.getData( target, 'role' ) ) {
                            this.removeByIndex( i );
                        }
                        else {
                            this.set( 'activeIndex', i );
                        }
                        return true;
                    }
                },
                this
            );
        }
    }

    /*
     * 激活指定位置的标签页
     *
     * @inner
     * @param {Tab} tab Tab控件实例
     * @parma {number} index 待激活的标签页的下标
     * @fires Tab#change
     */
    function activateTab( tab, index ) {
        tab.tabs.forEach(
            function ( tabItem, i ) {
                var panel = tabItem.panel && dom.g( tabItem.panel );
                if ( panel ) {
                    dom[ i === index ? 'show' : 'hide' ]( panel );
                }

                dom[ i === index ? 'addClass' : 'removeClass' ]( tab.triggers[ i ], 'active' );
            }
        );

        /**
         * @event Tab#change
         * @param {Object} ev 事件参数对象
         * @param {string} ev.type 事件类型
         * @param {Tab} ev.target 触发事件的控件对象
         * @param {Object} data 当前激活的标签信息
         * @param {number} data.index 标签索引
         * @param {Object} data.tab 标签数据对象
         * @param {string} data.tab.title 标签显示标题
         * @param {string=} data.tab.panel 标签关联的dom容器id
         */
        tab.emit( 'change', { index: index, tab: tab.tabs[ index ] } );
    }

    /**
     * 刷新构建所有标签页
     * 主要用于2处:
     * 1. 首次初始化构建时`initStructrue`
     * 2. `tabs`数据被外部修改(`set`,`setProperties`)重新赋值后的自动化重绘
     *
     * @inner
     * @param {Tab} tab 选项卡实例
     */
    function rebuildTabs( tab ) {
        var trigger = dom.query( '[data-role=navigator]', tab.main );
        var parentNode = trigger.parentNode;
        var referNode = trigger.nextSibling || null;

        // 清空标签DOM内容
        // 从DOM树临时移除，提高后续DOM操作性能
        trigger.innerHTML = '';
        parentNode.removeChild( trigger );

        // 构建所有页卡按钮
        var triggers = [];
        var activeIndex = tab.activeIndex;
        tab.tabs.forEach(function ( tabItem, i ) {
            var li = createTabElement( tab, tabItem, i === activeIndex );
            triggers.push( li );
            trigger.appendChild( li );
        });

        // 存储选项卡对应元素，减少后续的dom查询次数
        tab.triggers = triggers;

        // `referNode`值无效时，插入等同于 `appendChild`
        parentNode.insertBefore( trigger, referNode );
    }


    /**
     * 创建一个标签元素
     *
     * @inner
     * @param {Tab} tab 控件实例
     * @param {Object} tabItem 标签页的配置
     * @param {string} tabItem.title 标签页的标题
     * @param {string=} tabItem.panel 标签页对应容器元素的id
     * @param {boolean} isActive 是否自激活状态
     */
    function createTabElement( tab, tabItem, isActive ) {
        var element = document.createElement( 'li' );

        dom.setData( element, 'role', 'trigger' );

        if ( isActive ) {
            dom.addClass( element, 'active');
        }

        if ( tabItem.panel ) {
            element.setAttribute( 'data-for', tabItem.panel );
        }

        element.innerHTML = tab.getItemHTML( tabItem );

        return element;
    }

    lang.inherits( Tab, Control );

    require( './main' ).register( Tab );

    return Tab;

});
