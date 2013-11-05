define(function( require ) {

    var add = require( 'saber-ui/control' ).add;
    var remove = require( 'saber-ui/control' ).remove;
    var get = require( 'saber-ui/control' ).get;

    describe( 'control', function() {

        var ctrl1 = { id: 'ctrl1', name: '111' };
        var ctrl2 = { id: 'ctrl2', name: '222' };
        var ctrl3 = { id: 'ctrl3', name: '333' };

        add( ctrl1 );
        add( ctrl2 );

        it( '`get`', function () {
            expect( get( 'ctrl1' ) ).toEqual( ctrl1 );
            expect( get( 'ctrl2' ) ).toEqual( ctrl2 );
            expect( get( 'ctrl3' ) ).not.toBeDefined();
            expect( get( 'ctrl4' ) ).not.toBeDefined();
        });

        it( '`add`', function () {
            expect( get( 'ctrl1' ) ).toEqual( ctrl1 );
            expect( get( 'ctrl2' ) ).toEqual( ctrl2 );
            expect( get( 'ctrl3' ) ).not.toBeDefined();
            expect( get( 'ctrl4' ) ).not.toBeDefined();
        });

        it( '`remove`', function () {
            remove( ctrl2 );
            expect( get( 'ctrl2' ) ).not.toBeDefined();
        });

    });

});
