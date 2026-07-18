// src/app/dashboard/w/[slug]/projects/[projectId]/_components/views/slash-command.tsx
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';

// Add the generic type here to tell TS we are passing a custom suggestion object
export const SlashCommand = Extension.create<{ suggestion: any }>({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});