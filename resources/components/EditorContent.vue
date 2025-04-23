<template>
  <div class="mx-w-4xl container mx-auto my-8">
    <section
      v-if="editor"
      class="buttons flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-r border-l border-gray-400 p-4"
    >
      <button
        class="rounded px-2 py-1"
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{
          'bg-blue-500 text-white': editor.isActive('bold'),
          'bg-gray-300 hover:bg-blue-500 hover:text-white':
            !editor.isActive('bold'),
        }"
      >
        Bold
      </button>
      <button
        class="rounded px-2 py-1"
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{
          'bg-blue-500 text-white': editor.isActive('italic'),
          'bg-gray-300 hover:bg-blue-500 hover:text-white':
            !editor.isActive('italic'),
        }"
      >
        Italic
      </button>
      <button
        class="rounded px-2 py-1"
        @click="editor.chain().focus().toggleStrike().run()"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="{
          'bg-blue-500 text-white': editor.isActive('strike'),
          'bg-gray-300 hover:bg-blue-500 hover:text-white':
            !editor.isActive('strike'),
        }"
      >
        Strike
      </button>
      <button
        class="rounded px-2 py-1"
        @click="editor.chain().focus().toggleCode().run()"
        :disabled="!editor.can().chain().focus().toggleCode().run()"
        :class="{
          'bg-blue-500 text-white': editor.isActive('code'),
          'bg-gray-300 hover:bg-blue-500 hover:text-white':
            !editor.isActive('code'),
        }"
      >
        Code
      </button>
      <button
        class="rounded px-2 py-1"
        @click="editor.chain().focus().setParagraph().run()"
        :class="{
          'bg-blue-500 text-white': editor.isActive('paragraph'),
          'bg-gray-300 hover:bg-blue-500 hover:text-white':
            !editor.isActive('paragraph'),
        }"
      >
        Paragraph
      </button>
      <button
        class="rounded px-2 py-1"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{
          'bg-blue-500 text-white': editor.isActive('heading', {
            level: 1,
          }),
          'bg-gray-300 hover:bg-blue-500 hover:text-white': !editor.isActive(
            'heading',
            { level: 1 },
          ),
        }"
      >
        H1
      </button>
      <button
        class="rounded px-2 py-1"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{
          'bg-blue-500 text-white': editor.isActive('heading', {
            level: 2,
          }),
          'bg-gray-300 hover:bg-blue-500 hover:text-white': !editor.isActive(
            'heading',
            { level: 2 },
          ),
        }"
      >
        H2
      </button>
      <button
        class="rounded px-2 py-1"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{
          'bg-blue-500 text-white': editor.isActive('heading', {
            level: 3,
          }),
          'bg-gray-300 hover:bg-blue-500 hover:text-white': !editor.isActive(
            'heading',
            { level: 3 },
          ),
        }"
      >
        H3
      </button>
      <button
        class="rounded px-2 py-1"
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        :class="{
          'bg-blue-500 text-white': editor.isActive('heading', {
            level: 4,
          }),
          'bg-gray-300 hover:bg-blue-500 hover:text-white': !editor.isActive(
            'heading',
            { level: 4 },
          ),
        }"
      >
        H4
      </button>
      <button
        class="rounded px-2 py-1"
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
        :class="{
          'bg-blue-500 text-white': editor.isActive('heading', {
            level: 5,
          }),
          'bg-gray-300 hover:bg-blue-500 hover:text-white': !editor.isActive(
            'heading',
            { level: 5 },
          ),
        }"
      >
        H5
      </button>
      <button
        class="rounded px-2 py-1"
        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
        :class="{
          'bg-blue-500 text-white': editor.isActive('heading', {
            level: 6,
          }),
          'bg-gray-300 hover:bg-blue-500 hover:text-white': !editor.isActive(
            'heading',
            { level: 6 },
          ),
        }"
      >
        H6
      </button>
      <button
        class="rounded px-2 py-1"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{
          'bg-blue-500 text-white': editor.isActive('bulletList'),
          'bg-gray-300 hover:bg-blue-500 hover:text-white':
            !editor.isActive('bulletList'),
        }"
      >
        Bullet list
      </button>
      <button
        class="rounded px-2 py-1"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{
          'bg-blue-500 text-white': editor.isActive('orderedList'),
          'bg-gray-300 hover:bg-blue-500 hover:text-white':
            !editor.isActive('orderedList'),
        }"
      >
        Ordered list
      </button>
      <button
        class="rounded px-2 py-1"
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{
          'bg-blue-500 text-white': editor.isActive('codeBlock'),
          'bg-gray-300 hover:bg-blue-500 hover:text-white':
            !editor.isActive('codeBlock'),
        }"
      >
        Code block
      </button>
      <button
        class="rounded px-2 py-1"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{
          'bg-blue-500 text-white': editor.isActive('blockquote'),
          'bg-gray-300 hover:bg-blue-500 hover:text-white':
            !editor.isActive('blockquote'),
        }"
      >
        Blockquote
      </button>
      <button
        class="rounded px-2 py-1"
        @click="editor.chain().focus().setHorizontalRule().run()"
      >
        Horizontal rule
      </button>
      <button
        class="rounded px-2 py-1"
        @click="editor.chain().focus().setHardBreak().run()"
      >
        Hard break
      </button>
      <button
        class="rounded px-2 py-1 disabled:text-gray-400"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()"
      >
        Undo
      </button>
      <button
        class="rounded px-2 py-1 disabled:text-gray-400"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()"
      >
        Redo
      </button>
    </section>
    <div class="tiptap">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, onMounted } from "vue";

import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import "../css/tiptap.css";

export default defineComponent({
  components: {
    EditorContent,
  },

  props: {
    modelValue: String,
    updatedModelValue: String,
  },

  emits: ["update-model-value"],

  setup(props, context) {
    const editor = useEditor({
      content: props.modelValue,
      onUpdate: ({ editor }) => {
        context.emit("update-model-value", editor.getHTML());
      },
      extensions: [StarterKit],
      editorProps: {
        attributes: {
          class:
            "border border-gray-400 p-4 min-h-[14rem] max-h-[14rem] overflow-y-auto outline-none",
        },
      },
    });

    watch(
      () => props.updatedModelValue,
      (newValue) => {
        editor.value.commands.setContent(newValue);
        console.log("eyy", newValue);
      },
    );

    return {
      editor,
    };
  },
});
</script>
