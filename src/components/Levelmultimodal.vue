<template>
  <div class="level-one">
    <!-- Oberer Balken mit Level und Titel -->
    <div class="header-bar">
      <h1 class="level-title">{{ systemTitle }}</h1>
    </div>

    <!-- Mittlerer Bereich mit Aufgabe -->
    <div class="content-area">
      <!-- Progress-Anzeige -->
      <div class="progress-container">
        <div 
          v-for="(question, index) in questions" 
          :key="question.id"
          class="progress-dot"
          :class="{
            'current': index === currentQuestionIndex,
            'correct': questionResults[index] === true,
            'incorrect': questionResults[index] === false
          }"
        ></div>
      </div>

      <!-- Task-Section oder Zusammenfassung -->
      <div v-if="!showSummary" class="task-section">
        <h2 class="task-question">{{ currentQuestion.question }}</h2>
        
        <div class="answer-options">
          <button 
            v-for="(option, index) in currentQuestion.options" 
            :key="index"
            class="answer-button"
            :class="{ 
              'selected': selectedAnswer === index,
              'correct-answer': showResults && index === currentQuestion.correctAnswer,
              'wrong-answer': showResults && selectedAnswer === index && index !== currentQuestion.correctAnswer
            }"
            @click="selectAnswer(index)"
            :disabled="showResults"
          >
            {{ option }}
          </button>
        </div>
      </div>

      <!-- Zusammenfassung nach Level-Abschluss -->
      <div v-if="showSummary" class="summary-section">
        <!-- Erfolgreiche Bewertung (50% oder mehr richtig) -->
        <template v-if="correctAnswersCount >= questions.length / 2">
          <h1 class="summary-title">Großartig!</h1>
          <h2 class="summary-subtitle">Du hast es geschafft!</h2>
          <div class="summary-icon success-icon">✓</div>
        </template>
        
        <!-- Weniger erfolgreiche Bewertung (unter 50% richtig) -->
        <template v-else>
          <h1 class="summary-title-fail">Nicht ganz!</h1>
          <h2 class="summary-subtitle">Beim nächsten mal schaffst du es!</h2>
          <div class="summary-icon fail-icon">✕</div>
        </template>
        
        <div class="summary-score">
          <span class="score-text">{{ correctAnswersCount }}/{{ questions.length }} richtig</span>
        </div>
      </div>
    </div>

    <!-- Unterer Balken mit Überprüfen/Weiter-Button -->
    <div class="footer-bar">
      <!-- Überprüfen Button - nur sichtbar wenn Level nicht abgeschlossen -->
      <button 
        v-if="!showResults && !showSummary"
        class="check-button"
        :disabled="selectedAnswer === null"
        @click="checkAnswer"
      >
        Überprüfen
      </button>
      
      <!-- Feedback Section - nur sichtbar wenn Level nicht abgeschlossen -->
      <div v-if="showResults && !showSummary" class="result-section">
        <!-- Feedback für richtige Antworten -->
        <div v-if="questionResults[currentQuestionIndex] === true" class="success-feedback">
          <div class="checkmark-icon">✓</div>
          <span class="feedback-text">{{ currentFeedbackText }}</span>
        </div>
        
        <!-- Feedback für falsche Antworten -->
        <div v-if="questionResults[currentQuestionIndex] === false" class="error-feedback">
          <div class="cross-icon">✕</div>
          <span class="feedback-text">{{ currentFeedbackText }}</span>
        </div>
        
        <button 
          class="continue-button"
          :class="{ 
            'correct': questionResults[currentQuestionIndex] === true,
            'incorrect': questionResults[currentQuestionIndex] === false
          }"
          @click="continueToNext"
        >
          Weiter
        </button>
      </div>
      
      <!-- Nur Weiter Button für Level Complete Screen -->
      <button
        v-if="showSummary"
        @click="handleFinalContinue"
        class="continue-button final-button"
      >
        Weiter
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Event emitter für parent component
const emit = defineEmits(['level-complete'])

// System-Titel basierend auf aktueller Position in der Studie
const systemTitle = computed(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const level = urlParams.get('l')
  
  if (level) {
    return `System ${level}`
  } else {
    // Fallback für Standalone-Modus
    return 'Level - Grundlagen der Mathematik'
  }
})
// Reactive data
const selectedAnswer = ref(null)
const currentQuestionIndex = ref(0)
const questionResults = ref({}) // Speichert die Ergebnisse: true = richtig, false = falsch
const showResults = ref(false) // Zeigt ob Ergebnisse angezeigt werden sollen
const showSummary = ref(false) // Kontrolle für die Anzeige der Zusammenfassung

// Positive Feedback-Texte (Original-Arrays)
const originalPositiveFeedbackTexts = [
  "Sehr gut!",
  "Richtig!", 
  "Großartig!",
  "Perfekt!",
  "Ausgezeichnet!",
  "Weiter so!",
  "Super!",
  "Klasse!"
]

const originalNeutralFeedbackTexts = [
  "Nicht ganz!",
  "Fast!",
  "Schade, beim nächsten Mal!",
  "Das war knapp!",
  "Andere Antwort!",
  "Probiere weiter!",
  "Nicht entmutigen lassen!",
  "Schau nochmal genau hin!"
]

// Feedback-Texte für das aktuelle Level (werden reduziert)
const positiveFeedbackTexts = ref([...originalPositiveFeedbackTexts])
const neutralFeedbackTexts = ref([...originalNeutralFeedbackTexts])

const currentFeedbackText = ref("")

// Audio-Funktionen für multimodales Feedback
const playClickSound = () => {
  const audio = new Audio('/sounds/click.mp3') // Pfad zu Ihrer Klick-Audiodatei
  audio.volume = 0.05 // Leise für subtilen Effekt
  audio.play().catch(e => console.log('Audio play failed:', e))
}

const playCorrectSound = () => {
  const audio = new Audio('/sounds/correct.mp3') // Pfad zu Ihrer "richtig"-Audiodatei
  audio.volume = 0.1
  audio.play().catch(e => console.log('Audio play failed:', e))
}

const playIncorrectSound = () => {
  const audio = new Audio('/sounds/incorrect.mp3') // Pfad zu Ihrer "falsch"-Audiodatei
  audio.volume = 0.1
  audio.play().catch(e => console.log('Audio play failed:', e))
}

const playLevelCompleteSound = (isSuccess) => {
  const soundFile = isSuccess ? '/sounds/levelsucess.mp3' : '/sounds/levelfail.mp3'
  const audio = new Audio(soundFile) // Je nach Erfolg verschiedene Audiodateien
  audio.volume = 0.1
  audio.play().catch(e => console.log('Audio play failed:', e))
}

// Sample questions for Level 2
const questions = ref([
  {
    id: 1,
    question: "Was ist 23 + 19?",
    options: ["41", "42", "43", "40"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Was ist 90 - 8 × 9?",
    options: ["18", "16", "20", "22"],
    correctAnswer: 0
  },
  {
    id: 3,
    question: "Was ist 58 - 27?",
    options: ["29", "31", "32", "30"],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "Was ist 16 × 5?",
    options: ["75", "80", "85", "70"],
    correctAnswer: 1
  },
  {
    id: 5,
    question: "Was ist (7 + 6) × 3?",
    options: ["36", "39", "42", "33"],
    correctAnswer: 1
  },
  {
    id: 6,
    question: "Was ist 81 ÷ 9 + 12?",
    options: ["20", "21", "22", "19"],
    correctAnswer: 1
  },
]);

// Computed
const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value]
})

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === questions.value.length - 1
})

const isLevelComplete = computed(() => {
  return Object.keys(questionResults.value).length === questions.value.length
})

const correctAnswersCount = computed(() => {
  return Object.values(questionResults.value).filter(result => result === true).length
})

// Methods
const selectAnswer = (index) => {
  playClickSound() // Klick-Sound beim Auswählen einer Antwort
  selectedAnswer.value = index
}

const checkAnswer = () => {
  if (selectedAnswer.value !== null) {
    const isCorrect = selectedAnswer.value === currentQuestion.value.correctAnswer
    
    // Speichere das Ergebnis
    questionResults.value[currentQuestionIndex.value] = isCorrect
    
    // Audio-Feedback basierend auf Antwort
    if (isCorrect) {
      playCorrectSound() // Hoher positiver Klang für richtige Antwort
    } else {
      playIncorrectSound() // Tieferer Klang für falsche Antwort
    }
    
    // Wähle passenden Feedback-Text ohne Wiederholung
    if (isCorrect) {
      if (positiveFeedbackTexts.value.length > 0) {
        const randomIndex = Math.floor(Math.random() * positiveFeedbackTexts.value.length)
        currentFeedbackText.value = positiveFeedbackTexts.value[randomIndex]
        // Entferne den verwendeten Text, damit er nicht nochmal verwendet wird
        positiveFeedbackTexts.value.splice(randomIndex, 1)
      } else {
        // Fallback falls alle Texte aufgebraucht sind
        currentFeedbackText.value = "Richtig!"
      }
    } else {
      if (neutralFeedbackTexts.value.length > 0) {
        const randomIndex = Math.floor(Math.random() * neutralFeedbackTexts.value.length)
        currentFeedbackText.value = neutralFeedbackTexts.value[randomIndex]
        // Entferne den verwendeten Text, damit er nicht nochmal verwendet wird
        neutralFeedbackTexts.value.splice(randomIndex, 1)
      } else {
        // Fallback falls alle Texte aufgebraucht sind
        currentFeedbackText.value = "Nicht ganz!"
      }
    }
    
    // Zeige die Ergebnisse (Farben) an
    showResults.value = true
    
    // Hier könnte Feedback angezeigt werden
    console.log('Antwort:', isCorrect ? 'Richtig!' : 'Falsch!')
  }
}

const continueToNext = () => {
  if (isLastQuestion.value) {
    // Nach der letzten Frage - gehe zur nächsten "Frage" (die eigentlich die Zusammenfassung triggert)
    nextQuestion()
    // Prüfe ob alle Fragen beantwortet wurden und zeige dann die Zusammenfassung
    if (Object.keys(questionResults.value).length === questions.value.length) {
      showSummary.value = true
    }
    console.log('System abgeschlossen!')
  } else {
    // Nächste Frage
    nextQuestion()
  }
}

const nextQuestion = () => {
  currentQuestionIndex.value++
  selectedAnswer.value = null
  showResults.value = false // Reset für die nächste Frage
}

// Watcher für Level-Abschluss Audio-Feedback
watch(showSummary, (newValue) => {
  if (newValue) {
    // Level ist abgeschlossen - spiele entsprechenden Sound
    const isSuccess = correctAnswersCount.value >= questions.value.length / 2
    playLevelCompleteSound(isSuccess)
  }
})

// Handler für finalen Weiter-Button
const handleFinalContinue = () => {
  // Prüfe ob wir in einer Studie sind (URL enthält Parameter)
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.has('p')) {
    // In Studie: Event an parent emittieren
    emit('level-complete')
  } else {
    // Standalone: normale Navigation
    router.push('/level-2-complete')
  }
}
</script>

<style scoped>
/* All styles are now handled by shared responsive-quiz.css */
</style>
