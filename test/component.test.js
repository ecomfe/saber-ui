define(function() {

    var register = require( 'saber-ui/component' ).register;
    var create = require( 'saber-ui/component' ).create;

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

    describe( 'component', function() {

        var doReg = function () {
            register( MyControl );
        };

        it( '`register`', function () {
            expect( doReg ).not.toThrow();
            expect( doReg ).toThrow( 'MyControl is exists!' );
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

    });

});
