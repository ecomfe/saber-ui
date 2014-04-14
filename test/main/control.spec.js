define(function( require ) {

    var ui = require( 'saber-ui' );

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
            ui.register( MyControl );
        };

        it( 'should have method `register`', function () {
            expect( typeof ui.register ).toEqual( 'function' );
        });

        it( 'should have method `create`', function () {
            expect( typeof ui.create ).toEqual( 'function' );
        });

        it( 'should have method `get`', function () {
            expect( typeof ui.get ).toEqual( 'function' );
        });

        it( 'should have method `add`', function () {
            expect( typeof ui.add ).toEqual( 'function' );
        });

        it( 'should have method `remove`', function () {
            expect( typeof ui.remove ).toEqual( 'function' );
        });


        it( '`register`', function () {
            expect( doReg ).not.toThrow();
            expect( doReg ).toThrowError( 'MyControl is exists!' );
        });

        it( '`create`', function () {
            var control = ui.create(
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

        ui.add( ctrl1 );
        ui.add( ctrl2 );

        it( '`get`', function () {
            expect( ui.get( 'ctrl1' ) ).toEqual( ctrl1 );
            expect( ui.get( 'ctrl2' ) ).toEqual( ctrl2 );
            expect( ui.get( 'ctrl3' ) ).not.toBeDefined();
            expect( ui.get( 'ctrl4' ) ).not.toBeDefined();
        });

        it( '`add`', function () {
            expect( ui.get( 'ctrl1' ) ).toEqual( ctrl1 );
            expect( ui.get( 'ctrl2' ) ).toEqual( ctrl2 );
            expect( ui.get( 'ctrl3' ) ).not.toBeDefined();
            expect( ui.get( 'ctrl4' ) ).not.toBeDefined();
        });

        it( '`remove`', function () {
            ui.remove( ctrl2 );
            expect( ui.get( 'ctrl2' ) ).not.toBeDefined();
        });

    });

});
