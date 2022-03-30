var implemented = require('./scripts');

module.exports = {
    /**
     * Compile (Transpile) cartridge JavaScript code for production using sgmf-scripts and
     * optionally package.json cartridgeName property, if cartridgePath is not defined
     * @param {?string} cartridgePath - absolute path to the cartridge
     */
    compileJs: function (cartridgePath) {
        implemented.compileJs(cartridgePath);
    },
    /**
     * Compile (Transpile) all cartridges JavaScript code for production in given list
     * using sgmf-scripts and optionally local package.json cartridgeName property,
     * if used string array that provided only path.
     * @param {(string[]|Array<{name:string,path:string}>)} cartridgeList - list of absolute cartridge paths
     */
    compileListJs: function (cartridgeList) {
        implemented.compileListJs(cartridgeList);
    },
    /**
     * Compile cartridge Styles code for production using sgmf-scripts and optionally
     * package.json cartridgeName property, if cartridgePath is not defined
     * @param {?string} cartridgePath - absolute path to the cartridge
     */
    compileScss: function (cartridgePath) {
        implemented.compileScss(cartridgePath);
    },
     /**
      * Compile all cartridges Styles code for production in given list
      * using sgmf-scripts and optionally local package.json cartridgeName property,
      * if used string array that provided only path.
      * @param {string[]} cartridgeList - list of absolute cartridge paths
      */
    compileListScss: function (cartridgeList) {
        implemented.compileListScss(cartridgeList);
    },
    /**
     * Compile cartridge Fonts for production using sgmf-scripts and ./bin/makefile.js
     * Still implemented only for SFRA cartridge.
     * @param {?string} cartridgePath - absolute path to the cartridge
     */
    compileFonts: function (cartridgePath) {
        implemented.compileFonts(cartridgePath);
    },
    /**
     * Gets cartridges absolute path array except sfra cartridges. Search looks cartridges
     * in ./cartridges directory.
     * @returns {string[]} Array of cartridge's absolute paths except sfra
     */
    getCartridgePaths: function () {
        return implemented.getCartridgePaths();
    },
    /**
     * Gets cartridges name array except sfra cartridges. Search looks cartridges
     * in ./cartridges directory.
     * @returns {string[]} Array of cartridge's names except sfra
     */
    getCartridgeList: function () {
        return implemented.getCartridgeList();
    },
    /**
     * Gets cartridges object array except sfra cartridges. Search looks cartridges
     * in ./cartridges directory.
     * @returns {Array<{name:string, path:string}>} Array of cartridge's objects except sfra
     */
    getCartridges: function () {
        return implemented.getCartridges();
    }
};
