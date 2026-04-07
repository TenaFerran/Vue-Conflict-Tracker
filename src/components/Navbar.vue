<script setup>
</script>

<template>
  <nav class="navbar">
    <h1 class="title">CONFLICT TRACKER</h1>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/conflicts">Conflictos</a></li>
    <li><a href="/Form">Nuevo Conflicto</a></li>
  </ul>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  padding: 20px;
  justify-content: space-between;
  padding-left: 2vw;
  padding-right: 2vw;
  border-bottom: 1px solid black;
}

ul {
  display: flex;
  align-items: center;
  gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  font-size: 0.95rem;
}

li a {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  position: relative;
  transition: color 0.2s ease;
}

li a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 0%;
  height: 1px;
  background: #111;
  transition: width 0.2s ease;
}

li a:hover {
  color: #111;
}

li a:hover::after {
  width: 100%;
}
.title {
  color: black;
  margin: 0;
}
</style>
