const colorData: object = {
    /*
     * Console Color
     */
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',
  
    /*
     * Default Color
     */
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[96m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
  
    /*
     * Secret Color
     */
    BgBlack: '\x1b[40m',
    BgRed: '\x1b[41m',
    BgGreen: '\x1b[42m',
    BgYellow: '\x1b[43m',
    BgBlue: '\x1b[44m',
    BgMagenta: '\x1b[45m',
    BgCyan: '\x1b[46m',
    BgWhite: '\x1b[47m',
  }
  
  function color(color: string, ...string) {
    if (!colorData[color]) {
      throw new TypeError(`There is no color ${color}`)
    } else {
      return `${colorData[color]}${string.join(' ')}${colorData['reset']}`
    }
  }
  
  export { color }