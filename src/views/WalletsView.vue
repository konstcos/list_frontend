<template>
  <div>
    <h1>Мои кошельки</h1>
    <div class="mt-4">
      <div class="flex flex-wrap -mx-2 mb-6">
        <div class="w-full md:w-1/3 px-2">
          <WalletsList></WalletsList>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import WalletsList from "../domains/wallets/components/WalletsList.vue";
export default {
  name: "Wallets",
  components: {
    WalletsList,
  }
}
</script>


<style scoped lang="scss">

</style>
