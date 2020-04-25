export const getPlayerMonuments = ({ obelisks, temples, pyramids }, playerId) => {
    return [...Object.values(obelisks), ...Object.values(temples), ...Object.values(pyramids),]
        .filter(x => x.playerId === playerId)
}

export const getNeutralMonuments = ({ obelisks, temples, pyramids }) => {
    return [...Object.values(obelisks), ...Object.values(temples), ...Object.values(pyramids),]
        .filter(x => !x.playerId)
}

export const getPlayerAndNeutralMonuments = (monuments, playerId) => [...getPlayerMonuments(monuments, playerId), ...getNeutralMonuments(monuments)]

export const getPlayerFigures = ({ gods, warriors }, playerId) => {
    return [...Object.values(gods), ...Object.values(warriors)]
        .filter(x => x.playerId === playerId)
}

export const getPlayerMonumentsAndFigures = (monuments, figures, playerId) => [...getPlayerMonuments(monuments, playerId), ...getPlayerFigures(figures, playerId)]
