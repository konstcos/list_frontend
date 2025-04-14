<template>
  <div class="main_login_block">
    <div v-if="section === sections.login">
      <div class="login_title">
        Вход
        <Button
          label="Зарегистрироваться"
          class="!px-2 !py-1 !text-xs !h-7"
          size="small"
          @click="changeSection(sections.registration)"
          severity="contrast"
          :disabled="loading"
        />
      </div>
      <div>
        <Card
        >

          <template #content>
            <div class="flex flex-col gap-1">
              <InputText
                v-model="login.email"
                type="text"
                required
                placeholder="email"
                :disabled="loading"
                fluid />
            </div>

            <div class="flex flex-col gap-1 mt-4">
              <Password
                v-model="login.password"
                required
                size="small"
                :disabled="loading"
                :feedback="false"
                placeholder="password"
                fluid />
            </div>

              <Button
                label="Войти"
                class="!px-2 !py-1 !text-xs !h-7 mt-4"
                @click="loginUser"
                :loading="loading"
                :disabled="loading"
              />
          </template>
        </Card>

      </div>
    </div>
    <div v-else>
      <div class="login_title">
        Регистрация
        <Button
          label="Войти"
          class="!px-2 !py-1 !text-xs !h-7"
          size="small"
          @click="changeSection(sections.login)"
          severity="contrast"
          :disabled="loading"
        />
      </div>
      <div>
        <v-card
          color="indigo"
          variant="outlined"
        >

          <Card>
            <template #content>
              <div class="flex flex-col gap-1">
                <InputText
                  v-model="registration.name"
                  type="text"
                  required
                  placeholder="name"
                  :disabled="loading"
                  fluid />
              </div>

              <div class="flex flex-col gap-1 mt-4">
                <InputText
                  v-model="registration.email"
                  type="text"
                  required
                  placeholder="email"
                  :disabled="loading"
                  fluid />
              </div>


              <div class="flex flex-col gap-1 mt-4">
                <Password
                  v-model="registration.password"
                  required
                  size="small"
                  :disabled="loading"
                  :feedback="false"
                  placeholder="password"
                  fluid />
              </div>

              <div class="flex flex-col gap-1 mt-4">
                <Password
                  v-model="registration.passwordConfirmation"
                  required
                  size="small"
                  :disabled="loading"
                  :feedback="false"
                  placeholder="Подтверждение пароля"
                  fluid />
              </div>

              <v-text-field
                v-model="registration.passwordConfirmation"
                label="Подтверждение пароля"
                density="compact"
                type="password"
                required
                :disabled="loading"
              ></v-text-field>

              <div v-if="error" class="mb-4 error_block">
                {{ error }}
              </div>

              <Button
                label="Зарегистрироваться"
                class="!px-2 !py-1 !text-xs !h-7 mt-4"
                @click="registerUser"
                :loading="loading"
                :disabled="loading"
              />

            </template>
          </Card>
        </v-card>
      </div>
    </div>

  </div>
</template>

<script>
// import useUser from '@/src/entities/UserEntity.js';
import useUser from '../entities/UserEntity.js';
import LoginRepository from "../repositories/auth/LoginRepository.js";

export default {
  name: "LoginView",
  setup() {
    const {setToken, clearUser, user} = useUser()
    const loginRepository = new LoginRepository();
    return {
      setToken,
      clearUser,
      user,
      loginRepository,
    }
  },
  data() {
    return {
      section: "login",
      sections: {
        login: "login",
        registration: "registration",
      },
      error: false,
      loading: false,
      login: {
        email: "",
        password: "",
      },
      registration: {
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
      },

    };
  },
  methods: {
    async loginUser() {
      this.clearError();

      this.loading = true;
      const result = await this.loginRepository.login(this.login.email, this.login.password);

      if (result) {
        this.$router.push({name: 'home'});
      }

      this.loading = false;
    },

    async registerUser() {
      this.clearError();

      if (!this.checkRegistrationData()) {
        return;
      }

      this.loading = true;
      const result = await this.loginRepository.register(this.registration.name, this.registration.email, this.registration.password);

      if (result.status === 'success') {
        this.$router.push({name: 'home'});
      }

      this.loading = false;
    },
    changeSection(section) {
      this.clearError();
      this.clearLoginData();
      this.clearRegistrationData();
      this.section = section;
    },

    checkRegistrationData() {
      if (this.registration.email === '') {
        this.error = 'Введите email';
        return false;
      }
      if (this.registration.password === '') {
        this.error = 'Введите пароль';
        return false;
      }
      if (this.registration.passwordConfirmation === '') {
        this.error = 'Введите подтверждение пароля';
        return false;
      }

      if (this.registration.password !== this.registration.passwordConfirmation) {
        this.error = 'Пароли не совпадают';
        return false;
      }

      return true;
    },

    clearError() {
      this.error = false;
    },

    clearRegistrationData() {
      this.registration.name = '';
      this.registration.email = '';
      this.registration.password = '';
      this.registration.passwordConfirmation = '';
    },

    clearLoginData() {
      this.login.email = '';
      this.login.password = '';
    }

  },
  mounted() {

  }
}
</script>


<style scoped lang="scss">
.main_login_block {
  width: 300px;
  margin: 5% auto 0;
}

.login_title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
}

.error_block {
  color: red;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 10px;
}

</style>
