const got = require('got');

const formatSong = (songData = {}) => {
    const { song = {}, duration = 0, playlist = '' } = songData,
    played = songData.played_at || songData.cued_at || 0,
    songTitle = song.title || 'Unknown Song',
    songText = song.text || 'Unknown Artist - Unknown Song',
    songArtist = song.artist || 'Unknown Artist',
    songAlbum = song.album || '',
    songGenre = song.genre || 'Pop',
    songArt = (song.art || 'https://cdn.discordapp.com/attachments/825737572051058692/876912878026883112/rave.png').replace(/159\.65\.16\.147/g, 'azuracast.itsrave.net');
    return {
        name: songTitle,
        artist: songArtist,
        album: songAlbum,
        genre: songGenre,
        art: song.art,
        text: songText,
        played,
        duration,
        playlist
    }
}

module.exports = async (req, res) => {
    const { station = 1 } = req.query;
    if (typeof station != 'number') return res.status(400).json({
        status: 'error',
        error: {
            code: 400,
            message: 'Bad request',
            full: 'Expected type number for query "station"'
        }
    });
    try {
        let { body } = await got(`https://azuracast.itsrave.net/api/nowplaying/${station}`);
        if (!body) return res.status(400).json({
            status: 'error',
            error: {
                code: 500,
                message: 'Bad request',
                full: 'Invalid body response'
            }
        });
        body = JSON.parse(body);
        const song = formatSong(body.now_playing),
        history = (body.song_history || []).map(songData => formatSong(songData)),
        next = formatSong(body.playing_next),
        dj = (body.live.is_live ? body.live.streamer_name : 'Auto DJ') || 'Auto DJ',
        listeners = body.listeners.total;
        res.json({
            status: 'success',
            song,
            history,
            next,
            listeners,
            dj
        });
    } catch (e) {
        res.status(500).json({
            status: 'error',
            error: {
                code: 500,
                message: 'Internal server error',
                full: e.toString()
            }
        });
    };
}