define(function( require ) {

    var config = require( 'saber-ui/config' ).config;
    var getConfig = require( 'saber-ui/config' ).getConfig;

    describe( 'config', function() {

        it( '`getConfig`', function () {
            expect( getConfig( 'idAttrPrefix' ) ).toEqual( 'ctrl' );
            expect( getConfig( 'uiPrefix' ) ).toEqual( 'data-ui' );
            expect( getConfig( 'instanceAttr' ) ).toEqual( 'data-ctrl-id' );
            expect( getConfig( 'uiClassPrefix' ) ).toEqual( 'ui' );
            expect( getConfig( 'skinClassPrefix' ) ).toEqual( 'skin' );
            expect( getConfig( 'stateClassPrefix' ) ).toEqual( 'state' );
            expect( getConfig( 'uiClassControl' ) ).toEqual( 'ctrl' );
        });

        it( '`config`', function () {
            var uiPrefix = getConfig( 'uiPrefix' );

            config( { uiPrefix: 'data-abc', foo: 'bar' } );
            expect( getConfig( 'uiPrefix' ) ).toEqual( 'data-abc' );
            expect( getConfig( 'foo' ) ).toEqual( 'bar' );

            // restore
            config( { uiPrefix: uiPrefix } );
            expect( getConfig( 'uiPrefix' ) ).toEqual( uiPrefix );
        });

    });

});
