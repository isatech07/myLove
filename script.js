// Floating Hearts
function createHeart() {
    const heartsContainer = document.getElementById("heartsContainer")
    const heart = document.createElement("div")
    heart.className = "heart"
    heart.innerHTML = "❤"
    heart.style.left = Math.random() * 100 + "%"
    heart.style.animationDuration = Math.random() * 10 + 10 + "s"
    heart.style.fontSize = Math.random() * 20 + 15 + "px"
    heartsContainer.appendChild(heart)
  
    setTimeout(() => {
      heart.remove()
    }, 15000)
  }
  
  // Create hearts periodically
  setInterval(createHeart, 2000)
  
  // Scroll reveal for timeline
  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -100px 0px",
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)
  
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    observer.observe(el)
  })
  
  // Smooth scroll for hero indicator
  document.querySelector(".scroll-indicator").addEventListener("click", () => {
    document.getElementById("timeline").scrollIntoView({ behavior: "smooth" })
  })
  
  // Carousel
  let currentSlide = 0
  const slides = document.querySelectorAll(".carousel-slide")
  const totalSlides = slides.length
  const track = document.getElementById("carouselTrack")
  const dotsContainer = document.getElementById("carouselDots")
  
  // Create dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("div")
    dot.className = "dot"
    if (i === 0) dot.classList.add("active")
    dot.addEventListener("click", () => goToSlide(i))
    dotsContainer.appendChild(dot)
  }
  
  const dots = document.querySelectorAll(".dot")
  
  function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide)
    })
  }
  
  function goToSlide(index) {
    currentSlide = index
    updateCarousel()
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides
    updateCarousel()
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides
    updateCarousel()
  }
  
  document.getElementById("nextBtn").addEventListener("click", nextSlide)
  document.getElementById("prevBtn").addEventListener("click", prevSlide)
  
  // Auto-advance carousel
  let carouselInterval = setInterval(nextSlide, 5000)
  
  // Pause on hover
  document.querySelector(".carousel").addEventListener("mouseenter", () => {
    clearInterval(carouselInterval)
  })
  
  document.querySelector(".carousel").addEventListener("mouseleave", () => {
    carouselInterval = setInterval(nextSlide, 5000)
  })
  
  // Music Player
  const playBtn = document.getElementById("playBtn")
  const musicPlayer = document.querySelector(".music-player")
  let isPlaying = false
  
  playBtn.addEventListener("click", () => {
    isPlaying = !isPlaying
    musicPlayer.classList.toggle("playing", isPlaying)
  
    if (isPlaying) {
      playBtn.innerHTML =
        '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
    } else {
      playBtn.innerHTML =
        '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
    }
  })
  
  // Letter
  const letterEnvelope = document.getElementById("letterEnvelope")
  const letterContent = document.getElementById("letterContent")
  const letterText = document.getElementById("letterText")
  
  const letterMessage = `Meu amor,
  
  Hoje completamos 2 anos juntos, e cada dia ao seu lado tem sido uma nova descoberta de felicidade. Você transformou minha vida de maneiras que eu nem imaginava serem possíveis.
  
  Obrigado por cada sorriso, cada abraço, cada momento compartilhado. Você é meu porto seguro, minha inspiração, meu amor verdadeiro.
  
  Que este seja apenas o começo de muitos e muitos anos ao seu lado. Te amo infinitamente!`
  
  let charIndex = 0
  let letterOpened = false
  
  letterEnvelope.addEventListener("click", () => {
    if (!letterOpened) {
      letterOpened = true
      letterEnvelope.classList.add("open")
  
      setTimeout(() => {
        letterEnvelope.style.display = "none"
        letterContent.classList.add("visible")
        typeWriter()
        createSpecialHearts()
      }, 800)
    }
  })
  
  function typeWriter() {
    if (charIndex < letterMessage.length) {
      letterText.textContent += letterMessage.charAt(charIndex)
      charIndex++
      setTimeout(typeWriter, 30)
    }
  }
  
  function createSpecialHearts() {
    const container = document.querySelector(".floating-hearts-special")
    setInterval(() => {
      const heart = document.createElement("div")
      heart.innerHTML = "❤️"
      heart.style.position = "absolute"
      heart.style.left = Math.random() * 100 + "%"
      heart.style.bottom = "0"
      heart.style.fontSize = "30px"
      heart.style.animation = "floatUp 8s linear"
      heart.style.opacity = "0.6"
      container.appendChild(heart)
  
      setTimeout(() => heart.remove(), 8000)
    }, 500)
  }
  
  // Quiz
  let currentQuestion = 0
  let correctAnswers = 0
  const totalQuestions = 3
  
  document.querySelectorAll(".quiz-option").forEach((option) => {
    option.addEventListener("click", function () {
      const isCorrect = this.dataset.correct === "true"
      const currentQuestionEl = document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`)
      const allOptions = currentQuestionEl.querySelectorAll(".quiz-option")
  
      // Disable all options
      allOptions.forEach((opt) => (opt.style.pointerEvents = "none"))
  
      if (isCorrect) {
        this.classList.add("correct")
        correctAnswers++
  
        setTimeout(() => {
          currentQuestionEl.classList.add("hidden")
          currentQuestion++
  
          if (currentQuestion < totalQuestions) {
            document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`).classList.remove("hidden")
          } else {
            if (correctAnswers === totalQuestions) {
              document.getElementById("quizComplete").classList.remove("hidden")
            }
          }
        }, 1000)
      } else {
        this.classList.add("wrong")
        setTimeout(() => {
          allOptions.forEach((opt) => {
            opt.style.pointerEvents = "auto"
            opt.classList.remove("wrong")
          })
        }, 1000)
      }
    })
  })
  
  // Surprise Modal
  document.getElementById("surpriseBtn").addEventListener("click", () => {
    document.getElementById("surpriseModal").classList.add("visible")
  })
  
  document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("surpriseModal").classList.remove("visible")
  })
  
  // Parallax effect on scroll
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const hero = document.querySelector(".hero")
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`
    }
  })
  
  console.log("[v0] Site romântico carregado com sucesso! ❤️")

  