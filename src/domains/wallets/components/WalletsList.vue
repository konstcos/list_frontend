<template>
  <div>
    <Card>
        <template #content>
          <div class="flex flex-wrap -mx-2 mb-6">
            <div class="w-full md:w-1/2 px-2">
              <Button
                :loading="loading"
                @click="loadWallets"
                severity="info"
                rounded
                variant="text"
                icon="pi pi-refresh"
                size="small"
              >
              </Button>
            </div>
            <div class="w-full md:w-1/2 px-2 text-end">
              <Button
                @click="openWalletEditor(0)"
                :disabled="loading"
                icon="pi pi-plus"
                severity="severity"
                rounded
                variant="text"
                size="small"
              >
              </Button>
            </div>
          </div>

          <div v-if="loading">
            <ProgressBar color="info"
                         mode="indeterminate"
                         style="height: 4px;"
                         :pt="{ value: { style: { backgroundColor: '#38bdf9' } } }"
            ></ProgressBar>
          </div>

          <div v-if="!loading && wallets.length === 0" class="text-center">
            у вас пока нет кошельков
          </div>

          <div v-if="wallets.length > 0" class="mt-3">

            <!-- Список кошельков -->
            <ul class="list-none p-0 m-0">
              <li
                v-for="wallet in wallets"
                :key="wallet.id"
                class="flex justify-content-between align-items-center pb-3 surface-card shadow-1 border-round mb-2"
              >
                <div class="cursor-pointer flex-1">
                  <div class="text-lg font-medium">{{ wallet.balance }}грн</div>
                  <div class="text-sm text-secondary">{{ wallet.name }}</div>
                </div>

                <i class="cursor-pointer pi pi-ellipsis-v ml-2" @click="openMenu($event, wallet)"></i>
              </li>
            </ul>

            <Popover ref="op">
              <div style="display: flex; flex-direction: column; gap: 8px; width: 150px">
                <Button
                  label="Редактировать"
                  icon="pi pi-pencil"
                  @click="editActiveWallet"
                  style="width: 100%; justify-content: flex-start"
                  class="p-button-text"
                  size="small"
                />
                <Button
                  label="Удалить"
                  icon="pi pi-trash"
                  @click="deleteActiveWallet"
                  style="width: 100%; justify-content: flex-start"
                  class="p-button-text p-button-danger"
                  size="small"
                />
              </div>
            </Popover>

          </div>

        </template>
      </Card>

    <WalletEditor v-model="walletEditorModal.show" :wallet-id="walletEditorModal.walletId" @reload="loadWallets()"/>

  </div>
</template>

<script>
import WalletRepository from "../repositories/WalletRepository.js";
import WalletUseCase from "../use_case/WalletUseCase";
import WalletEditor from "./WalletEditor.vue";

export default {
  name: "WalletsList",
  setup() {
    const walletRepository = new WalletRepository();
    const walletUseCase = new WalletUseCase();
    return { walletRepository, walletUseCase };
  },
  components: {
    WalletEditor
  },
  data() {
    return {
      wallets: [],
      loading: false,
      walletEditorModal: {
        show: false,
        walletId: 0
      },
      deleteWalletModal: {
        show: false,
        walletId: 0,
        loading: false,
      },
      activeWallet: null
    }
  },
  methods: {
    openMenu(event, wallet) {
      this.activeWallet = wallet;
      this.$refs.op.toggle(event);      // всего одна панель → один ref
    },

    editActiveWallet() {
      if (this.activeWallet) {
        this.openWalletEditor(this.activeWallet.id);
        this.$refs.op.hide();
      }
    },
    deleteActiveWallet() {
      if (this.activeWallet) {
        this.deleteWallet(this.activeWallet.id);
        this.$refs.op.hide();
      }
    },
    getMenuItems(wallet) {
      return [
        {
          label: 'Редактировать',
          icon: 'pi pi-pencil',
          command: () => this.openWalletEditor(wallet.id)
        },
        {
          label: 'Удалить',
          icon: 'pi pi-trash',
          command: () => this.deleteWallet(wallet.id)
        }
      ];
    },
    async loadWallets() {
      this.loading = true;
      const result = await this.walletUseCase.getUserWallets();

      if (result === false) {
        alert("Ошибка при загрузке кошельков");
      } else {
        this.wallets = result;
      }

      this.loading = false;
    },
    openWalletEditor(walletId = 0) {
      this.walletEditorModal.walletId = walletId;
      this.walletEditorModal.show = true;
    },
    deleteWallet(walletId) {
      this.deleteWalletModal.walletId = walletId;

      this.$confirm.require({
        message: 'Подтвердите удаление кошелька',
        header: 'Подтверждение удаления',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Да',
        rejectLabel: 'Отмена',
        accept: () => {
          this.makeDeleteWallet();
        },
        reject: () => {},
        acceptClass: 'p-button-text p-button-danger p-button-sm',
        rejectClass: 'p-button-text p-button-secondary p-button-sm'
      });

    },
    cancelDelation() {
      this.deleteWalletModal.show = false;
      this.deleteWalletModal.walletId = 0;
    },
    async makeDeleteWallet() {
      this.deleteWalletModal.loading = true;

      const result = await this.walletUseCase.deleteWallet(this.deleteWalletModal.walletId);
      
      if (result === false) {
        alert("Ошибка при удалении кошелька");
      } else {
        this.loadWallets();
      }

      this.deleteWalletModal.loading = false;
      this.deleteWalletModal.show = false;
    }
  },
  mounted() {
    this.loadWallets();
  }
}
</script>

<style scoped lang="scss"></style>
