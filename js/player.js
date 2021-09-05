// Query selectors
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Set configuration key to store configurations and song in local storage
const PlAYER_STORAGE_KEY = "MY_PLAYER";

// Retireve HTML elements
const cd = $(".cd");
const songTitle = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const player = $(".player");
const playBtn = $(".btn-toggle-play");
const songDuration = $(".total-time");
const currentPlaytime = $(".current-time");
const progressBar = $(".progress-bar");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const shuffleBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

// Song object
const musicPlayer = {
    // Define current song and other specifications
    songIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    playedSongs: [],

    // Get previous configurations and parse JSON string to object
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},

    // Method to set configuration
    setConfig: function (key, value) {
        this.config[key] = value;
        
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    // Fixed array of songs
    songs: [
        {
            name: "So Far Away",
            singer: "Adam Christopher",
            song: "./music/song01.mp3",
            image: "./img/song01.jpg",
        },
        {
            name: "Little Do You Know",
            singer: "Alex & Sierra",
            song: "./music/song02.mp3",
            image: "./img/song02.jpg",
        },
        {
            name: "Dancing On My Own",
            singer: "Culum Scott",
            song: "./music/song03.mp3",
            image: "./img/song03.jpg",
        },
        {
            name: "Leave Out All The Rest",
            singer: "Linkin Park",
            song: "./music/song04.mp3",
            image: "./img/song04.jpg",
        },
        {
            name: "Let Her Go",
            singer: "The Passengers",
            song: "./music/song05.mp3",
            image: "./img/song05.jpg",
        },
        {
            name: "Love Yourself",
            singer: "Justin Bieber",
            song: "./music/song06.mp3",
            image: "./img/song06.jpg",
        },
        {
            name: "Memories",
            singer: "Maroon 5",
            song: "./music/song07.mp3",
            image: "./img/song07.jpg",
        },
        {
            name: "Perfect",
            singer: "Ed Sheeran",
            song: "./music/song08.mp3",
            image: "./img/song08.jpg",
        },
        {
            name: "She Will Be Loved",
            singer: "Maroon 5",
            song: "./music/song09.mp3",
            image: "./img/song09.jpg",
        },
        {
            name: "That Girl",
            singer: "Olly Murs",
            song: "./music/song10.mp3",
            image: "./img/song10.jpg",
        },
        {
            name: "Swear It Again",
            singer: "Westlife",
            song: "./music/song11.mp3",
            image: "./img/song11.jpg",
        },
        {
            name: "What Are Words",
            singer: "Chris Medina",
            song: "./music/song12.mp3",
            image: "./img/song12.jpg",
        },
        {
            name: "You Are The Reason",
            singer: "Culum Scott",
            song: "./music/song13.mp3",
            image: "./img/song13.jpg",
        },
        {
            name: "Beatiful Mistakes",
            singer: "Marron 5 ft. Megan Thee Stallion",
            song: "./music/song14.mp3",
            image: "./img/song14.jpg",
        }
    ],

    // Method to get current song
    getCurrentSong: function() {
        // Define a new property currentSong with value as current song from songs array
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.songIndex];
            }
        })
    },

    // Method to render song view
    songRender: function() {
        const songView = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.songIndex ? "active" : ""}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        })

        // Append joined song views to the html playlist
        $('.playlist').innerHTML = songView.join('');
    },

    // Method to load song on dashboard
    loadSongView: function() {
        songTitle.innerHTML = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.song;
    },
    
    // Method to handle all events
    eventHandler: function() {
        // Retrieve viewable width of cd image
        const cdWidth = cd.offsetWidth;

        // Handle cd image on scroll
        document.onscroll = function() {
            let scrollRange = window.scrollY || document.documentElement.scrollTop;
            let newCdWidth = cdWidth - scrollRange;
        
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // On click of play/pause button
        playBtn.onclick = function() {
            if (musicPlayer.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
                
        };

        // Rotate CD during 10 seconds for infinite times
        let rotateCD = cdThumb.animate(
            [{transform: 'rotate(360deg)'}], {
                duration: 10000,
                iterations: Infinity
            }
        );
        // Pause rotation at beginning
        rotateCD.pause();

        // When song plays
        audio.onplay = function() {
            musicPlayer.isPlaying = true;
            musicPlayer.setConfig("songIndex", musicPlayer.songIndex);
            player.classList.add("playing");
            rotateCD.play();
            let songToAvoid = $('.song.active');
            
            // Add to playedSongs array to avoid playing same songs on shuffle
            if (musicPlayer.isRandom && !musicPlayer.playedSongs.includes(Number(songToAvoid.dataset.index))) {
                if (musicPlayer.playedSongs.length === musicPlayer.songs.length - 1) { // songs.length must not be maximum to guarantee above if statement
                    musicPlayer.playedSongs = [];
                }
                
                musicPlayer.playedSongs.push(Number(songToAvoid.dataset.index));    
            }
        };

        // And when pauses
        audio.onpause = function() {
            musicPlayer.isPlaying = false;
            player.classList.remove("playing");
            rotateCD.pause();
        };

        // On time change, run progress bar
        audio.addEventListener("timeupdate", this.updateTime.bind(this));
        
        // Event on progress bar click to seek song
        progressBar.addEventListener("click", (e) => {
            // Get the actual width of the proogress bar and parse to integer 
            let barWidth = parseInt(window.getComputedStyle(progressBar).width);

            // Get position of click and calculate the amount of time for song to play
            const amountComplete = ((e.clientX - progressBar.getBoundingClientRect().left) / barWidth);
            audio.currentTime = (audio.duration || 0) * amountComplete;
        })

        // On click of next button
        nextBtn.onclick = function () {
            if (musicPlayer.isRandom) {
                musicPlayer.shuffleSong();
            } else {
                musicPlayer.nextSong();
            }
            audio.play();
            musicPlayer.songRender();
            musicPlayer.scrollToActiveSong();
        };

        // On click of previous button
        prevBtn.onclick = function () {
            if (musicPlayer.isRandom) {
                musicPlayer.shuffleSong();
            } else {
                musicPlayer.prevSong();
            }
            audio.play();
            musicPlayer.songRender();
            musicPlayer.scrollToActiveSong();
        };

        // On click of shuffle button
        shuffleBtn.onclick = function (e) {
            musicPlayer.isRandom = !musicPlayer.isRandom;
            musicPlayer.setConfig("isRandom", musicPlayer.isRandom);
            shuffleBtn.classList.toggle("active", musicPlayer.isRandom);
        };

        // on click of repeat button
        repeatBtn.onclick = function (e) {
            musicPlayer.isRepeat = !musicPlayer.isRepeat;
            musicPlayer.setConfig("isRepeat", musicPlayer.isRepeat);
            repeatBtn.classList.toggle("active", musicPlayer.isRepeat);
        };

        // On song end
        audio.onended = function () {
            if (musicPlayer.isRepeat) {
              audio.play();
            } else {
              nextBtn.click();
            }
        };

        // on playlist click
        playlist.onclick = function (e) {
            const songToPlay = e.target.closest(".song:not(.active)");
      
            if (songToPlay || e.target.closest(".option")) {
                // Handle when clicking on the song
                if (songToPlay) {
                    musicPlayer.songIndex = Number(songToPlay.dataset.index);
                    musicPlayer.loadSongView();
                    musicPlayer.songRender();
                    audio.play();
                }
            }
        };
    },

    // Method to play next song
    nextSong: function () {
        this.songIndex++;
        if (this.songIndex >= this.songs.length) {
            this.songIndex = 0;
        }
        this.loadSongView();
    },

    // Method to play previous song
    prevSong: function () {
        this.songIndex--;
        if (this.songIndex < 0) {
            this.songIndex = this.songs.length - 1;
        }
        this.loadSongView();
    },

    // Method to play random song
    shuffleSong: function () {
        let newIndex;

        do {
          newIndex = Math.floor(Math.random() * this.songs.length);
        } while ((newIndex === this.songIndex) || (musicPlayer.playedSongs.includes(newIndex)));
    
        this.songIndex = newIndex;
        this.loadSongView();
    },

    // Method to scroll to active song
    scrollToActiveSong: function () {
        setTimeout(() => {
          $(".song.active").scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 250);
    },

    // Method to update timer
    updateTime: function() {
        const parseTime = time => {
            let minutes = String(Math.floor(time / 60) || "").padStart("2", "0");
            let seconds = String(Math.floor(time % 60) || "").padStart("2", "0");

            return `${minutes}:${seconds}`;
        }
        
        const {currentTime, duration} = audio;

        $(".total-time").innerHTML = parseTime(duration);
        $(".current-time").innerHTML = parseTime(currentTime);
        this.updateProgressBar();
    },

    // Method to update the progress bar
    updateProgressBar: function() {
        const progressSize = (current, overall, width) => (current / overall) * width;
        const { currentTime, duration } = audio;
        const progressCtx = progressBar.getContext('2d');
        
        // Intial values to fill
        progressCtx.fillStyle = '#d3d3d3';
        progressCtx.fillRect(0, 0, progressBar.width, progressBar.height);
        
        // On progress
        progressCtx.fillStyle = '#ec1f55';
        progressCtx.fillRect(0, 0, progressSize(currentTime, duration, progressBar.width), progressBar.height);
    },

    // Method to load previous configuration
    loadConfig: function () {
        this.songIndex = this.config.songIndex || 0;
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    // Method to initiate all other methods of object
    start: function() {
        // Load previous configuration
        this.loadConfig();

        // Display corresponding active buttons
        shuffleBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);

        // Get the initial song
        this.getCurrentSong();

        // Initiliaze song list
        this.songRender();

        // Load song view on dashboard
        this.loadSongView();

        // Handle events
        this.eventHandler();
    }
}

// Call start method
musicPlayer.start();