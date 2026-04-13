<script setup>
const icons = ['mdi-github', 'mdi-linkedin']
</script>

<template>
  <div class="container-fluid">
    <h1>Login</h1>

    <form class="form" @submit.prevent="step === 1 ? requestCode() : verifyCode()">
      <v-btn icon="mdi-arrow-left" to="/" class="mb-2" />

      <!-- PASO 1: ingresar email -->
      <template v-if="step === 1">
        <p class="step-hint">Ingresa tu email y recibirás un token de acceso.</p>

        <label class="form-label" for="email">Email:</label>
        <input
          v-model="email"
          class="form-input"
          type="email"
          id="email"
          required
          placeholder="tu@email.com"
          :disabled="loading"
        />

        <p v-if="error" class="error">{{ error }}</p>

        <input
          class="form-submit"
          type="submit"
          :value="loading ? 'Enviando...' : 'Enviar código →'"
          :disabled="loading"
        />
      </template>

      <!-- PASO 2: ingresar código recibido por email -->
      <template v-else>
        <p class="step-hint">
          Revisa tu bandeja de entrada en <strong>{{ email }}</strong>
          e ingresa el token que recibiste.
        </p>

        <label class="form-label" for="code">Token:</label>
        <input
          v-model="code"
          class="form-input"
          type="text"
          id="code"
          required
          placeholder="Código de 6 dígitos"
          maxlength="10"
          autocomplete="one-time-code"
          :disabled="loading"
        />

        <p v-if="error" class="error">{{ error }}</p>

        <input
          class="form-submit"
          type="submit"
          :value="loading ? 'Verificando...' : 'Ingresar'"
          :disabled="loading || !code"
        />

        <button type="button" class="btn-ghost" @click=";(((step = 1), (error = '')), (code = ''))">
          ← Cambiar email
        </button>
      </template>
    </form>
  </div>
  <v-footer class="text-center d-flex flex-column">
    <div class="d-flex ga-2">
      <v-btn
        v-for="icon in icons"
        :key="icon"
        :icon="icon"
        density="comfortable"
        variant="text"
      ></v-btn>
    </div>

    <v-divider class="my-1" thickness="2" width="70"></v-divider>

    <div>{{ new Date().getFullYear() }} — <strong>Barbara Quiroz</strong></div>
  </v-footer>
</template>

<script>
import auth from '@/auth'

export default {
  data: () => ({
    step: 1, // 1 = pedir email, 2 = ingresar código
    email: '',
    code: '',
    error: '',
    loading: false,
  }),
  methods: {
    // Paso 1: solicitar magic code
    async requestCode() {
      this.error = ''
      this.loading = true
      try {
        await auth.requestMagicCode(this.email)
        this.step = 2
      } catch (err) {
        this.error = err.response?.data?.error || 'No se pudo enviar el código. Intenta de nuevo.'
      } finally {
        this.loading = false
      }
    },

    // Paso 2: verificar código → obtener session_token
    async verifyCode() {
      this.error = ''
      this.loading = true
      try {
        const res = await auth.verifyMagicCode(this.code)
        auth.setSession({ email: this.email, session_token: res.data.session_token })
        this.$router.push('/dashboard')
      } catch (err) {
        this.error = err.response?.data?.error || 'Código incorrecto o expirado.'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.container-fluid {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-image: url('/character.jpg');
  background-size: cover;
  background-position: left;
}
h1 {
  margin: 20vh 0 0 25vw;
  color: #fff;
  text-shadow:
    0 0 2px #fff,
    0 0 5px #fff,
    0 0 10px #fff,
    0 0 20px #0ff,
    0 0 40px #0ff,
    0 0 60px #0ff;
}
.form {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  padding: 32px 40px;
  margin: 8vh 0 0 5vw;
  width: 38vw;
  color: aliceblue;
  background: linear-gradient(#422972, #2d4181, #2d7481);
  box-shadow:
    0 0 5px #fff,
    0 0 10px #fff,
    0 0 20px #fff,
    0 0 40px #0ff,
    0 0 80px #0ff,
    0 0 150px #0ff;
}
.step-hint {
  font-size: 13px;
  color: #b0c4de;
  margin: 0 0 1rem;
  line-height: 1.5;
}
.form-label {
  color: white;
  margin-bottom: 0.4rem;
  margin-top: 0.5rem;
}
.form-input {
  padding: 10px 15px;
  background: none;
  border: 1px solid white;
  color: white;
  border-radius: 2px;
  font-size: 15px;
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  &:focus {
    outline: 0;
    border-color: #1ab188;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
.form-submit {
  background: #1ab188;
  border: none;
  color: white;
  margin-top: 1.5rem;
  padding: 0.9rem 0;
  cursor: pointer;
  font-size: 15px;
  border-radius: 2px;
  transition: background 0.2s;
  &:hover:not(:disabled) {
    background: #0b9185;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
.btn-ghost {
  background: none;
  border: none;
  color: #8ab0cc;
  font-size: 13px;
  cursor: pointer;
  text-align: center;
  margin-top: 0.5rem;
  padding: 4px;
  &:hover {
    color: #fff;
  }
}
.error {
  margin: 0.6rem 0 0;
  color: #ff4a96;
  font-size: 13px;
}
.form-footer {
  margin-top: 1rem;
  font-size: 13px;
  color: #8ab0cc;
  text-align: center;
}
.link {
  color: #1ab188;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
.v-footer {
  background: none;
  margin-top: -9vh;
}
</style>
