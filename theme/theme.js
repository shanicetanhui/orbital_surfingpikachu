const theme = {
    light: {
        theme: 'light',
        color: 'black', // text 
        background: 'white',
        translucent: 'rgba(255, 255, 255, 0.7)',
        translucentOpp: 'rgba(0, 0, 0, 0.7)',
        backgroundImage: require('../assets/bg3.png')
    },
    dark: {
        theme: 'dark',
        color: 'white',
        background: 'black',
        translucent: 'rgba(0, 0, 0, 0.7)',
        backgroundImage: require('../assets/bg_dark.png') 
    }
}

export default theme;