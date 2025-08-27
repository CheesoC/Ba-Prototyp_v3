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
            Wechseln Sie bitte JETZT zum Fragebogen 2 und beantworten Sie die Fragen zu System 2.  
            Sobald Sie fertig sind, kehren Sie hierher zurück, um mit System 3 fortzufahren.
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

<style scoped>
.landing-page {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #4a66e2 0%, #7b23d3 100%);
  position: fixed;
  top: 0;
  left: 0;
}

.content-container {
  text-align: center;
  max-width: 800px;
  width: 100%;
  padding: 1.5rem 2rem;
  color: white;
}

.main-title {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.8rem;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
}

.description {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  margin-bottom: 1.2rem;
  font-weight: 400;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
}

.task-section {
  margin-bottom: 1.2rem;
}

.task-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.6rem;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
}

.sub-note {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  margin-bottom: 1.2rem;
  font-weight: 400;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  display: inline-block;
  max-width: 700px;
}

.task-list li {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.4;
  padding: 0.4rem 0;
  position: relative;
  padding-left: 2rem;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 0.2rem;
  text-align: justify;
}

.task-list li::before {
  content: "✓";
  color: #4CAF50;
  font-weight: bold;
  position: absolute;
  left: 0;
  font-size: 1.4rem;
  background: white;
  border-radius: 50%;
  width: 1.3rem;
  height: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.closing-message {
  margin-bottom: 1rem;
  margin-top: 0.8rem;
}

.closing-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: white;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
  margin-bottom: 0.6rem;
}

.action-area {
  margin-top: 2rem;
}

.start-button {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 50px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.start-button:hover {
  transform: translateY(-3px);
  background: white;
  color: #667eea;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.start-button:active {
  transform: translateY(-1px);
}

.disclaimer {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 15px;
  padding: 1rem;
  margin-top: 1.2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.disclaimer-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #FFD700;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.disclaimer-text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.5;
  margin: 0;
  font-weight: 500;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
  text-align: justify;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }
  
  .description {
    font-size: 1.2rem;
  }
  
  .task-title {
    font-size: 1.3rem;
  }
  
  .task-list li {
    font-size: 1.2rem;
  }
  
  .closing-title {
    font-size: 1.4rem;
  }
  
  .content-container {
    padding: 2rem 1.5rem;
  }
  
  .disclaimer {
    padding: 1.2rem;
  }
  
  .disclaimer-title {
    font-size: 1.2rem;
  }
  
  .disclaimer-text {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2rem;
  }
  
  .description {
    font-size: 1.1rem;
  }
  
  .task-title {
    font-size: 1.2rem;
  }
  
  .task-list li {
    font-size: 1.1rem;
  }
  
  .closing-title {
    font-size: 1.3rem;
  }
  
  .start-button {
    padding: 0.8rem 2rem;
    font-size: 1rem;
  }
  
  .content-container {
    padding: 1.5rem 1rem;
  }
  
  .disclaimer {
    padding: 1rem;
  }
  
  .disclaimer-title {
    font-size: 1.1rem;
  }
  
  .disclaimer-text {
    font-size: 1rem;
  }
}
</style>