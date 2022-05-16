// Get our elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreen = player.querySelector('.player__button[name="fullscreen"]');

// Build the functions
function togglePlay() {
    video.paused ? video.play() : video.pause();
}

function updateButton()  {
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

function skip() {
    video.currentTime += parseInt(this.dataset.skip);
}

function handleRangeUpdate() {
    video[this.name] = this.value;
}

function handleProgress() {
    progressBar.style["flex-basis"] = `${(video.currentTime/video.duration)*100}%`;    
}

function scrub(e) {
    let videoTime = e.offsetX/progress.offsetWidth;
    video.currentTime = video.duration*videoTime;
}

// Hook up to the event listeners
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener("timeupdate", handleProgress)
toggle.addEventListener('click', togglePlay);

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => {
    mousedown = true;
    video.pause();
});
progress.addEventListener('mouseup', () => {
    mousedown = false;
    video.play();
});

fullscreen.addEventListener('click', (e) => {
    video.requestFullscreen();
})



skipButtons.forEach(button => button.addEventListener('click', skip))
ranges.forEach(range => range.addEventListener('input', handleRangeUpdate));