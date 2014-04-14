define(function( require ) {

    var add = require( 'saber-ui/control' ).add;
    var remove = require( 'saber-ui/control' ).remove;
    var get = require( 'saber-ui/control' ).get;

    var register = require( 'saber-ui/control' ).register;
    var create = require( 'saber-ui/control' ).create;

    var MyControl = function ( options ) {
        options = options || {};
        this.id = options.id || Date.now();
        this.name = options.name;
    };
    MyControl.prototype = {
        constructor: MyControl,
        type: 'MyControl',
        render: function() { this.rendered = true; },
        dispose: function() { this.disposed = true; },
        getName: function () { return this.name; }
    };

    describe( 'control', function() {

        var doReg = function () {
            register( MyControl );
        };

        it( '`register`', function () {
            expect( doReg ).not.toThrow();
            expect( doReg ).toThrowError( 'MyControl is exists!' );
        });

        it( '`create`', function () {
            var control = create(
                'MyControl',
                { type: 'SubControl', name: 'saber' }
            );

            expect( control instanceof MyControl ).toBeTruthy();
            expect( control.constructor ).toEqual( MyControl );
            expect( control.type ).toEqual( 'MyControl' );
            expect( control.getName() ).toEqual( 'saber' );
        });



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
