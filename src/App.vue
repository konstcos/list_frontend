<template>
  <div>
    <div class="card" >
      <Menubar>
      <template #start>
<!--          <svg @click="toggleDrawer" width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-8">-->
<!--            <path-->
<!--              d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z"-->
<!--              fill="var(&#45;&#45;p-primary-color)"-->
<!--            />-->
<!--            <path-->
<!--              d="M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z"-->
<!--              fill="var(&#45;&#45;p-text-color)"-->
<!--            />-->
<!--          </svg>-->
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
      <aside class="w-64 overflow-y-auto">
        <!-- Здесь может быть например компонент Menu от PrimeVue -->
        <PanelMenu
          :model="sideMenuItems"
          v-model:expandedKeys="expandedMenuKeys"

        />
      </aside>

      <!-- Контент -->
      <main class="flex-1 px-6 overflow-y-auto">
        <router-view />
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
    const {isLoggedIn, user} = useUser();
    const loginRepository = new LoginRepository();
    return {
      isLoggedIn,
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
      headMenuItems: [
        {
          label: 'Home',
          icon: 'pi pi-home'
        },
        {
          label: 'Projects',
          icon: 'pi pi-search',
          badge: 3,
          items: [
            {
              label: 'Core',
              icon: 'pi pi-bolt',
              shortcut: '⌘+S'
            },
            {
              label: 'Blocks',
              icon: 'pi pi-server',
              shortcut: '⌘+B'
            },
            {
              separator: true
            },
            {
              label: 'UI Kit',
              icon: 'pi pi-pencil',
              shortcut: '⌘+U'
            }
          ]
        }
      ],
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
      console.log('okew drawer')
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
  },
  mounted() {
    this.checkAuth();

  }
}
</script>

<style scoped lang="scss">


</style>
