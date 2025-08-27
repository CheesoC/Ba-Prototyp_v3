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

// Sample questions for Level 1
const questions = ref([
  {
    id: 1,
    question: "Was ist 18 + 16?",
    options: ["33", "34", "35", "32"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Was ist 120 - 11 × 7?",
    options: ["47", "43", "45", "42"],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "Was ist 67 - 29?",
    options: ["36", "39", "38", "37"],
    correctAnswer: 2
  },
  {
    id: 4,
    question: "Was ist 13 × 4?",
    options: ["48", "52", "54", "56"],
    correctAnswer: 1
  },
  {
    id: 5,
    question: "Was ist (6 + 4) × 5?",
    options: ["45", "50", "55", "40"],
    correctAnswer: 1
  },
  {
    id: 6,
    question: "Was ist 36 ÷ 6 + 14?",
    options: ["18", "19", "20", "22"],
    correctAnswer: 2
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
    console.log('Level 1 abgeschlossen!')
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

// Handler für finalen Weiter-Button
const handleFinalContinue = () => {
  // Prüfe ob wir in einer Studie sind (URL enthält Parameter)
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.has('p')) {
    // In Studie: Event an parent emittieren
    emit('level-complete')
  } else {
    // Standalone: normale Navigation
    router.push('/level-1-complete')
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

/* Progress-Anzeige */
.progress-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
}

.progress-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #e0e0e0;
  border: 2px solid #ccc;
  transition: all 0.3s ease;
}

.progress-dot.current {
  background-color: #b0b0b0;
  border-color: #888;
  transform: scale(1.2);
}

.progress-dot.correct {
  background-color: #4CAF50;
  border-color: #45a049;
  transform: scale(1.1);
}

.progress-dot.incorrect {
  background-color: #f44336;
  border-color: #d32f2f;
  transform: scale(1.1);
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
  transition: all 0.3s ease;
  text-align: center;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.answer-button:hover {
  border-color: #667eea;
  background: #f8f9ff;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
}

.answer-button.selected {
  border-color: #667eea;
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.answer-button.correct-answer {
  border-color: #4CAF50;
  background: #4CAF50;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
}

.answer-button.wrong-answer {
  border-color: #f44336;
  background: #f44336;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(244, 67, 54, 0.3);
}

.answer-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
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

.result-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
}

.success-feedback {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  animation: slideInUp 0.5s ease-out;
}

.error-feedback {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  animation: slideInUp 0.5s ease-out;
}

.checkmark-icon {
  width: 50px;
  height: 50px;
  background: #4CAF50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
  animation: bounceIn 0.6s ease-out;
}

.cross-icon {
  width: 50px;
  height: 50px;
  background: #f44336;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
  animation: bounceIn 0.6s ease-out;
}

.feedback-text {
  font-size: 1.4rem;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.success-feedback .feedback-text {
  color: #4CAF50;
}

.error-feedback .feedback-text {
  color: #f44336;
}

@keyframes slideInUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
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
  transition: all 0.3s ease;
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
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 200px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.continue-button.correct {
  background: #4CAF50;
}

.continue-button.incorrect {
  background: #f44336;
}

.check-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(20, 20, 20, 0.3);
  background: rgb(39, 39, 39)
}

.continue-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(33, 150, 243, 0.3);
  background: #1976D2;
}

.continue-button.correct:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
  background: #45a049;
}

.continue-button.incorrect:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(244, 67, 54, 0.3);
  background: #d32f2f;
}

.check-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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
