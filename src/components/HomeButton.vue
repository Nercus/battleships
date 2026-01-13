<template>
  <AlertDialogRoot>
    <AlertDialogTrigger v-if="!isHomePage" as-child>
      <CommonButton
        class="top-2 z-10 fixed inset-x-0 opacity-70 hover:opacity-100 mx-auto w-fit" size="small" type="ghost">
        Go Home
      </CommonButton>
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay class="z-30 fixed inset-0 bg-base-300/70" />
      <AlertDialogContent class="top-1/2 md:left-1/2 z-50 fixed inset-x-0 bg-base-100 shadow-2xl px-8 py-6 md:rounded-lg -translate-y-1/2 md:-translate-x-1/2">
        <AlertDialogTitle class="font-semibold text-xl">
          Do you want to go back to the home page?
        </AlertDialogTitle>
        <AlertDialogDescription class="mt-4 mb-5 text-sm text-base-700 leading-normal">
          Going back to the home page will end your current game. You will not be able to resume it later.
        </AlertDialogDescription>
        <div class="flex justify-end gap-4">
          <AlertDialogAction as-child>
            <CommonButton size="small" type="ghost" @click="goHome">
              Yes, go back
            </CommonButton>
          </AlertDialogAction>
          <AlertDialogCancel as-child>
            <CommonButton size="small" type="error">
              No, stay here
            </CommonButton>
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const isHomePage = computed(() => route.name === 'Home' || route.path === '/')

function goHome() {
  router.push({ name: 'Home' })
}
</script>
