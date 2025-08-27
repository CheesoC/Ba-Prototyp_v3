<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TheWelcome from '../components/TheWelcome.vue'
import Levelvisuell from '@/components/Levelvisuell.vue'
import Levelmultimodal from '@/components/Levelmultimodal.vue'
import LevelohneFeedback from '@/components/LevelohneFeedback.vue'

const route = useRoute()
const router = useRouter()

// Prototyp-Sequenzen definieren
const prototypSequences = {
  1: ['A', 'B', 'C'], // Prototyp 1: A → B → C
  2: ['A', 'C', 'B'], // Prototyp 2: A → C → B
  3: ['B', 'A', 'C'], // Prototyp 3: B → A → C
  4: ['B', 'C', 'A'], // Prototyp 4: B → C → A
  5: ['C', 'A', 'B'], // Prototyp 5: C → A → B
  6: ['C', 'B', 'A']  // Prototyp 6: C → B → A
}

// Varianten-Mapping zu Komponenten
const variantComponents = {
  'A': LevelohneFeedback, // Kein Feedback
  'B': Levelvisuell,      // Visuelles Feedback
  'C': Levelmultimodal    // Multimodales Feedback
}

// Prüfen ob Parameter für Study-Modus vorhanden sind
const hasStudyParams = computed(() => {
  return route.query.p && route.query.l
})

// Study-Parameter
const prototypeId = computed(() => {
  const id = parseInt(route.query.p) || 1
  return id >= 1 && id <= 6 ? id : 1
})

const currentLevel = computed(() => {
  const level = parseInt(route.query.l) || 1
  return level >= 1 && level <= 3 ? level : 1
})

// Aktuelle Variante basierend auf Prototyp und Level
const currentVariant = computed(() => {
  const sequence = prototypSequences[prototypeId.value]
  return sequence[currentLevel.value - 1] || 'A'
})

// Aktuelle Komponente für Study-Modus
const currentStudyComponent = computed(() => {
  return variantComponents[currentVariant.value]
})

// Key für Komponenten-Refresh
const componentKey = computed(() => {
  return `${prototypeId.value}-${currentLevel.value}-${currentVariant.value}`
})

// Navigation nach Level-Abschluss
const handleLevelComplete = () => {
  if (currentLevel.value === 1) {
    // Nach Level 1 → Level1CompleteView
    router.push(`/level-1-complete?p=${prototypeId.value}`)
  } else if (currentLevel.value === 2) {
    // Nach Level 2 → Level2CompleteView
    router.push(`/level-2-complete?p=${prototypeId.value}`)
  } else if (currentLevel.value === 3) {
    // Nach Level 3 → Level3CompleteView (Studie beendet)
    router.push(`/level-3-complete?p=${prototypeId.value}`)
  }
}
</script>

<template>
  <main>
    <!-- Study-Modus: Zeige Level-Komponente wenn p und l Parameter vorhanden -->
    <component 
      v-if="hasStudyParams"
      :is="currentStudyComponent" 
      :key="componentKey"
      @level-complete="handleLevelComplete"
    />
    <!-- Standard-Modus: Zeige Welcome-Screen -->
    <TheWelcome v-else />
  </main>
</template>
