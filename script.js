// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Floating Hearts
    function createHeart() {
        const heartsContainer = document.getElementById("heartsContainer");
        const heart = document.createElement("div");
        heart.className = "heart";
        heart.innerHTML = "❤";
        heart.style.left = Math.random() * 100 + "%";
        heart.style.animationDuration = Math.random() * 10 + 10 + "s";
        heart.style.fontSize = Math.random() * 20 + 15 + "px";
        heartsContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 15000);
    }

    // Create hearts periodically
    setInterval(createHeart, 2000);

    // Scroll reveal for timeline
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, observerOptions);

    document.querySelectorAll("[data-reveal]").forEach((el) => {
        observer.observe(el);
    });

    // Smooth scroll for hero indicator
    document.querySelector(".scroll-indicator").addEventListener("click", () => {
        document.getElementById("timeline").scrollIntoView({ behavior: "smooth" });
    });

    // Audio Banner Carousel
    const audioBannerTrack = document.getElementById("audioBannerTrack");
    const audioBannerSlides = document.querySelectorAll(".audio-banner-slide");
    const audioBannerIndicators = document.querySelectorAll(".indicator");
    const audioBannerPrev = document.getElementById("audioBannerPrev");
    const audioBannerNext = document.getElementById("audioBannerNext");
    const audioPlayBtns = document.querySelectorAll(".audio-banner-play-btn");
    
    let currentAudioSlide = 0;
    let currentPlayingAudio = null;

    function updateAudioBanner() {
        // Move track
        audioBannerTrack.style.transform = `translateX(-${currentAudioSlide * 100}%)`;
        
        // Update indicators
        audioBannerIndicators.forEach((indicator, index) => {
            indicator.classList.toggle("active", index === currentAudioSlide);
        });
        
        // Update slides
        audioBannerSlides.forEach((slide, index) => {
            slide.classList.toggle("active", index === currentAudioSlide);
        });
        
        // NÃO PARA o áudio quando muda de slide - apenas atualiza visualmente
    }

    // Audio banner navigation
    audioBannerPrev.addEventListener("click", () => {
        currentAudioSlide = (currentAudioSlide - 1 + audioBannerSlides.length) % audioBannerSlides.length;
        updateAudioBanner();
    });

    audioBannerNext.addEventListener("click", () => {
        currentAudioSlide = (currentAudioSlide + 1) % audioBannerSlides.length;
        updateAudioBanner();
    });

    // Audio play functionality - NÃO PARA quando muda de slide
    audioPlayBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const slide = this.closest('.audio-banner-slide');
            const audio = slide.querySelector('.banner-audio');
            
            // Se já está tocando este áudio, apenas pausa/despausa
            if (currentPlayingAudio === audio) {
                if (audio.paused) {
                    audio.play();
                    this.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
                } else {
                    audio.pause();
                    this.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>';
                }
            } else {
                // Para qualquer áudio que esteja tocando atualmente
                if (currentPlayingAudio && !currentPlayingAudio.paused) {
                    currentPlayingAudio.pause();
                    // Atualiza o botão do áudio anterior
                    const prevBtn = currentPlayingAudio.closest('.audio-banner-slide').querySelector('.audio-banner-play-btn');
                    if (prevBtn) {
                        prevBtn.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>';
                    }
                }
                
                // Toca o novo áudio
                audio.play();
                this.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
                currentPlayingAudio = audio;
            }
        });
    });

    // Atualiza botões quando áudio termina
    document.querySelectorAll('.banner-audio').forEach(audio => {
        audio.addEventListener('ended', function() {
            const btn = this.closest('.audio-banner-slide').querySelector('.audio-banner-play-btn');
            if (btn) {
                btn.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>';
            }
            currentPlayingAudio = null;
        });
    });

    // Auto-advance audio banner
    setInterval(() => {
        currentAudioSlide = (currentAudioSlide + 1) % audioBannerSlides.length;
        updateAudioBanner();
    }, 8000);

    /* ==============================
    GALERIA CARROSSEL
    ============================== */

    const track = document.querySelector('.gallery-track');
    const cards = document.querySelectorAll('.gallery-card');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    const dots = document.querySelectorAll('.gallery-dots span');

    let currentIndex = 0;

    function updateGallery() {
    const cardWidth = cards[0].offsetWidth + 32; // gap de 2rem
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    cards.forEach((card, index) => {
        card.classList.toggle('active', index === currentIndex);
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
    }

    nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % cards.length;
    updateGallery();
    });

    prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateGallery();
    });

    dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index;
        updateGallery();
    });
    });

    window.addEventListener('load', updateGallery);
    window.addEventListener('resize', updateGallery);

// Vídeos - modal
const videoCards = document.querySelectorAll('.video-card');
const modal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const closeModal = document.querySelector('.close-modal');

videoCards.forEach(card => {
  card.addEventListener('click', () => {
    const video = card.querySelector('video');
    const source = video.querySelector('source').src;

    modalVideo.src = source;
    modal.classList.add('active');
    modalVideo.play();
  });
});

closeModal.addEventListener('click', () => {
  modal.classList.remove('active');
  modalVideo.pause();
  modalVideo.src = '';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
    modalVideo.pause();
    modalVideo.src = '';
  }
});



    // Main Music Player - FUNCIONA INDEPENDENTEMENTE
    const audioPlayer = document.getElementById("audioPlayer");
    const playBtn = document.getElementById("playBtn");
    const progressBar = document.getElementById("progressBar");
    const progressFill = document.getElementById("progressFill");
    const currentTimeEl = document.getElementById("currentTime");
    const totalTimeEl = document.getElementById("totalTime");
    const songTitle = document.getElementById("songTitle");
    const songArtist = document.getElementById("songArtist");
    const musicPlayer = document.querySelector(".music-player");
    const albumArt = document.getElementById("albumArt");

    
    let isMainPlayerPlaying = false;

    // Playlist
    const playlist = [
        {
            src: "audio/Best Part - Daniel Caesar.mp3",
            title: "Best Part",
            artist: "Daniel Caesar",
            cover: "img/Best Part (feat_ H.E.R.).jpg"
        },
        {
            src: "audio/Get You-Daniel Caesar.mp3",
            title: "Get You",
            artist: "Daniel Caesar",
            cover: "img/Get You.jpg"
        },
        {
            src: "audio/Mirrors-Justin Timberlake.mp3",
            title: "Mirrors",
            artist: "Justin Timberlake",
            cover: "img/Mirrors.jpg"
        }
    ];


    let currentSongIndex = 0;

    // Format time
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Update progress
    function updateProgress() {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        
        // Update visualizer
        updateVisualizer();
    }

    // Update visualizer
    function updateVisualizer() {
        const bars = document.querySelectorAll('.music-visualizer .bar');
        bars.forEach(bar => {
            const randomHeight = Math.random() * 60 + 20;
            bar.style.height = `${randomHeight}%`;
        });
    }

    // Set progress on click
    progressBar.addEventListener('click', function(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        
        audioPlayer.currentTime = (clickX / width) * duration;
    });

    // Play/pause function - SOMENTE para o player principal
    function toggleMainPlayer() {
        if (isMainPlayerPlaying) {
            audioPlayer.pause();
            playBtn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>';
        } else {
            // Para qualquer áudio do banner que esteja tocando
            if (currentPlayingAudio && !currentPlayingAudio.paused) {
                currentPlayingAudio.pause();
                const bannerBtn = currentPlayingAudio.closest('.audio-banner-slide').querySelector('.audio-banner-play-btn');
                if (bannerBtn) {
                    bannerBtn.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>';
                }
                currentPlayingAudio = null;
            }
            
            // Para qualquer voice message que esteja tocando
            document.querySelectorAll('.voice-audio').forEach(audio => {
                if (!audio.paused) {
                    audio.pause();
                    const voiceBtn = audio.closest('.voice-message-card').querySelector('.voice-play-btn');
                    if (voiceBtn) {
                        voiceBtn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>';
                    }
                }
            });
            
            audioPlayer.play();
            playBtn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
        }
        isMainPlayerPlaying = !isMainPlayerPlaying;
        musicPlayer.classList.toggle("playing", isMainPlayerPlaying);
    }

    // Load song
    function loadSong(index) {
        const song = playlist[index];

        audioPlayer.src = song.src;
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;

        // 🎵 TROCA DA CAPA
        albumArt.src = song.cover;

        audioPlayer.addEventListener('loadedmetadata', () => {
            totalTimeEl.textContent = formatTime(audioPlayer.duration);
        });
    }


    // Next song
    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        if (isMainPlayerPlaying) {
            audioPlayer.play();
        }
    }

    // Previous song
    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        if (isMainPlayerPlaying) {
            audioPlayer.play();
        }
    }

    // Event listeners for music player
    playBtn.addEventListener("click", toggleMainPlayer);
    document.getElementById("nextSong").addEventListener("click", nextSong);
    document.getElementById("prevSong").addEventListener("click", prevSong);

    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextSong);

    // Initialize first song
    loadSong(currentSongIndex);

    // Voice Messages - FUNCIONAM INDEPENDENTEMENTE
    const voicePlayBtns = document.querySelectorAll('.voice-play-btn');
    let currentPlayingVoice = null;

    voicePlayBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.voice-message-card');
            const audio = card.querySelector('.voice-audio');
            const wave = card.querySelector('.voice-wave');
            
            // Se já está tocando este áudio
            if (currentPlayingVoice === audio) {
                if (audio.paused) {
                    audio.play();
                    this.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
                    wave.classList.add('playing');
                } else {
                    audio.pause();
                    this.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>';
                    wave.classList.remove('playing');
                }
            } else {
                // Para o áudio anterior
                if (currentPlayingVoice && !currentPlayingVoice.paused) {
                    currentPlayingVoice.pause();
                    const prevBtn = currentPlayingVoice.closest('.voice-message-card').querySelector('.voice-play-btn');
                    if (prevBtn) {
                        prevBtn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>';
                        const prevWave = currentPlayingVoice.closest('.voice-message-card').querySelector('.voice-wave');
                        prevWave.classList.remove('playing');
                    }
                }
                
                // Para o player principal se estiver tocando
                if (isMainPlayerPlaying && !audioPlayer.paused) {
                    audioPlayer.pause();
                    playBtn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>';
                    isMainPlayerPlaying = false;
                    musicPlayer.classList.remove("playing");
                }
                
                // Para o áudio do banner se estiver tocando
                if (currentPlayingAudio && !currentPlayingAudio.paused) {
                    currentPlayingAudio.pause();
                    const bannerBtn = currentPlayingAudio.closest('.audio-banner-slide').querySelector('.audio-banner-play-btn');
                    if (bannerBtn) {
                        bannerBtn.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>';
                    }
                    currentPlayingAudio = null;
                }
                
                // Toca o novo voice message
                audio.play();
                this.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
                wave.classList.add('playing');
                currentPlayingVoice = audio;
                
                audio.addEventListener('ended', () => {
                    this.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>';
                    wave.classList.remove('playing');
                    currentPlayingVoice = null;
                }, { once: true });
            }
        });
    });

    // Letter
    const letterEnvelope = document.getElementById("letterEnvelope");
    const letterContent = document.getElementById("letterContent");
    const letterText = document.getElementById("letterText");

    const letterMessage = `Meu amor,

Hoje completamos 2 anos juntos, e cada dia ao seu lado tem sido uma nova descoberta de felicidade. Você transformou minha vida de maneiras que eu nem imaginava serem possíveis.

Obrigado por cada sorriso, cada abraço, cada momento compartilhado. Você é meu porto seguro, minha inspiração, meu amor verdadeiro.

Que este seja apenas o começo de muitos e muitos anos ao seu lado. Te amo infinitamente!`;

    let charIndex = 0;
    let letterOpened = false;

    letterEnvelope.addEventListener("click", () => {
        if (!letterOpened) {
            letterOpened = true;
            letterEnvelope.classList.add("open");

            setTimeout(() => {
                letterEnvelope.style.display = "none";
                letterContent.classList.add("visible");
                typeWriter();
                createSpecialHearts();
            }, 800);
        }
    });

    function typeWriter() {
        if (charIndex < letterMessage.length) {
            letterText.textContent += letterMessage.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 30);
        }
    }

    function createSpecialHearts() {
        const container = document.querySelector(".floating-hearts-special");
        setInterval(() => {
            const heart = document.createElement("div");
            heart.innerHTML = "❤️";
            heart.style.position = "absolute";
            heart.style.left = Math.random() * 100 + "%";
            heart.style.bottom = "0";
            heart.style.fontSize = "30px";
            heart.style.animation = "floatUp 8s linear";
            heart.style.opacity = "0.6";
            container.appendChild(heart);

            setTimeout(() => heart.remove(), 8000);
        }, 500);
    }

    // Countdown Timer
    function updateCountdown() {
        // Data do próximo aniversário (28 de Janeiro 2026)
        const anniversaryDate = new Date('January 28, 2027 00:00:00').getTime();
        const now = new Date().getTime();
        const timeLeft = anniversaryDate - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            document.getElementById("countdownDays").textContent = days.toString().padStart(3, '0');
            document.getElementById("countdownHours").textContent = hours.toString().padStart(2, '0');
            document.getElementById("countdownMinutes").textContent = minutes.toString().padStart(2, '0');
            document.getElementById("countdownSeconds").textContent = seconds.toString().padStart(2, '0');
        } else {
            // Se já passou, mostra mensagem
            document.querySelector(".countdown-message").textContent = "Feliz 3º Aniversário! Te amo! ❤️";
            document.querySelector(".countdown-display").style.display = "none";
        }
    }

    // Update countdown every second
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call

    // Quiz
    let currentQuestion = 0;
    let correctAnswers = 0;
    const totalQuestions = 3;

    document.querySelectorAll(".quiz-option").forEach((option) => {
        option.addEventListener("click", function () {
            const isCorrect = this.dataset.correct === "true";
            const currentQuestionEl = document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`);
            const allOptions = currentQuestionEl.querySelectorAll(".quiz-option");

            // Disable all options
            allOptions.forEach((opt) => (opt.style.pointerEvents = "none"));

            if (isCorrect) {
                this.classList.add("correct");
                correctAnswers++;

                setTimeout(() => {
                    currentQuestionEl.classList.add("hidden");
                    currentQuestion++;

                    if (currentQuestion < totalQuestions) {
                        document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`).classList.remove("hidden");
                    } else {
                        if (correctAnswers === totalQuestions) {
                            document.getElementById("quizComplete").classList.remove("hidden");
                        }
                    }
                }, 1000);
            } else {
                this.classList.add("wrong");
                setTimeout(() => {
                    allOptions.forEach((opt) => {
                        opt.style.pointerEvents = "auto";
                        opt.classList.remove("wrong");
                    });
                }, 1000);
            }
        });
    });

    // Surprise Modal
    document.getElementById("surpriseBtn").addEventListener("click", () => {
        document.getElementById("surpriseModal").classList.remove("hidden");
        document.getElementById("surpriseModal").classList.add("visible");
        
        // Create fireworks
        createFireworks();
    });

    document.getElementById("closeModal").addEventListener("click", () => {
        document.getElementById("surpriseModal").classList.remove("visible");
        document.getElementById("surpriseModal").classList.add("hidden");
    });

    function createFireworks() {
        const fireworksContainer = document.querySelector('.fireworks');
        fireworksContainer.innerHTML = '';
        
        for (let i = 0; i < 15; i++) {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = `${Math.random() * 100}%`;
            firework.style.animationDelay = `${Math.random() * 2}s`;
            fireworksContainer.appendChild(firework);
        }
    }

    // Parallax effect on scroll
    window.addEventListener("scroll", () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector(".hero");
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Função para pausar TODOS os áudios (opcional - pode ser usada se quiser um botão global)
    window.pauseAllAudio = function() {
        // Pausa banner audio
        if (currentPlayingAudio && !currentPlayingAudio.paused) {
            currentPlayingAudio.pause();
            const bannerBtn = currentPlayingAudio.closest('.audio-banner-slide').querySelector('.audio-banner-play-btn');
            if (bannerBtn) {
                bannerBtn.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>';
            }
            currentPlayingAudio = null;
        }
        
        // Pausa main player
        if (isMainPlayerPlaying && !audioPlayer.paused) {
            audioPlayer.pause();
            playBtn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>';
            isMainPlayerPlaying = false;
            musicPlayer.classList.remove("playing");
        }
        
        // Pausa voice messages
        if (currentPlayingVoice && !currentPlayingVoice.paused) {
            currentPlayingVoice.pause();
            const voiceBtn = currentPlayingVoice.closest('.voice-message-card').querySelector('.voice-play-btn');
            if (voiceBtn) {
                voiceBtn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>';
                const voiceWave = currentPlayingVoice.closest('.voice-message-card').querySelector('.voice-wave');
                voiceWave.classList.remove('playing');
            }
            currentPlayingVoice = null;
        }
        
        // Pausa todos os outros voice messages
        document.querySelectorAll('.voice-audio').forEach(audio => {
            if (!audio.paused) {
                audio.pause();
                const btn = audio.closest('.voice-message-card').querySelector('.voice-play-btn');
                if (btn) {
                    btn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>';
                }
                const wave = audio.closest('.voice-message-card').querySelector('.voice-wave');
                if (wave) {
                    wave.classList.remove('playing');
                }
            }
        });
    };

    console.log("[v2] Site romântico carregado com sucesso! ❤️");
    console.log("As músicas NÃO param ao mudar de slide ou seção!");
});