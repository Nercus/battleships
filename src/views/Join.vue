<template>
  <div class="flex flex-col justify-center items-center gap-4 lg:gap-10 p-4 lg:p-20 w-full max-w-lg lg:max-w-2xl">
    <h1 class="font-black text-xl tracking-wide">
      Join Game
    </h1>
  </div>
</template>

<script setup lang="ts">
const route = useRoute<'Join'>()
const router = useRouter()

const { joinRoom } = useConnection()

onMounted(() => {
  const joinCode = route.query.code as string | undefined
  if (joinCode) {
    joinRoom(joinCode)
  }
  else {
    push.error({
      message: 'No join code provided in URL.',
      title: 'Error joining room',
    })
    router.push({ name: 'Start Game' })
  }
})
</script>
