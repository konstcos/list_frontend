<template>
  <div>
    <div class="card" >
      <Menubar :model="headMenuItems">
      <template #start>
        <img src="/smart_list_5.png" width="40" alt="">
        <div class="ml-3 mr-3 text-lg font-bold">
          Умные списки
        </div>
      </template>
      <template #end>
        <div class="flex items-center gap-2">
          <div v-if="isLoggedIn()">
            {{ user.name }}
          </div>
          <div v-if="isLoggedIn()">
            <i class="pi pi-user cursor-pointer" @click="toggleUserMenu"></i>
            <Menu ref="userMenu" :model="userMenu" :popup="true" />
          </div>
          <Button v-else icon="pi pi-sign-in" severity="info" variant="text" aria-label="User" size="small" @click="() => $router.push('/login')" />
        </div>
      </template>
    </Menubar>
    </div>
    <!-- Основной блок с меню и контентом -->
    <div class="flex flex-1 overflow-hidden mt-4">
      <!-- Левое меню -->
<!--      <aside class="w-64 overflow-y-auto">-->
<!--        &lt;!&ndash; Здесь может быть например компонент Menu от PrimeVue &ndash;&gt;-->
<!--        <PanelMenu-->
<!--          :model="sideMenuItems"-->
<!--          v-model:expandedKeys="expandedMenuKeys"-->

<!--        />-->
<!--      </aside>-->

      <!-- Контент -->
      <main class="flex-1  overflow-y-auto">
        <div v-if="!isLoginProcessed()" class="mt-20 px-30">
          <ProgressBar color="info"
                       mode="indeterminate"
                       style="height: 4px;"
                       :pt="{ value: { style: { backgroundColor: '#38bdf9' } } }"
          ></ProgressBar>
        </div>
        <div v-else>
          <router-view />
        </div>

      </main>
    </div>

    <ConfirmDialog />
  </div>

</template>

<script>
import useUser from './entities/UserEntity.js';
import LoginRepository from "./repositories/auth/LoginRepository.js";

export default {
  name: 'App',
  setup() {
    const {isLoggedIn, user, isLoginProcessed} = useUser();
    const loginRepository = new LoginRepository();
    return {
      isLoggedIn,
      isLoginProcessed,
      loginRepository,
      user,
    };
  },
  data() {
    return {
      taggingOpen: true,
      drawer: true,
      rail: false,
      checkAuthLoading: true,
      userMenu: [
        {
          label: 'Выйти',
          icon: 'pi pi-sign-out',
          command: () => {
            this.logoutUser();
          },
        },
      ],
      expandedMenuKeys: {
        tagging: true,
      },
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer
    },
    toggleUserMenu(event) {
      this.$refs.userMenu.toggle(event)
    },
    async clearUser() {
      this.loginRepository.logout();
    },
    async checkAuth() {
      this.checkAuthLoading = true;
      await this.loginRepository.checkAuth();
      this.checkAuthLoading = false;

      if (this.$route.name === 'login' && this.isLoggedIn()) {
        this.$router.push({name: 'home'});
      }

      if ((
          this.$route.name === 'wallets' ||
          this.$route.name === 'transactions'
        ) &&
        !this.isLoggedIn()
      ) {
        this.$router.push({name: 'home'});
      }
    },
    logoutUser() {
      this.loginRepository.logout();
      this.$router.push({name: 'home'});
    }
  },
  computed: {
    sideMenuItems() {
      let items = [
        {
          key: 'main',
          label: 'Главная',
          icon: 'pi pi-home',
          command: () => this.$router.push('/'),
        },
        {
          key: 'base',
          label: 'Base',
          icon: 'pi pi-database',
          command: () => this.$router.push('/base'),
        },
      ];

      if (this.isLoggedIn()) {
        items.push(
          {
            key: 'tagging',
            label: 'Tagging',
            icon: 'pi pi-tags',
            items: [
              {
                key: 'categories',
                label: 'Категории',
                icon: 'pi pi-folder',
                command: () => this.$router.push('/categories'),
              },
              {
                key: 'tags',
                label: 'Тэги',
                icon: 'pi pi-folder',
                command: () => this.$router.push('/tags'),
              },
            ],
          },
          {
            key: 'wallets',
            label: 'Кошельки',
            icon: 'pi pi-wallet',
            command: () => this.$router.push('/wallets'),
          },
          {
            key: 'transactions',
            label: 'Переводы',
            icon: 'pi pi-send',
            command: () => this.$router.push('/transactions'),
          },
          {
            key: 'links',
            label: 'Ссылки',
            icon: 'pi pi-link',
            command: () => this.$router.push('/links'),
          }
        );
      }

      return items;
    },
    headMenuItems() {
      let items = [
        {
          key: 'main',
          label: 'Главная',
          icon: 'pi pi-home',
          command: () => this.$router.push('/'),
        },
        // {
        //   key: 'base',
        //   label: 'Base',
        //   icon: 'pi pi-database',
        //   command: () => this.$router.push('/base'),
        // },
      ];

      if (this.isLoggedIn()) {
        items.push(
          {
            key: 'tagging',
            label: 'Tagging',
            icon: 'pi pi-tags',
            items: [
              {
                key: 'categories',
                label: 'Категории',
                icon: 'pi pi-folder',
                command: () => this.$router.push('/categories'),
              },
              {
                key: 'tags',
                label: 'Тэги',
                icon: 'pi pi-folder',
                command: () => this.$router.push('/tags'),
              },
            ],
          },
          {
            key: 'wallets',
            label: 'Кошельки',
            icon: 'pi pi-wallet',
            command: () => this.$router.push('/wallets'),
          },
          // {
          //   key: 'transactions',
          //   label: 'Переводы',
          //   icon: 'pi pi-send',
          //   command: () => this.$router.push('/transactions'),
          // },
          {
            key: 'links',
            label: 'Ссылки',
            icon: 'pi pi-link',
            command: () => this.$router.push('/links'),
          }
        );
      }

      return items;
    },
  },
  mounted() {
    this.checkAuth();

  }
}
</script>

<style scoped lang="scss">


</style>
