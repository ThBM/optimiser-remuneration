<script lang="ts" setup>
defineProps<{
  text?: string;
}>();
</script>

<template>
  <UPopover mode="hover">
    <UButton
      size="xs"
      color="neutral"
      variant="ghost"
      icon="i-lucide-help-circle"
      class="opacity-60 hover:opacity-100"
      aria-label="Aide"
    />
    <template #content>
      <div class="p-4 max-w-sm">
        <slot>
          <p class="text-sm text-gray-700">{{ text }}</p>
        </slot>
      </div>
    </template>
  </UPopover>
</template>
