define(function() {

    var ui = require( 'saber-ui' );

    var Control = function ( options ) {
        options = options || {};
        this.id = options.id || Date.now();
        this.name = options.name;
    };
    Control.prototype = {
        constructor: Control,
        type: 'Control',
        render: function() { this.rendered = true; },
        dispose: function() { this.disposed = true; },
        getName: function () { return this.name; }
    };

    ui.register( Control );

    describe( 'init', function() {

        it( 'should have method `init`', function () {
            expect( typeof ui.init ).toEqual( 'function' );
        });

        it( 'should `init` exec correct', function () {
            var wrap = document.createElement('div');
            wrap.style.display = 'none';
            document.body.appendChild( wrap );
            wrap.innerHTML = ''
                + '<i data-ui="type:Control;id:c1;name:foo;"></i>'
                + '<div><ul>'
                + '<li><i data-ui="type:Control;id:c2;name:bar"></i></li>'
                + '<li><i data-ui="type:  Control; id:c3;name: baz"></i></li>'
                + '</ul></div>'
                + '<div data-ui="type:OtherControl;id:c4;name: other;"></div>';

            var controls = ui.init( wrap );

            expect( controls[0] instanceof Control ).toBeTruthy();
            expect( controls[0].id ).toEqual( 'c1' );
            expect( controls[0].name ).toEqual( 'foo' );
            expect( controls[1] instanceof Control ).toBeTruthy();
            expect( controls[1].id ).toEqual( 'c2' );
            expect( controls[1].name ).toEqual( 'bar' );
            expect( controls[2] instanceof Control ).toBeTruthy();
            expect( controls[2].id ).toEqual( 'c3' );
            expect( controls[2].name ).toEqual( 'baz' );
            expect( controls[3] ).not.toBeDefined();
        });

    });

});
