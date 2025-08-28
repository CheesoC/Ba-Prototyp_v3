<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Prüfe ob wir in einer Studie sind
const prototypeId = computed(() => {
  return route.query.p ? parseInt(route.query.p) : null
})

</script>

<template>
  <div class="landing-page">
    <div class="content-container">
      <h1 class="main-title">System 3 abgeschlossen!</h1>
      <p class="description">
        Sie haben alle drei Systeme durchlaufen – vielen Dank für Ihre Ausdauer.
      </p>
      <div class="todo-section">
        <h2 class="todo-title">Was Sie jetzt tun sollen:</h2>
        <ul class="todo-list">
          <li>Nachdem Sie alle Stichpunkte gelesen haben, wechseln Sie bitte bei der expliziten Aufforderung zum Fragebogen 3.</li>
          <li>Sobald Sie den Fragebogen 3 ausgefüllt haben, klicken Sie bitte wieder auf "Weiter", um diesmal zur Abschlussseite zu gelangen.</li>
          <li>Auf der Abschlussseite erfolgen weitere Informationen zur Studie sowie wichtige abschließende Fragen zum gesamten Studienverlauf.</li>
          <li>Füllen Sie den abschließenden Fragebogen bitte vollständig aus – und klicken Sie am Ende auf den "Senden" - Button, um ihn abzusenden.</li>
          <li>Nehmen Sie sich dabei gerne viel Zeit – vor allem Ihre freien Antworten für die Abschlussfragen sind für uns besonders wertvoll.</li>
        </ul>

        <div class="disclaimer">
          <h3 class="disclaimer-title">Hinweis:</h3>
          <p class="disclaimer-text">
          Wechseln Sie nun ein letztes Mal zurück zum Fragebogen.
          Bitte beantworten Sie dort die Fragen zu System 3 sowie die abschließenden Fragen vollständig.
          Ihre Teilnahme ist erst abgeschlossen, wenn Sie am Ende auf „Senden“ geklickt und den Fragebogen erfolgreich abgeschickt haben.
          </p>
        </div>
      </div>
      <div class="closing-message">
        <h3 class="closing-title">Vergessen Sie am Ende bitte nicht das Frageformular abzusenden!</h3>
        <h2 class="closing-title">Vielen Dank für Ihre Teilnahme!</h2>
        <h2 class="closing-title">Sie können diese Seite jetzt schließen</h2>
      </div>
    </div>
  </div>
</template>


<style scoped></style>
