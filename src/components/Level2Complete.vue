<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()

// Prüfe ob wir in einer Studie sind
const prototypeId = computed(() => {
  return route.query.p ? parseInt(route.query.p) : null
})

// Erstelle die richtige Weiter-URL
const nextUrl = computed(() => {
  if (prototypeId.value) {
    // In Studie: Weiter zu Level 3 mit Prototyp-Parameter
    return `/?p=${prototypeId.value}&l=3`
  } else {
    // Standalone: normale Navigation
    return '/level-3'
  }
})
</script>

<template>
  <div class="landing-page">
    <div class="content-container">
      <h1 class="main-title">System 2 abgeschlossen!</h1>
      <p class="description">
        Nur noch ein letztes System – vielen Dank für Ihre bisherige Teilnahme!
            </p>
      <div class="task-section">
        <h2 class="task-title">Was Sie jetzt tun sollen:</h2>
        <ul class="task-list">
          <li>Nachdem Sie alle Stichpunkte gelesen haben, wechseln Sie bitte bei der expliziten Aufforderung zum Fragebogen 2.</li>
          <li>Füllen Sie den Fragebogen 2 bitte vollständig bis zum gekennzeichneten Abschnitt aus und drücken Sie auf "Weiter".</li>
          <li>Sobald alle Fragen zu System 2 beantwortet sind, erhalten Sie einen Hinweis, um zu dieser Seite zurückzukehren und mit System 3 fortzufahren.</li>
          <li>Nehmen Sie sich gerne so viel Zeit wie nötig – besonders bei den Freitextfeldern freuen wir uns über ausführliche Rückmeldungen.</li>
        </ul>

        <div class="disclaimer">
          <h3 class="disclaimer-title">Hinweis:</h3>
          <p class="disclaimer-text">
            Wechseln Sie bitte JETZT zum Fragebogen 1 und beantworten Sie die Fragen zu System 1.  
            Danach kehren Sie hierher zurück, um mit System 2 fortzufahren.
          </p>
        </div>
      </div>
      <div class="closing-message">
        <h3 class="closing-title">Klicken Sie unten auf den Button, um mit System 3 zu starten.</h3>
        <h2 class="closing-title">Sie können vor dem nächsten System gerne eine kurze Pause einlegen.</h2>
      </div>
      <div class="action-area">
        <RouterLink :to="nextUrl" class="start-button">
          System 3 starten
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped></style>