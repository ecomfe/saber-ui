/**
 * Saber UI
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @file 解析器
 * @author zfkun(zfkun@msn.com)
 */

define(function () {

    /**
     * 解析器
     * 对DOM元素解析，从而为构建器提供初始化数据)
     * 
     * @mixin
     * @module saber-ui/parse
     * @type {Object}
     */
    var exports = {};

    /**
     * 将"name:value[;name:value]"的属性值解析成Object
     * 
     * @public
     * @param {string} source 属性值源字符串
     * @param {Function=} 替换值的处理函数
     * @return {Object}
     */
    exports.parseAttribute = function ( source, valueReplacer ) {
        if ( !source ) {
            return {};
        }

        // 为了让key和value中有`:`或`;`这类分隔符时能正常工作，不采用正则
        // 
        // 分析的原则是：
        // 
        // 1. 找到第1个冒号，取前面部分为key
        // 2. 找下个冒号前的最后一个分号，取前面部分为value
        // 3. 如果字符串没结束，回到第1步
        var result = {}; // 保存结果
        var lastStop = 0; // 上次找完时停下的位置，分隔字符串用
        var cursor = 0; // 当前检索到的字符

        // 为了保证只用一个`source`串就搞定，下面会涉及到很多的游标，
        // 简单的方法是每次截完一段后把`soruce`截过的部分去掉，
        // 不过这么做会频繁分配字符串对象，所以优化了一下保证`source`不变
        while ( cursor < source.length ) {
            // 找key，找到第1个冒号
            while ( cursor < source.length
                && source.charAt( cursor ) !== ':'
            ) {
                cursor++;
            }

            // 如果找到尾也没找到冒号，那就是最后有一段非键值对的字符串，丢掉
            if ( cursor >= source.length ) {
                break;
            }

            // 把key截出来
            var key = source.slice( lastStop, cursor ).trim();
            // 移到冒号后面一个字符
            cursor++;
            // 下次切分就从这个字符开始了
            lastStop = cursor;
            // 找value，要找最后一个分号，这里就需要前溯了，先找到第1个分号
            while ( cursor < source.length
                && source.charAt( cursor ) !== ';'
            ) {
                cursor++;
            }

            // 然后做前溯一直到下一个冒号
            var lookAheadIndex = cursor + 1;
            while ( lookAheadIndex < source.length ) {
                var ch = source.charAt( lookAheadIndex );

                // 如果在中途还发现有分号，把游标移过来
                if ( ch === ';' ) {
                    cursor = lookAheadIndex;
                }

                // 如果发现了冒号，则上次的游标就是最后一个分号了
                if ( ch === ':' ) {
                    break;
                }

                lookAheadIndex++;
            }

            // 把value截出来，这里没有和key一样判断是否已经跑到尾，
            // 是因为我们允许最后一个键值对没有分号结束，
            // 但是会遇上`key:`这样的串，即只有键没有值，
            // 这时我们就认为值是个空字符串了
            var value = source.slice( lastStop, cursor ).trim();
            // 加入到结果中
            result[ key ] = valueReplacer ? valueReplacer( value ) : value;
            // 再往前进一格，开始下一次查找
            cursor++;
            lastStop = cursor;
        }

        return result;
    };

    return exports;

});
