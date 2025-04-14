<template>
    <div>
        <Dialog v-model:visible="modalOpen" max-width="500px" modal :header="walletId > 0 ? 'Редактирование кошелька' : 'Создание нового кошелька'" @hide="closeModal">

          <div v-if="loading">
            <ProgressBar color="info"
                         mode="indeterminate"
                         style="height: 4px;"
                         :pt="{ value: { style: { backgroundColor: '#38bdf9' } } }"
            ></ProgressBar>
          </div>

          <div v-if="modalOpen">
            <div v-if="wallet" class="w-full px-2">
              <Textarea
                v-model="wallet.name"
                rows="2"
                required
                placeholder="name"
                fluid
                :disabled="loading"
              />

              <Textarea
                v-model="wallet.description"
                rows="4"
                placeholder="description"
                fluid
                :disabled="loading"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <Button type="button" :disabled="loading" label="Закрыть" size="small" severity="secondary" @click="closeModal"></Button>
            <Button type="button" :disabled="loading" label="Сохранить" size="small" severity="success" @click="saveWallet"></Button>
          </div>
        </Dialog>
    </div>
</template>

<script>
import WalletRepository from "../repositories/WalletRepository.js";
import WalletUseCase from "../use_case/WalletUseCase";
import WalletEntity from "../entities/WalletEntity.js";


export default {
    name: 'WalletEditor',
    setup() {
        const walletRepository = new WalletRepository();
        const walletUseCase = new WalletUseCase();
        return { walletRepository, walletUseCase };
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        walletId: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            modalOpen: this.value,
            wallet: null,
            loading: true,
        }
    },
    watch: {
        modelValue(newValue) {
            if (newValue) {
                this.openModal();
            } else {
                this.closeModal();
            }
        },
        modalOpen(newValue) {
            if (newValue) {
                this.loadWalletData();
            }
        }
    },
    methods: {
        openModal() {
            this.modalOpen = true;
            this.clearWalletData();
        },
        closeModal() {
            this.modalOpen = false;
            this.$emit('update:modelValue', false);
        },

        /**
         * Сохраняет кошелек.
         */
        async saveWallet() {
            this.loading = true;
            const result = await this.walletRepository.saveWallet(this.wallet);
            this.loading = false;
            this.$emit('reload');
            this.closeModal();

        },

        /**
         * Очищает данные кошелька.
         */
        clearWalletData() {
            if (this.wallet) {
                this.wallet.clear();
            }
        },

        async getWalletData() {
            this.wallet = null;
            this.loading = true;

            const result = await this.walletUseCase.getWalletDetail(this.walletId);
            if (result === false) {
                alert('Ошибка при загрузке данных кошелька');
            } else {
                this.wallet = result;
            }

            this.loading = false;
        },

        loadWalletData() {
            if (this.walletId === 0) {
                this.wallet = new WalletEntity();
                this.loading = false;
            } else {
                this.getWalletData();
            }
        }

    }
}
</script>

<style scoped>
/* Your styles here */
</style>
