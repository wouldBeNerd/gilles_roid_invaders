//require watch_refresh module
const watch_refresh = require('watch_refresh')
//run module, with path to app you wish to run
watch_refresh({
    dir:'./',
    port: 1337
})