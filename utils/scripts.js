var shell = require('shelljs');
var path = require('path');
var cwd = process.cwd();
var cmdPrefix = '@dev-scripts$';

module.exports = {
    compileJs: function (cartridgePath) {
        if (cartridgePath) {
            shell.cd(cartridgePath);
        }
        console.log();
        console.log(cmdPrefix, shell.pwd().stdout);
        console.log('  | sgmf-scripts --compile js');
        console.log('  | JS compilation starting...');
        console.log();
        shell.exec('sgmf-scripts --compile js');
    },

    compileListJs: function (cartridgeList) {
        var listPaths = cartridgeList || [];
        listPaths.forEach(function (cartridgeData) {
            var cartridgePath = Object.prototype.hasOwnProperty.call(cartridgeData, 'path')
                ? cartridgeData.path
                : cartridgeData;
            var command = Object.prototype.hasOwnProperty.call(cartridgeData, 'name')
                ? 'sgmf-scripts --compile js --cartridgeName ' + cartridgeData.name
                : 'sgmf-scripts --compile js';
            shell.cd(cartridgePath);

            console.log();
            console.log(cmdPrefix, shell.pwd().stdout);
            console.log('  |', command);
            console.log('  | JS compilation starting...');
            console.log();

            shell.exec(command);
        });
    },

    compileScss: function (cartridgePath) {
        if (cartridgePath) {
            shell.cd(cartridgePath);
        }
        console.log();
        console.log(cmdPrefix, shell.pwd().stdout);
        console.log('  | sgmf-scripts --compile css');
        console.log('  | Scss compilation starting...');
        console.log();
        shell.exec('sgmf-scripts --compile css');
    },

    compileListScss: function (cartridgeList) {
        var listPaths = cartridgeList || [];
        listPaths.forEach(function (cartridgeData) {
            var cartridgePath = Object.prototype.hasOwnProperty.call(cartridgeData, 'path')
                ? cartridgeData.path
                : cartridgeData;
            var command = Object.prototype.hasOwnProperty.call(cartridgeData, 'name')
                ? 'sgmf-scripts --compile css --cartridgeName ' + cartridgeData.name
                : 'sgmf-scripts --compile css';
            shell.cd(cartridgePath);

            console.log();
            console.log(cmdPrefix, shell.pwd().stdout);
            console.log('  |', command);
            console.log('  | Scss compilation starting...');
            console.log();

            shell.exec(command);
        });
    },

    compileFonts: function (cartridgePath) {
        if (cartridgePath) {
            shell.cd(cartridgePath);
        }
        console.log();
        console.log(cmdPrefix, shell.pwd().stdout);
        console.log('  | node bin/Makefile compileFonts');
        console.log('  | Fonts compilation starting...');
        console.log();
        shell.exec('node bin/Makefile compileFonts');
    },

    getCartridgePaths: function () {
        var shellDirs = shell.ls(path.join(cwd, './cartridges'));

        return Array.from(shellDirs)
            .filter(function (dirPath) {
                return (
                   dirPath !== 'app_storefront_base' &&
                   dirPath !== 'bm_app_storefront_base' &&
                   dirPath !== 'modules'
                );
            })
            .map(function (cartridgePath) {
                return path.join(cwd, './cartridges', './' + cartridgePath);
            });
    },

    getCartridgeList: function () {
        var shellDirs = shell.ls(path.join(cwd, './cartridges'));

        return Array.from(shellDirs)
            .filter(function (dirPath) {
                return (
                   dirPath !== 'app_storefront_base' &&
                   dirPath !== 'bm_app_storefront_base' &&
                   dirPath !== 'modules'
                );
            });
    },

    getCartridges: function () {
        var shellDirs = shell.ls(path.join(cwd, './cartridges'));

        return Array.from(shellDirs)
            .filter(function (dirPath) {
                return (
                   dirPath !== 'app_storefront_base' &&
                   dirPath !== 'bm_app_storefront_base' &&
                   dirPath !== 'modules'
                );
            })
            .map(function (cartridgeName) {
                return ({
                    name: cartridgeName,
                    path: path.join(cwd, './cartridges', './' + cartridgeName)
                });
            });
    }
};
