var fs = require( 'fs' );
var path = require( 'path' );
var epr = require( 'edp-provider-rider' );
var riderUI = require( 'rider-ui' );
var rin = require( 'rin' );

exports.stylus = epr.stylus;

function stylusConfig( style ) {
    style.use( epr.plugin() );
    style.use( riderUI() );
}

function fileWithRin() {
    return function ( context ) {
        var input = context.content.toString( 'utf-8' );

        var mytags = fs.readFileSync( path.resolve( __dirname, 'tags.html' ), 'utf-8' );

        rin.replace( mytags.replace( /\r?\n/g, '' ) );

        context.content = rin.compile( input );
    };
}

exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname + '/../';
exports.getLocations = function () {
    return [
        {
            location: /\.html($|\?)/,
            handler: [
                file(),
                fileWithRin()
            ]
        },
        {
            location: /\.css($|\?)/,
            handler: [
                autocss({
                    stylus: {
                        use: stylusConfig
                    }
                })
            ]
        },
        {
            location: /^.*$/,
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};
