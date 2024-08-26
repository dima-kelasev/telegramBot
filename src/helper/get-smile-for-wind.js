const getSmileForWind = (speed) => {
    if(speed > 0 && speed <10) {
        return '🌕'
    } else if(speed > 10 && speed < 20) {
        return '💨'
    } else if (speed > 20) {
        return '🌪'
    } else {
        '🌬'
    }

}

module.exports = { getSmileForWind }