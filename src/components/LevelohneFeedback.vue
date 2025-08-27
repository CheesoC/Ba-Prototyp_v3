<template>
  <div class="level-one">
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
.level-one {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
}

/* Oberer Balken */
.header-bar {

  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.level-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  color: black;
  text-shadow: none;
}

/* Mittlerer Bereich */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow-y: auto;
}

.task-section {
  max-width: 800px;
  width: 90%;
  background: white;
  border-radius: 15px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.task-question {
  font-size: 3rem;
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.4;
  font-weight: 500;
}

.answer-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
}

.answer-button {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
  text-align: center;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.answer-button:active {
  transform: scale(0.9);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.answer-button.selected {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

/* Zusammenfassung */
.summary-section {
  max-width: 800px;
  width: 90%;
  background: white;
  border-radius: 15px;
  padding: 4rem 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.summary-title {
  font-size: 3.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
  line-height: 1.2;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(76, 175, 80, 0.1);
}

.summary-title-fail {
  font-size: 3.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
  line-height: 1.2;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(255, 152, 0, 0.1);
}

.summary-subtitle {
  font-size: 2.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.2;
  font-weight: 600;
}

.summary-icon {
  font-size: 4rem;
  text-align: center;
  margin: 2rem 0;
  font-weight: bold;
}

.success-icon {
  color: #4CAF50;
  text-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

.fail-icon {
  color: #f44336;
  text-shadow: 0 2px 4px rgba(244, 67, 54, 0.3);
}

.summary-score {
  margin-top: 2rem;
}

.score-text {
  font-size: 2.5rem;
  color: #333;
  font-weight: 600;
  background: #333;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Unterer Balken */
.footer-bar {
  background: white;
  border-top: 1px solid #e0e0e0;
  padding: 1.5rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.check-button {
  background: rgb(59, 59, 59);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 1rem 3rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 200px;
}

.continue-button {
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 1rem 3rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 200px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .level-title {
    font-size: 1.5rem;
  }
  
  .progress-container {
    gap: 0.8rem;
    margin-bottom: 1.5rem;
  }
  
  .progress-dot {
    width: 18px;
    height: 18px;
  }
  
  .task-section {
    padding: 1.5rem;
    margin: 1rem;
    width: calc(100% - 2rem);
  }
  
  .summary-section {
    padding: 2.5rem 1.5rem;
    margin: 1rem;
    width: calc(100% - 2rem);
  }
  
  .summary-title {
    font-size: 2.5rem;
  }
  
  .summary-title-fail {
    font-size: 2.5rem;
  }
  
  .summary-subtitle {
    font-size: 1.8rem;
  }
  
  .summary-icon {
    font-size: 3rem;
  }
  
  .score-text {
    font-size: 2rem;
  }
  
  .task-question {
    font-size: 1.6rem;
  }
  
  .answer-options {
    gap: 1rem;
    max-width: 100%;
  }
  
  .answer-button {
    padding: 1.2rem;
    font-size: 1.1rem;
    min-height: 70px;
  }
  
  .checkmark-icon {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
  
  .cross-icon {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
  
  .feedback-text {
    font-size: 1.2rem;
  }
  
  .result-section {
    max-width: calc(100% - 2rem);
    padding: 0 1rem;
  }
  
  .success-feedback {
    gap: 0.6rem;
  }
  
  .error-feedback {
    gap: 0.6rem;
  }
  
  .check-button {
    padding: 0.8rem 2rem;
    font-size: 1.1rem;
    min-width: 150px;
  }
  
  .header-bar,
  .footer-bar {
    padding: 1rem 0;
  }
}

@media (max-width: 480px) {
  .content-area {
    padding: 1rem;
  }
  
  .task-section {
    padding: 1rem;
    margin: 0.5rem;
    width: calc(100% - 1rem);
  }
  
  .summary-section {
    padding: 2rem 1rem;
    margin: 0.5rem;
    width: calc(100% - 1rem);
  }
  
  .summary-title {
    font-size: 2rem;
  }
  
  .summary-title-fail {
    font-size: 2rem;
  }
  
  .summary-subtitle {
    font-size: 1.4rem;
  }
  
  .summary-icon {
    font-size: 2.5rem;
  }
  
  .score-text {
    font-size: 1.5rem;
  }
  
  .level-title {
    font-size: 1.3rem;
  }
  
  .progress-container {
    gap: 0.6rem;
    margin-bottom: 1rem;
  }
  
  .progress-dot {
    width: 16px;
    height: 16px;
  }
  
  .task-question {
    font-size: 1.4rem;
  }
  
  .checkmark-icon {
    width: 35px;
    height: 35px;
    font-size: 1.3rem;
  }
  
  .cross-icon {
    width: 35px;
    height: 35px;
    font-size: 1.3rem;
  }
  
  .feedback-text {
    font-size: 1.1rem;
  }
  
  .result-section {
    max-width: calc(100% - 1rem);
    padding: 0 0.5rem;
    flex-direction: row;
    align-items: center;
  }
  
  .success-feedback {
    gap: 0.5rem;
  }
  
  .error-feedback {
    gap: 0.5rem;
  }
  
  .answer-options {
    gap: 0.8rem;
  }
  
  .answer-button {
    padding: 1rem;
    font-size: 1rem;
    min-height: 60px;
  }
}
</style>
