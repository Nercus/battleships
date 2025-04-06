<template>
  <div class="flex flex-col items-center justify-center gap-4 lg:gap-10 w-full max-w-lg p-4 lg:p-20">
    <h1 class="text-3xl font-black tracking-wide">
      Host Connect
    </h1>
    <SimpleSeparator />
    <Button type="muted" @click="copyInviteLink">
      <Icon class="fluent--link-24-filled" />
      Copy Invite Link
    </Button>
    <div class="flex flex-col items-center justify-center gap-2 w-full max-w-lg p-4 lg:p-20">
      <h2 class="text-xl font-bold">
        Paste confirmation code
      </h2>
      <Textarea />
    </div>
  </div>
</template>

<script setup lang="ts">
function copyInviteLink() {
  // Logic to copy the invite link to the clipboard
  push.success({
    title: 'Invite link copied to clipboard!',
    message: 'You can now share this link with your battleship buddy.',
    duration: 3000,
  })
}
</script>
