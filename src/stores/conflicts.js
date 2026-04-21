import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/conflicts` 

export const useConflictsStore = defineStore('conflicts', () => {
  const items = ref([])
  const current = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const totalConflicts = computed(() => items.value.length)
  const activeConflicts = computed(() =>
    items.value.filter(conflict => conflict.status === 'ACTIVE').length
  )

  async function fetchAll(status) {
    loading.value = true
    error.value = null

    try {
      const query = status ? `?status=${encodeURIComponent(status)}` : ''
      const response = await fetch(`${BASE_URL}${query}`)

      if (!response.ok) {
        throw new Error('Error al cargar conflictos')
      }

      items.value = await response.json()
    } catch (err) {
      error.value = err.message || 'Error inesperado'
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id) {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${BASE_URL}/${id}`)

      if (!response.ok) {
        throw new Error('Error al cargar el conflicto')
      }

      current.value = await response.json()
    } catch (err) {
      error.value = err.message || 'Error inesperado'
    } finally {
      loading.value = false
    }
  }

  async function createConflict(payload) {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Error al crear conflicto')
      }

      const created = await response.json()
      items.value.push(created)
      return true
    } catch (err) {
      error.value = err.message || 'Error inesperado'
      return false
    }
  }

  async function updateConflict(id, payload) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Error al actualizar conflicto')
      }

      const updated = await response.json()

      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) items.value[index] = updated
      if (current.value?.id === id) current.value = updated

      return true
    } catch (err) {
      error.value = err.message || 'Error inesperado'
      return false
    }
  }

  async function deleteConflict(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar conflicto')
      }

      items.value = items.value.filter(item => item.id !== id)

      if (current.value?.id === id) {
        current.value = null
      }

      return true
    } catch (err) {
      error.value = err.message || 'Error inesperado'
      return false
    }
  }

  return {
    items,
    current,
    loading,
    error,
    totalConflicts,
    activeConflicts,
    fetchAll,
    fetchById,
    createConflict,
    updateConflict,
    deleteConflict,
  }
})