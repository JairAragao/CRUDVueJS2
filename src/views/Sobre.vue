<template>
    <crud :params='bilder'/>
</template>

<script>
import crud from '../components/commons/crud.vue'

export default {
  data: () => ({
    bilder: [
      {
        text: "Descrição",
        value: "description",
        searchInput: "Descrição",
        input: "",
        type: "text",
        search: true,
        edit: false,
        header: true,
        maxLength: 3,
      }
    ],
  }),
  components: {
    crud
  }
}
</script>

<style>

</style>