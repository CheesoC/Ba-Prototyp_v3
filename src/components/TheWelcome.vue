<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()

// Prototyp aus URL-Parameter lesen
const prototypeId = computed(() => {
  const p = route.query.p
  return p ? parseInt(p) : null
})

// Start-URL erstellen - berücksichtigt Prototyp-Parameter
const studyStartUrl = computed(() => {
  if (prototypeId.value) {
    return `/?p=${prototypeId.value}&l=1`
  }
  return '/level-1' // Fallback für direkten Zugriff ohne Parameter
})
</script>

<template>
  <div class="landing-page">
    <div class="content-container">
      <h1 class="main-title">Willkommen zur Studie</h1>
       <p class="description">
         Sie testen heute drei Varianten einer digitalen Aufgabenumgebung. 
         <br>Wir nennen sie: System 1, System 2 und System 3.
        </p>
      <div class="todo-section">
        <h2 class="todo-title">Ihre Aufgabe:</h2>
        <ul class="todo-list">
          <li>Bitte nehmen Sie sich für jedes System und den jeweiligen Fragebogen Zeit und lesen Sie alles in Ruhe durch, bevor Sie fortfahren.</li>
          <li>Bearbeiten Sie bitte alle drei Systeme mit gleicher Aufmerksamkeit – jedes System enthält 6 Aufgaben.</li>
          <li>Nach der Bearbeitung eines Systems erscheint eine neue Seite, die Ihnen die weiteren Schritte erklärt.</li>
          <li>Probieren Sie bitte auch falsche Eingaben aus, um zu sehen, wie das jeweilige System darauf reagiert. Ihre Ergebnisse fließen in keine Bewertung ein.</li>
        </ul>
        
        <div class="disclaimer">
  <h3 class="disclaimer-title">Hinweis:</h3>
  <p class="disclaimer-text">
    In dieser Studie liegt der Fokus nicht auf dem Inhalt der Aufgaben, sondern auf Ihrem persönlichen Erleben und der Nutzung des jeweiligen Systems.
  </p>
</div>
      </div>
      <div class="closing-message">
        <h3 class="closing-title">Klicken Sie unten auf den Button, um mit System 1 zu starten.</h3>
        <h2 class="closing-title">Vielen Dank für Ihre Teilnahme und viel Spaß!</h2>
      </div>
      <div class="action-area">
        <RouterLink :to="studyStartUrl" class="start-button">
          System 1 starten
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped></style>