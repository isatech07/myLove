/* ========================================
   MODERN ROMANTIC WEBSITE - SCRIPT.JS
   Ultra-modern interactions and animations
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all modules
  Navigation.init()
  FloatingHearts.init()
  CursorTrail.init()
  ScrollAnimations.init()
  Carousel.init()
  MusicPlayer.init()
  VideoModal.init()
  Countdown.init()
  Quiz.init()
  ResponseArea.init()
  ParallaxEffects.init()
  Petals.init()
})

/* ========================================
   NAVIGATION
======================================== */
const Navigation = {
  init() {
    this.navbar = document.querySelector(".navbar")
    this.navToggle = document.querySelector(".nav-toggle")
    this.navLinks = document.querySelector(".nav-links")

    if (!this.navbar) return

    this.bindEvents()
  },

  bindEvents() {
    // Mobile menu toggle
    this.navToggle.addEventListener("click", () => {
      this.navToggle.classList.toggle("active")
      this.navLinks.classList.toggle("active")
    })

    // Close menu on link click
    this.navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        this.navToggle.classList.remove("active")
        this.navLinks.classList.remove("active")
      })
    })

    // Scroll effect
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        this.navbar.classList.add("scrolled")
      } else {
        this.navbar.classList.remove("scrolled")
      }
    })

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault()
        const target = document.querySelector(anchor.getAttribute("href"))
        if (target) {
          const offset = 80
          const position = target.getBoundingClientRect().top + window.pageYOffset - offset
          window.scrollTo({ top: position, behavior: "smooth" })
        }
      })
    })
  },
}

/* ========================================
   FLOATING HEARTS BACKGROUND
======================================== */
const FloatingHearts = {
  container: null,

  init() {
    this.container = document.getElementById("floatingHearts")
    if (!this.container) return

    this.createHearts()
    setInterval(() => this.createHeart(), 3000)
  },

  createHearts() {
    for (let i = 0; i < 15; i++) {
      setTimeout(() => this.createHeart(), i * 500)
    }
  },

  createHeart() {
    const heart = document.createElement("div")
    heart.className = "heart"
    heart.innerHTML = '<ion-icon name="heart"></ion-icon>'

    const size = Math.random() * 20 + 10
    const left = Math.random() * 100
    const duration = Math.random() * 15 + 15
    const delay = Math.random() * 5

    heart.style.cssText = `
      left: ${left}%;
      font-size: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `

    this.container.appendChild(heart)

    setTimeout(() => heart.remove(), (duration + delay) * 1000)
  },
}

/* ========================================
   CURSOR TRAIL
======================================== */
const CursorTrail = {
  container: null,
  lastX: 0,
  lastY: 0,
  throttle: false,

  init() {
    this.container = document.getElementById("cursorTrail")
    if (!this.container || window.innerWidth < 768) return

    document.addEventListener("mousemove", (e) => this.handleMove(e))
  },

  handleMove(e) {
    if (this.throttle) return
    this.throttle = true

    setTimeout(() => {
      this.throttle = false
    }, 50)

    const distance = Math.hypot(e.clientX - this.lastX, e.clientY - this.lastY)
    if (distance < 30) return

    this.lastX = e.clientX
    this.lastY = e.clientY

    if (Math.random() > 0.7) {
      this.createHeart(e.clientX, e.clientY)
    }
  },

  createHeart(x, y) {
    const heart = document.createElement("div")
    heart.className = "cursor-heart"
    heart.innerHTML = '<ion-icon name="heart"></ion-icon>'
    heart.style.cssText = `
      left: ${x}px;
      top: ${y}px;
      font-size: ${Math.random() * 12 + 8}px;
    `

    this.container.appendChild(heart)
    setTimeout(() => heart.remove(), 1000)
  },
}

/* ========================================
   SCROLL ANIMATIONS
======================================== */
const ScrollAnimations = {
  init() {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")

          // Update timeline progress
          if (entry.target.classList.contains("timeline-item")) {
            this.updateTimelineProgress()
          }
        }
      })
    }, observerOptions)

    // Observe elements
    document.querySelectorAll(".timeline-item, .video-card, .section-header").forEach((el) => {
      observer.observe(el)
    })
  },

  updateTimelineProgress() {
    const timeline = document.querySelector(".timeline")
    const progress = document.querySelector(".timeline-progress")
    if (!timeline || !progress) return

    const items = document.querySelectorAll(".timeline-item")
    const visibleItems = document.querySelectorAll(".timeline-item.visible")
    const percentage = (visibleItems.length / items.length) * 100

    progress.style.height = `${percentage}%`
  },
}

/* ========================================
   CAROUSEL
======================================== */
const Carousel = {
  track: null,
  slides: null,
  currentIndex: 0,
  touchStartX: 0,
  touchEndX: 0,
  autoPlayInterval: null,

  init() {
    this.track = document.querySelector(".carousel-track")
    this.slides = document.querySelectorAll(".carousel-slide")
    this.prevBtn = document.querySelector(".carousel-btn.prev")
    this.nextBtn = document.querySelector(".carousel-btn.next")
    this.indicatorsContainer = document.querySelector(".carousel-indicators")
    this.currentSlideEl = document.getElementById("currentSlide")
    this.totalSlidesEl = document.getElementById("totalSlides")

    if (!this.track || !this.slides.length) return

    this.createIndicators()
    this.bindEvents()
    this.updateCounter()
    this.startAutoPlay()
  },

  createIndicators() {
    this.slides.forEach((_, index) => {
      const indicator = document.createElement("button")
      indicator.classList.add("indicator")
      if (index === 0) indicator.classList.add("active")
      indicator.setAttribute("aria-label", `Slide ${index + 1}`)
      indicator.addEventListener("click", () => this.goToSlide(index))
      this.indicatorsContainer.appendChild(indicator)
    })

    this.indicators = this.indicatorsContainer.querySelectorAll(".indicator")
  },

  bindEvents() {
    this.prevBtn.addEventListener("click", () => this.prev())
    this.nextBtn.addEventListener("click", () => this.next())

    // Touch events
    this.track.addEventListener(
      "touchstart",
      (e) => {
        this.touchStartX = e.changedTouches[0].screenX
      },
      { passive: true },
    )

    this.track.addEventListener(
      "touchend",
      (e) => {
        this.touchEndX = e.changedTouches[0].screenX
        this.handleSwipe()
      },
      { passive: true },
    )

    // Pause autoplay on hover
    const container = document.querySelector(".carousel-container")
    container.addEventListener("mouseenter", () => this.stopAutoPlay())
    container.addEventListener("mouseleave", () => this.startAutoPlay())
  },

  goToSlide(index) {
    this.currentIndex = index
    this.track.style.transform = `translateX(-${index * 100}%)`
    this.updateIndicators()
    this.updateCounter()
  },

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length
    this.goToSlide(this.currentIndex)
  },

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length
    this.goToSlide(this.currentIndex)
  },

  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentIndex)
    })
  },

  updateCounter() {
    if (this.currentSlideEl) {
      this.currentSlideEl.textContent = String(this.currentIndex + 1).padStart(2, "0")
    }
    if (this.totalSlidesEl) {
      this.totalSlidesEl.textContent = String(this.slides.length).padStart(2, "0")
    }
  },

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        this.next()
      } else {
        this.prev()
      }
    }
  },

  startAutoPlay() {
    this.stopAutoPlay()
    this.autoPlayInterval = setInterval(() => this.next(), 5000)
  },

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval)
    }
  },
}

/* ========================================
   MUSIC PLAYER
======================================== */
const MusicPlayer = {
  playlist: [
    { 
      title: "Best Part", 
      artist: "Daniel Caesar", 
      duration: "3:31", 
      cover: "/img/capa_get-you.png",
      file: "/audio/Best Part - Daniel Caesar.mp3"
    },
    { 
      title: "Get You", 
      artist: "Daniel Caesar", 
      duration: "4:29", 
      cover: "/img/capa_get-you.png",
      file: "/audio/Get You-Daniel Caesar.mp3"
    },
    { 
      title: "Mirrors", 
      artist: "Justin Timberlake", 
      duration: "4:36", 
      cover: "/img/capa_mirrors.png",
      file: "/audio/Mirrors-Justin Timberlake.mp3"
    },
    {
      title: "Afrodite",
      artist: "Delacruz e Iza",
      duration: "4:45",
      cover: "/img/capa_afrodite.png",
      file: "/audio/afrodite - Delacruz e Iza.mp3"
    },
    { 
      title: "Aliança", 
      artist: "Tribalhistas", 
      duration: "3:32", 
      cover: "/img/capa_alianças.png",
      file: "/audio/Aliança - Tribalistas.mp3.mp3"
    },
    {
      title: " A Thousand Years",
      artist: "Christina Perri",
      duration: "3:01",
      cover: "/img/capa_a-thousand-years.png",
      file: "/audio/Christina Perri - A Thousand Years.mp3"
    },
  ],
  currentTrack: 0,
  isPlaying: false,
  isShuffle: false,
  isRepeat: false,
  volume: 0.7,
  progressInterval: null,

  elements: {},

  init() {
    this.elements = {
      albumArt: document.getElementById("albumArt"),
      songTitle: document.getElementById("songTitle"),
      songArtist: document.getElementById("songArtist"),
      playBtn: document.getElementById("playBtn"),
      playIcon: document.getElementById("playIcon"),
      prevBtn: document.getElementById("prevBtn"),
      nextBtn: document.getElementById("nextBtn"),
      shuffleBtn: document.getElementById("shuffleBtn"),
      repeatBtn: document.getElementById("repeatBtn"),
      progressFill: document.getElementById("progressFill"),
      progressHandle: document.getElementById("progressHandle"),
      progressBar: document.getElementById("progressBar"),
      currentTime: document.getElementById("currentTime"),
      duration: document.getElementById("duration"),
      playlistTracks: document.getElementById("playlistTracks"),
      equalizer: document.getElementById("equalizer"),
      volumeBar: document.getElementById("volumeBar"),
      volumeFill: document.getElementById("volumeFill"),
      volumeIcon: document.getElementById("volumeIcon"),
    }

    this.audio = document.getElementById('audioPlayer')
    
    if (!this.elements.playlistTracks) return

    this.audio.volume = this.volume
    this.updateVolumeDisplay()
    this.renderPlaylist()
    this.loadTrack()
    this.bindEvents()
  },

  renderPlaylist() {
    this.elements.playlistTracks.innerHTML = this.playlist
      .map(
        (track, index) => `
      <li class="${index === this.currentTrack ? "active" : ""}" data-index="${index}">
        <span class="track-number">${index + 1}</span>
        <ion-icon name="musical-note" class="playing-indicator"></ion-icon>
        <div class="track-info">
          <span class="track-title">${track.title}</span>
          <span class="track-artist">${track.artist}</span>
        </div>
        <span class="track-duration">${track.duration}</span>
      </li>
    `
      )
      .join("")

    this.elements.playlistTracks.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => {
        this.currentTrack = Number.parseInt(li.dataset.index)
        this.loadTrack()
        this.play()
      })
    })
  },

  loadTrack() {
    const track = this.playlist[this.currentTrack]
    
    // Atualizar interface
    this.elements.albumArt.src = track.cover
    this.elements.songTitle.textContent = track.title
    this.elements.songArtist.textContent = track.artist
    this.elements.duration.textContent = track.duration
    this.elements.currentTime.textContent = "0:00"
    
    // Atualizar progresso
    this.elements.progressFill.style.width = "0%"
    this.elements.progressHandle.style.left = "0%"
    
    // Atualizar lista
    this.elements.playlistTracks.querySelectorAll("li").forEach((li, index) => {
      li.classList.toggle("active", index === this.currentTrack)
    })
    
    // Carregar áudio
    this.audio.src = track.file
    
    // Configurar evento para quando o áudio estiver pronto
    this.audio.addEventListener('loadedmetadata', () => {
      this.updateDisplay()
    }, { once: true })
  },

  updateDisplay() {
    const track = this.playlist[this.currentTrack]
    this.elements.duration.textContent = this.formatTime(this.audio.duration || 0)
  },

  play() {
    if (!this.audio.src) return
    
    this.audio.play()
      .then(() => {
        this.isPlaying = true
        this.elements.playIcon.setAttribute("name", "pause")
        this.elements.equalizer.classList.add("playing")
        this.startProgress()
      })
      .catch(error => {
        console.error("Erro ao reproduzir música:", error)
        this.isPlaying = false
        this.elements.playIcon.setAttribute("name", "play")
        this.elements.equalizer.classList.remove("playing")
      })
  },

  pause() {
    this.audio.pause()
    this.isPlaying = false
    this.elements.playIcon.setAttribute("name", "play")
    this.elements.equalizer.classList.remove("playing")
    this.stopProgress()
  },

  togglePlay() {
    if (this.isPlaying) {
      this.pause()
    } else {
      this.play()
    }
  },

  next() {
    if (this.isShuffle) {
      let newTrack
      do {
        newTrack = Math.floor(Math.random() * this.playlist.length)
      } while (newTrack === this.currentTrack && this.playlist.length > 1)
      this.currentTrack = newTrack
    } else {
      this.currentTrack = (this.currentTrack + 1) % this.playlist.length
    }
    
    this.loadTrack()
    
    // Se estava tocando antes, tocar a nova música
    if (this.isPlaying) {
      // Pequeno delay para garantir que o áudio foi carregado
      setTimeout(() => {
        this.play()
      }, 100)
    }
  },

  prev() {
    // Se já passou mais de 3 segundos da música atual, voltar ao início
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0
      this.updateProgress()
    } else {
      // Ir para música anterior
      if (this.isShuffle) {
        let newTrack
        do {
          newTrack = Math.floor(Math.random() * this.playlist.length)
        } while (newTrack === this.currentTrack && this.playlist.length > 1)
        this.currentTrack = newTrack
      } else {
        this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length
      }
      
      this.loadTrack()
      
      // Se estava tocando antes, tocar a nova música
      if (this.isPlaying) {
        setTimeout(() => {
          this.play()
        }, 100)
      }
    }
  },

  startProgress() {
    this.stopProgress()
    this.progressInterval = setInterval(() => {
      this.updateProgress()
    }, 100)
  },

  stopProgress() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval)
      this.progressInterval = null
    }
  },

  updateProgress() {
    if (!this.audio.duration || isNaN(this.audio.duration)) return
    
    const currentTime = this.audio.currentTime
    const duration = this.audio.duration
    const percent = (currentTime / duration) * 100
    
    this.elements.progressFill.style.width = `${percent}%`
    this.elements.progressHandle.style.left = `${percent}%`
    this.elements.currentTime.textContent = this.formatTime(currentTime)
    
    // Se a música terminou
    if (currentTime >= duration) {
      if (this.isRepeat) {
        this.audio.currentTime = 0
        this.play()
      } else {
        this.next()
      }
    }
  },

  seekTo(percent) {
    if (this.audio.duration && !isNaN(this.audio.duration)) {
      const time = percent * this.audio.duration
      this.audio.currentTime = time
      this.updateProgress()
    }
  },

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  },

  setVolume(percent) {
    this.volume = percent
    this.audio.volume = this.volume
    this.updateVolumeDisplay()
  },

  updateVolumeDisplay() {
    const percent = this.volume * 100
    this.elements.volumeFill.style.width = `${percent}%`
    
    if (this.volume === 0) {
      this.elements.volumeIcon.setAttribute("name", "volume-mute")
    } else if (this.volume < 0.5) {
      this.elements.volumeIcon.setAttribute("name", "volume-low")
    } else {
      this.elements.volumeIcon.setAttribute("name", "volume-high")
    }
  },

  bindEvents() {
    // Botões de controle
    this.elements.playBtn.addEventListener("click", () => this.togglePlay())
    this.elements.nextBtn.addEventListener("click", () => this.next())
    this.elements.prevBtn.addEventListener("click", () => this.prev())

    // Shuffle
    this.elements.shuffleBtn.addEventListener("click", () => {
      this.isShuffle = !this.isShuffle
      this.elements.shuffleBtn.classList.toggle("active", this.isShuffle)
    })

    // Repeat
    this.elements.repeatBtn.addEventListener("click", () => {
      this.isRepeat = !this.isRepeat
      this.elements.repeatBtn.classList.toggle("active", this.isRepeat)
    })

    // Barra de progresso
    this.elements.progressBar.addEventListener("click", (e) => {
      const rect = this.elements.progressBar.getBoundingClientRect()
      const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
      this.seekTo(percent)
    })

    // Controle de volume
    this.elements.volumeBar.addEventListener("click", (e) => {
      const rect = this.elements.volumeBar.getBoundingClientRect()
      const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
      this.setVolume(percent)
    })

    // Eventos do áudio
    this.audio.addEventListener('loadedmetadata', () => {
      this.updateDisplay()
    })

    this.audio.addEventListener('ended', () => {
      if (!this.isRepeat) {
        this.next()
      }
    })

    this.audio.addEventListener('error', (e) => {
      console.error('Erro no áudio:', e)
      this.pause()
    })

    this.audio.addEventListener('play', () => {
      this.isPlaying = true
      this.elements.playIcon.setAttribute("name", "pause")
      this.elements.equalizer.classList.add("playing")
      this.startProgress()
    })

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false
      this.elements.playIcon.setAttribute("name", "play")
      this.elements.equalizer.classList.remove("playing")
      this.stopProgress()
    })
  }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  MusicPlayer.init()
})

/* ========================================
   VIDEO MODAL
======================================== */
const VideoModal = {
  modal: null,

  init() {
    this.modal = document.getElementById("videoModal")
    this.closeBtn = document.getElementById("closeModal")
    this.videoCards = document.querySelectorAll(".video-card")

    if (!this.modal) return

    this.bindEvents()
  },

  bindEvents() {
    this.videoCards.forEach((card) => {
      card.addEventListener("click", () => this.open())
    })

    this.closeBtn.addEventListener("click", () => this.close())

    this.modal.querySelector(".modal-backdrop").addEventListener("click", () => this.close())

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close()
    })
  },

  open() {
    this.modal.classList.add("active")
    document.body.style.overflow = "hidden"
  },

  close() {
    this.modal.classList.remove("active")
    document.body.style.overflow = ""
  },
}

/* ========================================
   COUNTDOWN
======================================== */
const Countdown = {
  targetDate: new Date("January 28, 2027 00:00:00").getTime(),
  elements: {},

  init() {
    this.elements = {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds"),
    }

    if (!this.elements.days) return

    this.update()
    setInterval(() => this.update(), 1000)
    this.createParticles()
  },

  update() {
    const now = new Date().getTime()
    const distance = this.targetDate - now

    if (distance < 0) {
      this.setDigits(this.elements.days, "000")
      this.setDigits(this.elements.hours, "00")
      this.setDigits(this.elements.minutes, "00")
      this.setDigits(this.elements.seconds, "00")
      return
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)

    this.setDigits(this.elements.days, days.toString().padStart(3, "0"))
    this.setDigits(this.elements.hours, hours.toString().padStart(2, "0"))
    this.setDigits(this.elements.minutes, minutes.toString().padStart(2, "0"))
    this.setDigits(this.elements.seconds, seconds.toString().padStart(2, "0"))
  },

  setDigits(container, value) {
    const digits = container.querySelectorAll(".digit")
    const chars = value.split("")

    digits.forEach((digit, index) => {
      if (digit.textContent !== chars[index]) {
        digit.classList.add("flip")
        digit.textContent = chars[index]
        setTimeout(() => digit.classList.remove("flip"), 300)
      }
    })
  },

  createParticles() {
    const container = document.getElementById("countdownParticles")
    if (!container) return

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div")
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: rgba(232, 180, 184, ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
      `
      container.appendChild(particle)
    }
  },
}

/* ========================================
   QUIZ
======================================== */
const Quiz = {
  questions: [
    {
      question: "Onde foi nosso primeiro encontro?",
      options: ["Na praia", "Em um cafe", "No parque", "Na faculdade"],
      correct: 1,
    },
    {
      question: "Qual e a nossa musica favorita?",
      options: ["Perfect", "All of Me", "Thinking Out Loud", "A Thousand Years"],
      correct: 0,
    },
    {
      question: "Qual foi nosso primeiro filme juntos?",
      options: ["Titanic", "A Culpa e das Estrelas", "Diario de uma Paixao", "La La Land"],
      correct: 2,
    },
    {
      question: "Qual a comida favorita do casal?",
      options: ["Pizza", "Sushi", "Hamburguer", "Comida italiana"],
      correct: 3,
    },
    {
      question: "Onde foi nossa primeira viagem juntos?",
      options: ["Gramado", "Florianopolis", "Rio de Janeiro", "Buzios"],
      correct: 1,
    },
  ],
  currentQuestion: 0,
  score: 0,
  answered: false,
  elements: {},

  init() {
    this.elements = {
      questionText: document.getElementById("questionText"),
      questionNumber: document.getElementById("questionNumber"),
      options: document.getElementById("quizOptions"),
      progress: document.getElementById("quizProgress"),
      progressText: document.getElementById("quizProgressText"),
      result: document.getElementById("quizResult"),
      resultTitle: document.getElementById("resultTitle"),
      resultText: document.getElementById("resultText"),
      resultIcon: document.getElementById("resultIcon"),
      restartBtn: document.getElementById("restartQuiz"),
      questionContainer: document.getElementById("quizQuestion"),
    }

    if (!this.elements.questionText) return

    this.renderQuestion()
    this.elements.restartBtn.addEventListener("click", () => this.restart())
  },

  renderQuestion() {
    const q = this.questions[this.currentQuestion]
    this.elements.questionText.textContent = q.question
    this.elements.questionNumber.textContent = String(this.currentQuestion + 1).padStart(2, "0")

    this.elements.options.innerHTML = q.options
      .map(
        (option, index) => `
      <button class="quiz-option" data-index="${index}">
        <ion-icon name="radio-button-off-outline"></ion-icon>
        <span>${option}</span>
      </button>
    `,
      )
      .join("")

    const percent = ((this.currentQuestion + 1) / this.questions.length) * 100
    this.elements.progress.style.width = `${percent}%`
    this.elements.progressText.textContent = `Pergunta ${this.currentQuestion + 1} de ${this.questions.length}`

    this.elements.options.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => this.answer(Number.parseInt(btn.dataset.index)))
    })

    this.answered = false
  },

  answer(index) {
    if (this.answered) return
    this.answered = true

    const q = this.questions[this.currentQuestion]
    const options = this.elements.options.querySelectorAll(".quiz-option")

    options.forEach((btn, i) => {
      btn.classList.add("disabled")
      const icon = btn.querySelector("ion-icon")

      if (i === q.correct) {
        btn.classList.add("correct")
        icon.setAttribute("name", "checkmark-circle")
      } else if (i === index && i !== q.correct) {
        btn.classList.add("wrong")
        icon.setAttribute("name", "close-circle")
      }
    })

    if (index === q.correct) {
      this.score++
    }

    setTimeout(() => {
      this.currentQuestion++
      if (this.currentQuestion < this.questions.length) {
        this.renderQuestion()
      } else {
        this.showResult()
      }
    }, 1500)
  },

  showResult() {
    this.elements.questionContainer.style.display = "none"
    this.elements.result.style.display = "block"
    this.elements.result.classList.add("show")

    const percentage = (this.score / this.questions.length) * 100

    if (percentage === 100) {
      this.elements.resultIcon.setAttribute("name", "trophy")
      this.elements.resultTitle.textContent = "Perfeito!"
    } else if (percentage >= 60) {
      this.elements.resultIcon.setAttribute("name", "happy")
      this.elements.resultTitle.textContent = "Muito Bem!"
    } else {
      this.elements.resultIcon.setAttribute("name", "heart")
      this.elements.resultTitle.textContent = "Continue Tentando!"
    }

    this.elements.resultText.textContent = `Voce acertou ${this.score} de ${this.questions.length} perguntas!`
  },

  restart() {
    this.currentQuestion = 0
    this.score = 0
    this.elements.questionContainer.style.display = "block"
    this.elements.result.style.display = "none"
    this.elements.result.classList.remove("show")
    this.renderQuestion()
  },
}

/* ========================================
   RESPONSE AREA
======================================== */
const ResponseArea = {
  elements: {},

  init() {
    this.elements = {
      textarea: document.getElementById("responseText"),
      saveBtn: document.getElementById("saveResponse"),
      clearBtn: document.getElementById("clearResponse"),
      feedback: document.getElementById("responseFeedback"),
    }

    if (!this.elements.textarea) return

    // Load saved response
    const saved = localStorage.getItem("loveResponse")
    if (saved) {
      this.elements.textarea.value = saved
    }

    this.elements.saveBtn.addEventListener("click", () => this.save())
    this.elements.clearBtn.addEventListener("click", () => this.clear())
  },

  save() {
    const text = this.elements.textarea.value.trim()
    if (text) {
      localStorage.setItem("loveResponse", text)
      this.showFeedback()
    }
  },

  clear() {
    this.elements.textarea.value = ""
    localStorage.removeItem("loveResponse")
  },

  showFeedback() {
    this.elements.feedback.classList.add("show")
    setTimeout(() => {
      this.elements.feedback.classList.remove("show")
    }, 3000)
  },
}

/* ========================================
   PARALLAX EFFECTS
======================================== */
const ParallaxEffects = {
  init() {
    if (window.innerWidth < 768) return

    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset

      // Hero parallax
      const heroContent = document.querySelector(".hero-content")
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`
        heroContent.style.opacity = 1 - scrolled / 600
      }

      // Hero hearts parallax
      const heroHearts = document.querySelectorAll(".heart-float")
      heroHearts.forEach((heart, index) => {
        const speed = (index + 1) * 0.05
        heart.style.transform = `translateY(${scrolled * speed}px)`
      })
    })
  },
}

/* ========================================
   FLOATING PETALS (Carta Section)
======================================== */
const Petals = {
  container: null,

  init() {
    this.container = document.getElementById("petals")
    if (!this.container) return

    this.createPetals()
  },

  createPetals() {
    for (let i = 0; i < 20; i++) {
      const petal = document.createElement("div")
      petal.className = "petal"

      const left = Math.random() * 100
      const delay = Math.random() * 10
      const duration = Math.random() * 10 + 15
      const size = Math.random() * 15 + 10

      petal.style.cssText = `
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
      `

      this.container.appendChild(petal)
    }
  },
}
