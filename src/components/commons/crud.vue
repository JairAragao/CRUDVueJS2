<template>
  <div>
    <v-container>
      <template>
        <template>
          <!-- BOTÃO ADICIONAR ITEM -->
          <template>
            <v-btn color="primary" dark class="mb-2" @click="addItem">
              Adicionar item
            </v-btn>
          </template>

          <!-- BOTÕES E CAMPOS DO "ADICIONAR ITEM" -->
          <v-dialog
            v-model="dialogAddItem"
            max-width="500px"
            @click:outside="close"
          >
            <v-card>
              <v-card-text>
                <v-container fluid>
                  <v-row>
                    <template v-for="field in params">
                      <v-col cols="auto" :key="field.text">
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
                          v-else-if="
                            field.type === 'text' && field.maxLength > 100
                          "
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
                          :error="
                            (field.required === true && field.input === '') ||
                            !Number.isInteger(field.input)
                          "
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
                            <v-col cols="auto">
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
                                    :error="
                                      field.required === true &&
                                      field.input === ''
                                    "
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
                                v-if="
                                  field.input !== null && field.input !== ''
                                "
                                @click="field.input = null"
                                color="red accent-1"
                                >fas fa-window-close</v-icon
                              >
                            </v-col>
                          </v-row>
                          <input
                            v-model="field.input"
                            type="time"
                            name="hora-cons"
                            :error="
                              field.required === true && field.input === ''
                            "
                          />
                        </template>
                        <!-- CAMPO DATA E HORA -->
                        <!-- CAMPO IMAGEM -->
                      </v-col>
                    </template>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancelar
                </v-btn>
                <v-btn
                  :color="isEdited ? 'blue darken-1' : 'green darken-1'"
                  text
                  @click="isEdited ? saveEdited() : saveNew()"
                >
                  {{ isEdited ? "Salvar editado" : "Salvar novo" }}
                </v-btn>

                <!-- <v-btn
                  color="blue darken-1"
                  text
                  v-else
                  @click="saveEdited"
                >
                  Salvar editado
                </v-btn> -->
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- CONFIRMAÇÃO DE EXCLUSÃO ITEM -->
          <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card>
              <v-card-title class="text-h5"
                >Tem certeza de que deseja excluir este item?</v-card-title
              >
              <v-card-actions>
                <v-spacer />
                <v-btn color="blue darken-1" text @click="deleteItemDenied"
                  >Não</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >Sim</v-btn
                >
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <!-- BARRA DE PESQUISA -->
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Pesquisa"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>

        <!-- TABELA -->
        <v-data-table :headers="headers" :items="desserts" class="elevation-1">
          <template v-slot:item.actions="{ item }">
            <v-icon @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </template>
    </v-container>
    {{}}
  </div>
</template>

<script>
export default {
  props: ["params"],
  data: () => {
    return {
      search: "",
      menu: "",
      dialogAddItem: false,
      dialogDelete: false,
      isEdited: false, // alerna entre os botões salvar novo e savar alterado
      editedIndex: -1,
      headers: [],
      desserts: [],
      inputDefault: [], // usado para limpar os valores cleanFields
    };
  },
  methods: {
    async initialize() {
      await this.$http
        .get("http://192.168.2.80:3000", {
          params: {},
        })
        .then((res) => {
          this.desserts = res.data;
        });
      for (let i = 0; i < this.params.length; i++) {
        if (this.params[i].header) {
          this.headers.push({
            text: this.params[i].text,
            value: this.params[i].value,
          });
        }
        this.inputDefault.push({
          value: this.params[i].value,
          input: this.params[i].input,
        });
      }
      this.headers.push({ text: "Ações", value: "actions", sortable: false });
    },
    getName() {
      //let names = {}
      // for (let i = 0; i < array.length; i++) {
      //   const element = array[i];
      // }
    },
    async saveNew() {
      let newItem = {};
      for (let i = 0; i < this.params.length; i++) {
        newItem[this.params[i].value] = this.params[i].input;
      }
      await this.$http.post("http://192.168.2.80:3000", newItem)
      .then((res) => {
        console.log(res)
        this.desserts = res.data;
        
      })
      .catch((err) => {
        alert(err.response.data)
        console.log(err)
      })
      //this.desserts.push(newItem);
      this.close();
    },
    saveEdited() {
      let editedItem = {};
      for (let i = 0; i < this.params.length; i++) {
        editedItem[this.params[i].value] = this.params[i].input;
      }
      Object.assign(this.desserts[this.editedIndex], editedItem);
      this.close();
    },
    close() {
      this.dialogAddItem = false;
      this.isEdited = false;
      this.cleanFields();
    },
    cleanFields() {
      for (let i = 0; i < this.params.length; i++) {
        if (this.params[i].value === this.inputDefault[i].value) {
          this.params[i].input = this.inputDefault[i].input;
        }
      }
    },
    editItem(item) {
      //let cont = -1
      this.editedIndex = this.desserts.indexOf(item);
      for (let key in item) {
        //cont++
        // if (key === this.params[cont].value) {
        //   this.params[cont].input = item[key]
        // }
        let found = this.params.find((x) => x.value == key);
        //console.log(key)
        found.input = item[key];
        //console.log(found)
      }
      this.isEdited = true;
      this.dialogAddItem = true;
    },
    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.dialogDelete = false;
    },
    deleteItemDenied() {
      this.dialogDelete = false;
      this.editedIndex = -1;
    },
    addItem() {
      this.dialogAddItem = true;
      this.cleanFields();
    },
  },
  created() {
    this.initialize();
  },
};
</script>

<style>
</style>