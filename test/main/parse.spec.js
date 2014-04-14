define(function() {

    var ui = require( 'saber-ui' );

    describe( 'parse', function() {

        it( 'should have method `parseAttribute`', function () {
            expect( typeof ui.parseAttribute ).toEqual( 'function' );
        });

        it( '`parseAttribute`', function () {
            var source = 'type: MyControl; id: foo; name: bar; age: 99;';
            var obj = ui.parseAttribute( source );
            expect(
                Object.prototype.toString.call( obj )
            ).toEqual( '[object Object]' );
            expect( obj.type ).toEqual( 'MyControl' );
            expect( obj.id ).toEqual( 'foo' );
            expect( obj.name ).toEqual( 'bar' );
            expect( obj.age ).toEqual( '99' );

            var source2 = 'type:   MyControl;    id: foo;name: bar';
            var obj2 = ui.parseAttribute( source2 );
            expect(
                Object.prototype.toString.call( obj2 )
            ).toEqual( '[object Object]' );
            expect( obj.type ).toEqual( 'MyControl' );
            expect( obj.id ).toEqual( 'foo' );
            expect( obj.name ).toEqual( 'bar' );
        });

    });

});
