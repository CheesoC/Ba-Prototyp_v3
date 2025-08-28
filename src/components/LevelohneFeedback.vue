<template>
  <div class="level-one no-feedback">
    <!-- Oberer Balken mit Level und Titel -->
    <div class="header-bar">
      <h1 class="level-title">{{ systemTitle }}</h1>
    </div>

    <!-- Mittlerer Bereich mit Aufgabe -->
    <div class="content-area">
      <!-- Task-Section oder Zusammenfassung -->
      <div v-if="!isLevelComplete" class="task-section">
        <h2 class="task-question">{{ currentQuestion.question }}</h2>
        
        <div class="answer-options">
          <button 
            v-for="(option, index) in currentQuestion.options" 
            :key="index"
            class="answer-button"
            @click="selectAnswer(index)"
          >
            {{ option }}
          </button>
        </div>
      </div>

      <!-- Zusammenfassung nach Level-Abschluss -->
      <div v-if="isLevelComplete" class="summary-section">
        
        
        <div class="summary-score">
          <h1 class="score-text">Dein Ergebnis:</h1>
          <span class="score-text">{{ correctAnswersCount }}/{{ questions.length }}</span>
        </div>
      </div>
    </div>

    <!-- Unterer Balken mit Überprüfen/Weiter-Button -->
    <div class="footer-bar">
      <!-- Überprüfen Button - nur sichtbar wenn Level nicht abgeschlossen -->
      <button 
        v-if="!isLevelComplete"
        class="check-button"
        @click="checkAnswer"
      >
        Überprüfen
      </button>
      
      <!-- Nur Weiter Button für Level Complete Screen -->
      <button
        v-if="isLevelComplete"
        @click="handleFinalContinue"
        class="continue-button final-button"
      >
        Weiter
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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

// Sample questions System ohne Feedback
const questions = ref([
  {
    id: 1,
    question: "Was ist 12 + 17?",
    options: ["27", "29", "30", "31"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Was ist 100 - 12 × 6?",
    options: ["24", "26", "28", "32"],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "Was ist 45 - 28?",
    options: ["15", "16", "17", "18"],
    correctAnswer: 2
  },
  {
    id: 4,
    question: "Was ist 14 × 3?",
    options: ["40", "41", "42", "43"],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "Was ist (5 + 3) × 4?",
    options: ["30", "32", "34", "36"],
    correctAnswer: 1
  },
    {
    id: 6,
    question: "Was ist 20 ÷ 4 + 15?",
    options: ["18", "19", "20", "21"],
    correctAnswer: 3
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
  selectedAnswer.value = index
}

const checkAnswer = () => {
  if (selectedAnswer.value !== null) {
    const isCorrect = selectedAnswer.value === currentQuestion.value.correctAnswer
    
    // Speichere das Ergebnis
    questionResults.value[currentQuestionIndex.value] = isCorrect
    
    // Gehe direkt zur nächsten Frage oder zum Ende
    if (isLastQuestion.value) {
      nextQuestion() // Level abgeschlossen
    } else {
      nextQuestion() // Nächste Frage
    }
  }
}

const nextQuestion = () => {
  currentQuestionIndex.value++
  selectedAnswer.value = null
}

// Handler für finalen Weiter-Button
const handleFinalContinue = () => {
  // Prüfe ob wir in einer Studie sind (URL enthält Parameter)
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.has('p')) {
    // In Studie: Event an parent emittieren
    emit('level-complete')
  } else {
    // Standalone: normale Navigation
    router.push('/level-3-complete')
  }
}
</script>

<style scoped>
/* All styles are now handled by shared responsive-quiz.css */
</style>
