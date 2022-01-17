<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            CRUD
          </v-list-item-title>
          <v-list-item-subtitle>
            Teste
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider/>

      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.to"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
      
    <v-app-bar
      app
      color="#fcb69f"
      dark
      prominent
      src="./assets/img-orchestra.jpg"
    >
    
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(34,190,195,0.83), rgba(134,45,253,0.66)"
        ></v-img>
      </template>

      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title></v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
      <!--- Fazer algoritmo para duplo clique fixa nova aba
      <template v-slot:extension>
        <v-tabs align-with-title>
          <v-tab>Tab 1</v-tab>
          <v-tab>Tab 2</v-tab>
          <v-tab>Tab 3</v-tab>
        </v-tabs>
      </template>
      --->
    </v-app-bar>

    <v-main>
      <keep-alive>
        <router-view/>
      </keep-alive>
      
    </v-main>
    
    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data: () => ({ 
      drawer: false,
      items: [
        { title: 'Tarefas', icon: 'mdi-view-dashboard', to: '/' },
        { title: 'Sobre', icon: 'mdi-image', to: '/sobre' },
      ],
    }),

  }
</script>