<script setup>
import { computed } from 'vue'

const props = defineProps({
  conflict: {
    type: Object,
    required: true
  }
})

const formattedStatus = computed(() => {
  if (!props.conflict) return ''
  if (props.conflict.status === 'ACTIVE') return 'Activo'
  if (props.conflict.status === 'FROZEN') return 'Congelado'
  return 'Resuelto'
})
</script>

<template>
  <div class="detail-card">
    <h1>{{ conflict.name }}</h1>
    <p><strong>Estado:</strong> {{ formattedStatus }}</p>
    <p><strong>Fecha de inicio:</strong> {{ conflict.startDate }}</p>
    <p><strong>Descripción:</strong> {{ conflict.description }}</p>
    <p><strong>ID:</strong> {{ conflict.id }}</p>
  </div>
</template>

<style scoped>
.detail-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.detail-card h1 {
  margin-top: 0;
}

.detail-card p {
  margin: 10px 0;
}
</style>