<script setup>
</script>

<template>
<h1 class="homeTitle">CONFLICT TRACKER</h1>
<h2 class="homeSubtitle">POR FERRAN TENA</h2>
<div class="homeDiv">
<p>QUE QUIERES HACER?</p>
<ul class="homeList">
  <li><a href="/conflicts">VER CONFLICTOS</a></li>
  <li><a href="/Form">NUEVO CONFLICTO</a></li>
</ul>
</div>
</template>

<style scoped>
.homeTitle {
  font-size: 3em;
  text-align: center;
  margin-top: 150px;
  margin-bottom: 0px;
}
.homeSubtitle {
  text-align: center;
  font-size: 20px;
  font-weight: 400;
  margin-top: 5px;
}
.homeList{
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
  list-style-type: none;
  padding-left: 0px;
  a{
    color:black;
    font-size: 18px;
  }
}
.homeDiv{
margin-top: 150px;
p{
  text-align: center;
  font-size: 22px;
  font-weight: 700;  
}
}

</style>