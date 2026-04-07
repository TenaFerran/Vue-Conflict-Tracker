<script setup>
import { reactive } from 'vue'
import { useConflictsStore } from '@/stores/conflicts'
import Navbar from './Navbar.vue'

const conflictsStore = useConflictsStore()

const availableCountries = [
  { id: 1, name: 'Ucrania' },
  { id: 2, name: 'Rusia' },
  { id: 3, name: 'Estados Unidos' },
  { id: 4, name: 'China' },
  { id: 5, name: 'Israel' },
  { id: 6, name: 'Palestina' },
]

const newConflict = reactive({
  name: '',
  description: '',
  status: 'ACTIVE',
  startDate: '',
  countryIds: [],
})

const resetForm = () => {
  newConflict.name = ''
  newConflict.description = ''
  newConflict.status = 'ACTIVE'
  newConflict.startDate = ''
  newConflict.countryIds = []
}

const createNewConflict = async () => {
  const payload = {
    name: newConflict.name.trim(),
    description: newConflict.description.trim(),
    status: newConflict.status,
    startDate: newConflict.startDate || null,
    countryIds: newConflict.countryIds.map(Number),
  }

  const ok = await conflictsStore.createConflict(payload)

  if (ok) {
    resetForm()
    await conflictsStore.fetchAll()
  }
}
</script>

<template>
  <Navbar />
  <form class="conflict-form" @submit.prevent="createNewConflict">
    <div class="form-header">
      <h3>Crear conflicto</h3>
      <p>Añade un nuevo conflicto a la lista</p>
    </div>

    <div class="form-grid">
      <div class="field field-full">
        <label for="name">Nombre</label>
        <input
          id="name"
          v-model="newConflict.name"
          type="text"
          placeholder="Guerra Ucrania-Rusia"
          required
        />
      </div>

      <div class="field field-full">
        <label for="description">Descripción</label>
        <textarea
          id="description"
          v-model="newConflict.description"
          placeholder="Guerra iniciada en 2022 entre Ucrania y Rusia..."
          required
        />
      </div>

      <div class="field">
        <label for="status">Status</label>
        <select id="status" v-model="newConflict.status">
          <option value="ACTIVE">ACTIVE</option>
          <option value="FROZEN">FROZEN</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
      </div>

      <div class="field">
        <label for="startDate">Fecha de inicio</label>
        <input
          id="startDate"
          v-model="newConflict.startDate"
          type="date"
        />
      </div>

      <div class="field field-full">
        <label>Paises</label>
        <div class="countries-list">
          <label
            v-for="country in availableCountries"
            :key="country.id"
            class="country-option"
          >
            <input
              type="checkbox"
              :value="country.id"
              v-model="newConflict.countryIds"
            />
            <span>{{ country.name }}</span>
          </label>
        </div>
      </div>
    </div>

    <p
      v-if="conflictsStore.error && typeof conflictsStore.error === 'string'"
      class="error-message"
    >
      {{ conflictsStore.error }}
    </p>

    <div class="form-actions">
      <button type="submit">Create conflict</button>
    </div>
  </form>
</template>

<style scoped>
.conflict-form {
  width: 100%;
  margin-bottom: 32px;
  padding: 32px;
  background: #ffffff;
  box-sizing: border-box;
}

.form-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eeeeee;
}

.form-header h3 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
  color: #111111;
  letter-spacing: -0.02em;
}

.form-header p {
  margin: 8px 0 0;
  color: #666666;
  font-size: 0.95rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 24px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-full {
  grid-column: 1 / -1;
}

.field label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #111111;
}

.field input[type="text"],
.field input[type="date"],
.field textarea,
.field select {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #d4d4d4;
  background: #ffffff;
  color: #111111;
  font-size: 0.95rem;
  font-family: inherit;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.field input[type="text"]:focus,
.field input[type="date"]:focus,
.field textarea:focus,
.field select:focus {
  border-color: #111111;
  background: #fcfcfc;
}

.field textarea {
  min-height: 130px;
  resize: vertical;
}

.countries-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px 18px;
  padding: 16px;
  border: 1px solid #d4d4d4;
  background: #ffffff;
}

.country-option {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #222222;
  font-size: 0.95rem;
  font-weight: 400;
  cursor: pointer;
}

.country-option input[type="checkbox"] {
  margin: 0;
  width: 16px;
  height: 16px;
  accent-color: #111111;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.form-actions button {
  border: 1px solid #111111;
  background: #ffffff;
  color: #111111;
  padding: 12px 18px;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.form-actions button:hover {
  background: #111111;
  color: #ffffff;
}

.error-message {
  margin: 18px 0 0;
  padding: 12px 14px;
  border: 1px solid #111111;
  background: #fafafa;
  color: #111111;
  font-size: 0.92rem;
}

@media (max-width: 900px) {
  .countries-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .conflict-form {
    padding: 22px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .countries-list {
    grid-template-columns: 1fr;
  }
}
</style>