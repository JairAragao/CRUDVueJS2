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
                        <template v-for="field in params">
                          <v-col
                            cols="auto"
                            :key="field.text"
                          >
                            <!-- CAMPOS DE TEXTO -->
                            <v-text-field
                              v-if="field.type === 'text' && field.maxLength <= 100"
                              v-model="field.input"
                              :name="field.value"
                              :label="field.text"
                              :maxlength="field.maxLength"
                              :error="field.required === true && field.input === ''"
                            />
                            <v-textarea
                              v-else-if="field.type === 'text' && field.maxLength > 100"
                              v-model.trim="field.input"
                              :name="field.value"
                              :label="field.text"
                              :maxlength="field.maxLength"
                              :error="field.required === true && field.input === ''"
                            />
                            <!-- CHECKBOX -->
                            <v-checkbox
                              v-else-if="field.type === 'boolean'"
                              v-model="field.input"
                              :name="field.value"
                              :label="field.text"
                            />
                            <!-- CAPOS NUMERICOS -->
                            <v-text-field
                              v-else-if="field.type === 'integer'"
                              v-model.number.trim="field.input"
                              type="number"
                              :name="field.value"
                              :label="field.text"
                              :maxlength="field.maxLength"
                              :error="field.required === true && field.input === '' || !Number.isInteger(field.input)"
                            />
                            <v-text-field
                              v-else-if="field.type === 'decimal'"
                              v-model.number.trim="field.input"
                              type="number"
                              :name="field.value"
                              :label="field.text"
                              :maxlength="field.maxLength"
                              :error="field.required === true && field.input === ''"
                            />
                            <!-- SELETORES -->
                            <v-select
                              v-else-if="field.type === 'select'"
                              v-model="field.input"
                              :name="field.value"
                              :label="field.text"
                              :items="field.items"
                              :error="field.required === true && field.input === ''"
                            />
                            <!-- CAMPO DATA -->
                            <template v-else-if="field.type === 'date'">
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
                                        v-model="field.input"
                                        v-bind="attrs"
                                        v-on="on"
                                        prepend-icon="mdi-calendar"
                                        color="secondary"
                                        locale="pt-BR"
                                        elevation="5"
                                        readonly
                                        :label="field.text"
                                        :error="field.required === true && field.input === ''"
                                      />
                                    </template>
                                    <v-date-picker
                                      v-model="field.input"
                                      @input="menu = false"
                                    />
                                  </v-menu>
                                </v-col>
                              </v-row>
                            </template>
                            <!-- CAMPO HORA -->
                            <template v-else-if="field.type === 'time'">
                              <v-row>
                                <v-col cols="auto">
                                  <p>{{ field.text }}:</p>
                                </v-col>
                                <v-col>
                                  <v-icon
                                    v-if="field.input !== null && field.input !== ''"
                                    @click="field.input = null"
                                    color="red accent-1"
                                    >fas fa-window-close</v-icon
                                  >
                                </v-col>
                              </v-row>
                              <input
                                v-model="editedItem.time"
                                type="time"
                                name="hora-cons"
                                :error="field.required === true && field.input === ''"
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
                      @click="dialog = false"
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
    {{ }}
    <v-spacer></v-spacer>
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
      editedItem: {},
    }
  },
  methods: {
    initialize() {
      for (let i = 0;  i < this.params.length; i++) {
        //if (this.params[i].header) {
          //}
        this.headers.push({text: this.params[i].text, value: this.params[i].value }) // Adiciona os os titulos da tabela
        let editableItemInput = this.params[i].input
        let editableItemValue = this.params[i].value
        this.editedItem[editableItemValue] = editableItemInput;
      }
      console.log(this.editedItem)
      this.headers.push({text: 'Ações', value: 'actions', sortable: false})
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.dialog = false
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
      if (val) {
        this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      }
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