<template>
  <div>
    <v-container>
      <template>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Pesquisa"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="desserts"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-spacer></v-spacer>
              <v-dialog
                v-model="dialog"
                max-width="500px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Adicionar item
                  </v-btn>
                </template>
                
                <v-card>
                  <!-- CAMPOS DO "ADICIONAR ITEM" (melhorar tamanho do card)-->
                  <v-card-text>
                    <v-container fluid>
                      <v-row>
                        <template v-for="input in params">
                          <v-col
                            cols="auto"
                            :key="input.text"
                          >
                            <!-- CAMPOS DE TEXTO -->
                            <v-text-field
                              v-if="input.type === 'text' && input.maxLength <= 100"
                              v-model="editedItem.name"
                              :name="input.value"
                              :label="input.text"
                              :maxlength="input.maxLength"
                              :error="input.required === true && input.input === ''"
                            />
                            <v-textarea
                              v-else-if="input.type === 'text' && input.maxLength > 100"
                              v-model.trim="editedItem.description"
                              :name="input.value"
                              :label="input.text"
                              :maxlength="input.maxLength"
                              :error="input.required === true && input.input === ''"
                            />
                            <!-- CHECKBOX -->
                            <v-checkbox
                              v-else-if="input.type === 'boolean'"
                              v-model="editedItem.checked"
                              :name="input.value"
                              :label="input.text"
                            />
                            <!-- CAPOS NUMERICOS -->
                            <v-text-field
                              v-else-if="input.type === 'integer'"
                              v-model.number.trim="editedItem.int"
                              type="number"
                              :name="input.value"
                              :label="input.text"
                              :maxlength="input.maxLength"
                              :error="input.required === true && input.input === ''"
                            />
                            <v-text-field
                              v-else-if="input.type === 'decimal'"
                              v-model.number.trim="editedItem.decimal"
                              type="number"
                              :name="input.value"
                              :label="input.text"
                              :maxlength="input.maxLength"
                              :error="input.required === true && input.input === ''"
                            />
                            <!-- SELETORES -->
                            <v-select
                              v-else-if="input.type === 'select'"
                              v-model="editedItem.status"
                              :name="input.value"
                              :label="input.text"
                              :items="input.items"
                              :error="input.required === true && input.input === ''"
                            />
                            <!-- CAMPO DATA -->
                            <template v-else-if="input.type === 'date'">
                              <v-row>
                                <v-col
                                  cols="auto"
                                >
                                  <v-menu
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="editedItem.date"
                                        v-bind="attrs"
                                        v-on="on"
                                        prepend-icon="mdi-calendar"
                                        color="secondary"
                                        locale="pt-BR"
                                        elevation="5"
                                        readonly
                                        :label="input.text"
                                        :error="input.required === true && input.input === ''"
                                      />
                                    </template>
                                    <v-date-picker
                                      v-model="input.input"
                                      @input="menu = false"
                                    />
                                  </v-menu>
                                </v-col>
                              </v-row>
                            </template>
                            <!-- CAMPO HORA -->
                            <template v-else-if="input.type === 'time'">
                              <v-row>
                                <v-col cols="auto">
                                  <p>{{ input.text }}:</p>
                                </v-col>
                                <v-col>
                                  <v-icon
                                    v-if="input.input !== null && input.input !== ''"
                                    @click="input.input = null"
                                    color="red accent-1"
                                    >fas fa-window-close</v-icon
                                  >
                                </v-col>
                              </v-row>
                              <input
                                v-model="editedItem.hour"
                                type="time"
                                name="hora-cons"
                                :error="input.required === true && input.input === ''"
                              />
                            </template>
                            <!-- CAMPO DATA E HORA -->
                            <!-- CAMPO IMAGEM -->
                          </v-col>
                        </template>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <!-- BOTÕES DE AÇÃO DO "ADICIONAR ITEM" -->
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="close"
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="save"
                    >
                      Salvar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <!-- CONFIRMAÇÃO DE EXCLUSÃO ITEM -->
              <v-dialog v-model="dialogDelete" max-width="600px">
                <v-card>
                  <v-card-title class="text-h5">Tem certeza de que deseja excluir este item?</v-card-title>
                  <v-card-actions>
                    <v-spacer/>
                    <v-btn color="blue darken-1" text @click="closeDelete">Não</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">Sim</v-btn>
                    <v-spacer/>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              class="mr-2"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </template>
    </v-container>
    {{ desserts }}
    {{  }}
  </div>
</template>

<script>
export default {
  props: ["params"],
  data: () => {
    return {
      search: "",
      menu: "",
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      headers: [], // Titulo das colunas
      desserts: [], // itens da tabela
      editedItem: {
        name: '',
        int: 0,
        description: '',
        checked: false,
        status: false,
        date: "",
        decimal: 0,
        hour: "",
      },
    } 
  },
  methods: {
    initialize() {
      for (let i = 0;  i < this.params.length; i++) {
        this.headers.push({text: this.params[i].text, value: this.params[i].value }) // Adiciona os os titulos da tabela com base nos parametros passados na tela
        //if (this.params[i].edit === true) {
          //this.editedItem.push(this.params[i].input)
        //}
        console.log(this.params[i])
      }
      this.headers.push({text: 'Ações', value: 'actions', sortable: false})
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    },
    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },
  created () {
      this.initialize()
  },
};
</script>

<style>
</style>