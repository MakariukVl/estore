'use strict';

var args = require('minimist')(process.argv.slice(2));
var actions = require('./utils/declarations');
var cwd = process.cwd();

// main function (when you can use return)
(function () {
    var cartridges = actions.getCartridges();

    // Parsing Console Attributes
    if (args.help) {
        console.log('Usage: node dev-scripts OPTION[=value]');
        console.log('  OPTIONS:');
        console.log('    compile {js|scss|fonts} - to compile separately js, scss and fonts');
        console.log('      example: node dev-scripts --compile=js');
        console.log('    build - to compile all-in-once js, scss and fonts. Avoid using with compile');
        console.log('      example: node dev-scripts --build');
        console.log('    help - call help which explain command syntax');
        console.log('      example: node dev-scripts --help');
        return;
    }
    if (args.compile === 'js') {
        actions.compileJs(cwd);
        actions.compileListJs(cartridges);
        return;
    }
    if (args.compile === 'scss') {
        actions.compileScss(cwd);
        actions.compileListScss(cartridges);
        return;
    }
    if (args.compile === 'fonts') {
        actions.compileFonts(cwd);
        return;
    }
    if (args.build && args.compile !== 'js' && args.compile !== 'scss' && args.compile !== 'fonts') {
        actions.compileJs(cwd);
        actions.compileScss(cwd);
        actions.compileFonts(cwd);
        actions.compileListJs(cartridges);
        actions.compileListScss(cartridges);
        return;
    }
    console.log();
    console.log('OPS!! Invalid usage detected ;) For more information try this:');
    console.log('  node dev-scripts --help');
}());
