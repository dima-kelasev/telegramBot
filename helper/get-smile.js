const getSmile = (temp) => {
    if(temp < 10) {
        return '❄️'
    }
    if(temp > 10 && temp < 20) {
        return '🌤'
    } else if(temp > 20 && temp < 30) {
        return '☀️'
    } else if(temp > 30) {
        return '🔥'
    } else if(temp < 10) {
        return '❄️'
    } else {
        '⭐️'
    }

}

module.exports = { getSmile }