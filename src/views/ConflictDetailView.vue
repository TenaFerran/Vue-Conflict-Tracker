<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useConflictsStore } from '@/stores/conflicts'
import ConflictCard from '@/components/ConflictCard.vue'

const route = useRoute()
const conflictsStore = useConflictsStore()

onMounted(() => {
  conflictsStore.fetchById(route.params.id)
})

const conflict = computed(() => conflictsStore.current)
</script>

<template>
  <section>
    <p v-if="conflictsStore.loading">Cargando detalle...</p>
    <p v-else-if="conflictsStore.error">{{ conflictsStore.error }}</p>

    <ConflictCard
      v-else-if="conflict"
      :conflict="conflict"
    />
  </section>
</template>