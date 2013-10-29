define(function() {

    var ui = require( 'saber-ui' );

    describe( 'ui', function() {

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


        describe( 'config', function() {

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

        describe( 'component', function() {

            var doReg = function () {
                ui.register( MyControl );
            };

            it( '`register`', function () {
                expect( doReg ).not.toThrow();
                expect( doReg ).toThrow( 'MyControl is exists!' );
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

        });

        describe( 'instance', function() {

            var ctrl1 = new MyControl({ id: 'ctrl1', name: '111' });
            var ctrl2 = new MyControl({ id: 'ctrl2', name: '222' });
            var ctrl3 = new MyControl({ id: 'ctrl3', name: '333' });

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

        describe( 'structure', function() {

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

            it( '`init`', function () {
                var wrap = document.createElement('div');
                wrap.style.display = 'none';
                document.body.appendChild( wrap );
                wrap.innerHTML = ''
                    + '<i data-ui="type:MyControl;id:c1;name:foo;"></i>'
                    + '<div><ul>'
                    + '<li><i data-ui="type:MyControl;id:c2;name:bar"></i></li>'
                    + '<li><i data-ui="type:  MyControl; id:c3;name: baz"></i></li>'
                    + '</ul></div>';

                var controls = ui.init( wrap );

                expect( controls[0] instanceof MyControl ).toBeTruthy();
                expect( controls[0].id ).toEqual( 'c1' );
                expect( controls[0].name ).toEqual( 'foo' );
                expect( controls[1] instanceof MyControl ).toBeTruthy();
                expect( controls[1].id ).toEqual( 'c2' );
                expect( controls[1].name ).toEqual( 'bar' );
                expect( controls[2] instanceof MyControl ).toBeTruthy();
                expect( controls[2].id ).toEqual( 'c3' );
                expect( controls[2].name ).toEqual( 'baz' );
            });

        });

    });

});
