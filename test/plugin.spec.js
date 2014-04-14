define(function() {

    var registerPlugin = require( 'saber-ui/plugin' ).registerPlugin;
    var activePlugin = require( 'saber-ui/plugin' ).activePlugin;
    var inactivePlugin = require( 'saber-ui/plugin' ).inactivePlugin;
    var disposePlugin = require( 'saber-ui/plugin' ).disposePlugin;

    var MyPlugin = function ( control, options ) {
        options = options || {};
        this.name = options.name;
    };
    MyPlugin.prototype = {
        constructor: MyPlugin,
        type: 'MyPlugin'
    };


    describe( 'plugin', function() {

        var doReg = function () {
            registerPlugin( MyPlugin );
        };

        it( '`registerPlugin`', function () {
            expect( doReg ).not.toThrow();
            expect( doReg ).toThrowError( 'plugin MyPlugin is exists!' );
        });

        it( '`activePlugin`', function () {
            var control = {};
            activePlugin( control, 'MyPlugin', { name: 'saber' } );

            var activePlugins = control.plugins;
            var plugin = activePlugins && activePlugins[ 'MyPlugin' ];

            expect( activePlugins ).toBeDefined();
            expect( plugin ).toBeDefined();
            expect( plugin instanceof MyPlugin ).toBeTruthy();
            expect( plugin.name ).toEqual( 'saber' );
        });

        it( '`inactivePlugin`', function () {
            var control = {};
            inactivePlugin( control, 'MyPlugin' );

            // TODO
            expect( true ).toEqual( true );
        });

        it( '`disposePlugin`', function () {

            var count = 0;
            var generatePlugin = function () {
                count++;
                return {
                    type: 'P' + count,
                    dispose: function () { count--; }
                };
            };

            var control = { plugins: {} };
            '.....'.split('').forEach(function () {
                var p = generatePlugin();
                control.plugins[ p.type ] = p;
            });

            expect( control.plugins[ 'P1' ] ).toBeDefined();
            expect( control.plugins[ 'P2' ] ).toBeDefined();
            expect( control.plugins[ 'P3' ] ).toBeDefined();
            expect( control.plugins[ 'P4' ] ).toBeDefined();
            expect( control.plugins[ 'P5' ] ).toBeDefined();

            disposePlugin( control, 'P1' );
            expect( control.plugins[ 'P1' ] ).not.toBeDefined();

            disposePlugin( control, [ 'P2', 'p3' ] );
            expect( control.plugins[ 'P2' ] ).not.toBeDefined();
            expect( control.plugins[ 'P3' ] ).toBeDefined();

            disposePlugin( control );
            expect( control.plugins[ 'P4' ] ).not.toBeDefined();
            expect( control.plugins[ 'P5' ] ).not.toBeDefined();

        });

    });

});
