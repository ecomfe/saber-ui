define(function( require ) {

    var ui = require( 'saber-ui' );

    describe( 'config', function() {

        it( 'should have method `getConfig`', function () {
            expect( typeof ui.getConfig ).toEqual( 'function' );
        });

        it( 'should have method `config`', function () {
            expect( typeof ui.config ).toEqual( 'function' );
        });

        it( '`getConfig`', function () {
            expect( ui.getConfig( 'idAttrPrefix' ) ).toEqual( 'ctrl' );
            expect( ui.getConfig( 'uiPrefix' ) ).toEqual( 'data-ui' );
            expect( ui.getConfig( 'instanceAttr' ) ).toEqual( 'data-ctrl-id' );
            expect( ui.getConfig( 'uiClassPrefix' ) ).toEqual( 'ui' );
            expect( ui.getConfig( 'skinClassPrefix' ) ).toEqual( 'skin' );
            expect( ui.getConfig( 'stateClassPrefix' ) ).toEqual( 'state' );
            expect( ui.getConfig( 'uiClassControl' ) ).toEqual( 'ctrl' );
        });

        it( '`config`', function () {
            var uiPrefix = ui.getConfig( 'uiPrefix' );

            ui.config( { uiPrefix: 'data-abc', foo: 'bar' } );
            expect( ui.getConfig( 'uiPrefix' ) ).toEqual( 'data-abc' );
            expect( ui.getConfig( 'foo' ) ).toEqual( 'bar' );

            // restore
            ui.config( { uiPrefix: uiPrefix } );
            expect( ui.getConfig( 'uiPrefix' ) ).toEqual( uiPrefix );
        });

    });

});
