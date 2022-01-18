<template>
  <div class="tarefas">
    <crud :params='bilder' />
    <div class="conteudo">
    </div>
  </div>
</template>

<script>
import crud from '../components/commons/crud.vue'

export default {
  name: 'Tarefas',
  components: {
    crud
  },
  data: () => ({
    bilder: [
      {
        text: "Nome",
        value: "name",
        input: "",
        type: "text",
        header: true,
        edit: true,
        maxLength: 100,
        required: true
      },
      {
        text: "Descrição completa",
        value: "description",
        input: "",
        type: "text",
        header: true,
        edit: true,
        maxLength: 200,
        required: true
      },
      {
        text: "checkbox",
        value: "checked",
        input: false,
        type: "boolean",
        header: true,
        edit: true,
      },      
      {
        text: "Status",
        value: "status",
        input: "",
        type: "select",
        header: true,
        edit: true,
        maxLength: 5,
        items: [
          {text: "Sim", value: true},
          {text: "Não", value: false}
        ],
        required: true
      },
      {
        text: "Inteiro",
        value: "integer",
        input: "",
        type: "integer",
        maxLength: 3,
        header: true,
        edit: true,
        required: true
      },
      {
        text: "Decimal",
        value: "decimal",
        input: "",
        type: "decimal",
        header: true,
        required: true
      },
      {
        text: "Data",
        value: "date",
        input: "",
        type: "date",
        header: true,
        required: true
      },
      {
        text: "Hora",
        value: "time",
        input: "",
        type: "time",
        header: true,
        required: true
      },
    ],
  })
}
</script>
