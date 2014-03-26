var fs = require( 'fs' );
var path = require( 'path' );
var rin = require( 'rin' );

exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;
exports.getLocations = function () {
    return [
        { 
            location: /\/$/, 
            handler: home( 'index.html' )
        },
        { 
            location: /^\/redirect-local/, 
            handler: redirect('redirect-target', false) 
        },
        { 
            location: /^\/redirect-remote/, 
            handler: redirect('http://www.baidu.com', false) 
        },
        { 
            location: /^\/redirect-target/, 
            handler: content('redirectd!') 
        },
        { 
            location: '/empty', 
            handler: empty() 
        },
        { 
            location: /\.css($|\?)/, 
            handler: [
                autocss()
            ]
        },
        { 
            location: /\.less($|\?)/, 
            handler: [
                file(),
                less()
            ]
        },
        { 
            location: /\.styl($|\?)/, 
            handler: [
                file(),
                stylus()
            ]
        },
        { 
            location: /\.html($|\?)/, 
            handler: [
                file(),
                fileWithRin()
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

function fileWithRin() {
    return function ( context ) {

        var input = context.content.toString('utf-8');

        var mytags = fs.readFileSync( path.resolve( __dirname, 'tags.html' ), 'utf-8' );
        
        rin.replace(mytags.replace(/\r?\n/g, ''));

        var output = rin.compile( input );

        context.content = output;

    };
};
