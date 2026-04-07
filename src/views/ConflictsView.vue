<script setup>
import { onMounted, ref, computed, reactive } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { useConflictsStore } from '@/stores/conflicts'

const conflictsStore = useConflictsStore()

const search = ref('')
const selectedStatus = ref('')
const showModal = ref(false)
const selectedConflict = ref(null)

const editConflict = reactive({
  id: null,
  name: '',
  description: '',
  status: 'ACTIVE',
  startDate: '',
  countryIds: [],
})

const countriesMap = {
  1: 'Ucrania',
  2: 'Rusia',
  3: 'Estados Unidos',
  4: 'China',
  5: 'Israel',
  6: 'Palestina',
}

onMounted(() => {
  conflictsStore.fetchAll()
})

const filteredConflicts = computed(() => {
  return conflictsStore.items.filter((conflict) => {
    const name = conflict.name?.toLowerCase() || ''
    const description = conflict.description?.toLowerCase() || ''
    const term = search.value.toLowerCase()

    const matchesSearch =
      name.includes(term) || description.includes(term)

    const matchesStatus =
      !selectedStatus.value || conflict.status === selectedStatus.value

    return matchesSearch && matchesStatus
  })
})

const getCountryNames = (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) return 'Sin países'
  return ids.map((id) => countriesMap[id] || `ID ${id}`).join(', ')
}

const openModal = (conflict) => {
  selectedConflict.value = conflict

  editConflict.id = conflict?.id ?? null
  editConflict.name = conflict?.name ?? ''
  editConflict.description = conflict?.description ?? ''
  editConflict.status = ['ACTIVE', 'FROZEN', 'RESOLVED'].includes(conflict?.status)
    ? conflict.status
    : 'ACTIVE'
  editConflict.startDate = conflict?.startDate ?? ''
  editConflict.countryIds = Array.isArray(conflict?.countryIds)
    ? [...conflict.countryIds]
    : []

  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedConflict.value = null

  editConflict.id = null
  editConflict.name = ''
  editConflict.description = ''
  editConflict.status = 'ACTIVE'
  editConflict.startDate = ''
  editConflict.countryIds = []
}

const handleUpdate = async () => {
  const payload = {
    name: editConflict.name?.trim() || '',
    description: editConflict.description?.trim() || '',
    status: ['ACTIVE', 'FROZEN', 'RESOLVED'].includes(editConflict.status)
      ? editConflict.status
      : 'ACTIVE',
    startDate: editConflict.startDate || null,
    countryIds: Array.isArray(editConflict.countryIds)
      ? editConflict.countryIds.map(Number).filter((id) => !Number.isNaN(id))
      : [],
  }

  const ok = await conflictsStore.updateConflict(editConflict.id, payload)

  if (ok) {
    closeModal()
  }
}

const handleDelete = async () => {
  const ok = await conflictsStore.deleteConflict(editConflict.id)

  if (ok) {
    closeModal()
  }
}

const statusClass = (status) => {
  if (status === 'ACTIVE') return 'status-active'
  if (status === 'FROZEN') return 'status-frozen'
  if (status === 'RESOLVED') return 'status-resolved'
  return ''
}
</script>

<template>
  <Navbar />

  <section class="conflicts-page">
    <div class="page-header">
      <div>
        <h1>Listado de Conflictos</h1>
        <div class="stats">
          <span>Total: {{ conflictsStore.totalConflicts }}</span>
          <span>Activos: {{ conflictsStore.activeConflicts }}</span>
        </div>
      </div>
    </div>

    <div class="filters">
      <input
        v-model="search"
        placeholder="Buscar conflicto..."
      />

      <select v-model="selectedStatus">
        <option value="">Todos</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="FROZEN">FROZEN</option>
        <option value="RESOLVED">RESOLVED</option>
      </select>
    </div>

    <section id="conflicts-list">
      <h2 v-if="conflictsStore.loading">Cargando conflictos...</h2>

      <div v-else-if="conflictsStore.error" class="state-message error-box">
        Error: {{ conflictsStore.error }}
      </div>

      <div v-else-if="filteredConflicts.length === 0" class="state-message empty-box">
        No hay conflictos disponibles.
      </div>

      <table v-else class="conflicts-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>Countries</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="conflict in filteredConflicts"
            :key="conflict.id"
            @click="openModal(conflict)"
            class="clickable-row"
          >
            <td>{{ conflict.name }}</td>
            <td class="description-cell">{{ conflict.description }}</td>
            <td>
              <span class="status-badge" :class="statusClass(conflict.status)">
                {{ conflict.status }}
              </span>
            </td>
            <td>{{ conflict.startDate }}</td>
            <td>{{ getCountryNames(conflict.countryIds) }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </section>

  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-card" @click.stop>
      <h3>Edit Conflict</h3>

      <p
        v-if="conflictsStore.error && typeof conflictsStore.error === 'string'"
        class="error-message"
      >
        {{ conflictsStore.error }}
      </p>

      <label>Name</label>
      <input v-model="editConflict.name" type="text" />

      <label>Description</label>
      <textarea v-model="editConflict.description"></textarea>

      <label>Status</label>
      <select v-model="editConflict.status">
        <option value="ACTIVE">ACTIVE</option>
        <option value="FROZEN">FROZEN</option>
        <option value="RESOLVED">RESOLVED</option>
      </select>

      <label>Start Date</label>
      <input v-model="editConflict.startDate" type="date" />

      <div class="modal-actions">
        <button class="btn-update" @click="handleUpdate">Update</button>
        <button class="btn-delete" @click="handleDelete">Delete</button>
        <button class="btn-cancel" @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.filters input,
.filters select {
  padding: 10px 12px;
  border: 1px solid #d1d1d1;
  background: #ffffff;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
}

.filters input {
  flex: 1;
}

.filters input:focus,
.filters select:focus {
  border-color: #111;
}

.conflicts-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-header h1 {
  margin: 0 0 8px;
}

.stats {
  display: flex;
  gap: 16px;
  color: #475569;
  font-weight: 500;
}

.conflicts-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.conflicts-table th {
  background: #f1f5f9;
  text-align: left;
  padding: 12px;
  font-weight: 600;
  color: #0f172a;
}

.conflicts-table td {
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.conflicts-table tbody tr:last-child td {
  border-bottom: none;
}

.conflicts-table tr:hover {
  background-color: #f8fafc;
}

.clickable-row {
  cursor: pointer;
}

.description-cell {
  max-width: 420px;
}

.status-badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-frozen {
  background: #fef3c7;
  color: #92400e;
}

.status-resolved {
  background: #e2e8f0;
  color: #334155;
}

.state-message {
  margin-top: 20px;
  padding: 14px 16px;
  border-radius: 10px;
}

.error-box {
  background: #fef2f2;
  color: #b91c1c;
}

.empty-box {
  background: #f8fafc;
  color: #475569;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 999;
}

.modal-card {
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  padding: 32px;
  display: flex;
  flex-direction: column;
}

.modal-card h3 {
  margin: 0 0 28px;
  font-size: 1.6rem;
  font-weight: 600;
  color: #111111;
}

.modal-card label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #444;
  margin-bottom: 6px;
}

.modal-card input,
.modal-card textarea,
.modal-card select {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 20px;
  padding: 12px 14px;
  border: 1px solid #d1d1d1;
  background: #fff;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: border 0.15s ease;
}

.modal-card input:focus,
.modal-card textarea:focus,
.modal-card select:focus {
  border-color: #111;
}

.modal-card textarea {
  min-height: 120px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.modal-actions button {
  border: 1px solid #111;
  background: #fff;
  color: #111;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.modal-actions button:hover {
  background: #111;
  color: #fff;
}

.error-message {
  margin-bottom: 16px;
  font-size: 0.9rem;
  color: #111;
  border: 1px solid #111;
  padding: 10px;
  background: #fafafa;
}
</style>