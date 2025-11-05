<script setup lang="ts"></script>

<template>
  <div class="grid grid-cols-2 m-4 p-1 bg-gray-300">
    <div class="bg-green-100">chat</div>
    <div class="w-md bg-white">
      <span class="flex items-center gap-2 m-1">
        <img class="size-12" src="/assets/account.svg" />
        <p>nombre.negocio</p>
      </span>
      <div class="aspect-square w-full bg-gray-400"></div>
      <span class="flex justify-between w-full">
        <span class="inline-flex">
          <img class="size-10" src="/assets/like.svg" />
          <img class="size-10" src="/assets/comment.svg" />
          <img class="size-10" src="/assets/send.svg" />
        </span>
        <img class="size-10" src="/assets/save.svg" />
      </span>
      <p class="mx-2">
        <b>nombre.negocio</b> descripcion IA: Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Ut semper metus in mi efficitur, in rutrum
        sapien luctus. Vestibulum egestas felis venenatis gravida blandit.
        Nullam fermentum gravida auctor. Etiam pretium egestas elit, congue
        mollis lacus iaculis id. Aenean vulputate blandit egestas. Maecenas
        pharetra porta tristique. Sed enim tellus, euismod eu nisi at, ultricies
        fringilla eros. Praesent mi leo, vehicula volutpat est id, elementum
        cursus magna. Etiam at porttitor tortor, sed tincidunt dolor.       </p>
    </div>
  </div>
</template>
