console.log('Welcome!');

const stream = new Audio();
const playButton = document.getElementById('playButton');

stream.volume = 0.7;

const updateStats = async () => {
    const res = await fetch(`/api/nowplaying?_=${new Date().getTime()}`);
    const body = await res.json();
    console.log('Fetched stats', body);
    // DOM updates
    const { song } = body;
    (document.querySelectorAll('img.song-art') || []).forEach((image) => image.src = song.art.('159.65.16.147'));
    (document.querySelectorAll('.song-name') || []).forEach((el) => el.innerText = song.name);
    (document.querySelectorAll('.song-artist') || []).forEach((el) => el.innerText = song.artist);

    (document.querySelectorAll('img.next-art') || []).forEach((image) => image.src = body.next.art.('159.65.16.147'));
    (document.querySelectorAll('.next-name') || []).forEach((el) => el.innerText = body.next.name);
    (document.querySelectorAll('.next-artist') || []).forEach((el) => el.innerText = body.next.artist);

    (document.querySelectorAll('.listeners') || []).forEach((el) => el.innerText = body.listeners + ' listener' + (body.listeners == 1 ? '' : 's'));
    (document.querySelectorAll('.dj') || []).forEach((el) => el.innerText = body.dj);

    const history = body.history.map(song => {
        return `
            <div class="history-item">
                <img src="${song.art.('159.65.16.147')}">
                <div class="history-text">
                    <p class="history-name">${song.name}</p>
                    <p class="history-artist">${song.artist}</p>
                </div>
            </div>
        `;
    });

    (document.querySelector('#recentlyPlayedBox .blur-background > img') || {}).src = body.history[0].art;
    (document.querySelector('.recently-played') || {}).innerHTML = history.join('\n');
    if (document.getElementById('recentlyPlayedBox')) {
        (document.getElementById('recentlyPlayedBox') || { style: {} }).style.height = [...document.querySelectorAll('.middle-col > .box')].map((a, i, arr) => i == arr.length - 1 ? a.offsetHeight : a.offsetHeight + 20).reduce((a, b) => a + b) + 'px';
        (document.getElementById('recentlyPlayedBox') || { style: {} }).style.maxHeight = 'unset';
    };
};

updateStats();
setInterval(updateStats, 5 * 1000);

const openModal = (qs) => {
    const modal = document.querySelector(qs);
    if (!modal) return new Error('Modal does not exist!');
    modal.classList.add('open');
    return true;
};

const closeModal = (qs) => {
    const modal = document.querySelector(qs);
    if (!modal) return new Error('Modal does not exist!');
    modal.classList.remove('open');
    return true;
};

window.addEventListener('resize', () => {
    document.getElementById('recentlyPlayedBox').style.maxHeight = [...document.querySelectorAll('.middle-col > .box')].map((a, i, arr) => i == arr.length - 1 ? a.offsetHeight : a.offsetHeight + 20).reduce((a, b) => a + b) + 'px';
    // if (window.innerWidth < 992) window.location.href = '/mobile.html';
});

const togglePlayback = (cb) => {
    if (stream.paused) {
        playButton.className = 'fa fa-ellipsis-h fa-fw';
        stream.src = 'http://159.65.16.147:8000/radio.mp3';
        stream
            .play()
            .then(() => {
                playButton.className = 'fa fa-pause fa-fw';
            })
            .catch(() => !cb && togglePlayback(true));
    } else {
        playButton.className = 'fa fa-play fa-fw';
        stream.src = '';
        stream.pause();
    };
};

playButton.onclick = togglePlayback;

if (window.innerWidth < 992) window.location.href = '/mobile.html';
