// src/app/dashboard/w/[slug]/projects/[projectId]/_components/views/suggestion.ts
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { CommandList } from './command-list';
import { Type, Heading1, Heading2, List, ListOrdered } from 'lucide-react';

export const getSuggestionItems = ({ query }: { query: string }) => {
    // TODO : Add more tools
  return [
    {
      title: 'Text',
      icon: Type,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setNode('paragraph').run();
      },
    },
    {
      title: 'Heading 1',
      icon: Heading1,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
      },
    },
    {
      title: 'Heading 2',
      icon: Heading2,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
      },
    },
    {
      title: 'Bullet List',
      icon: List,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: 'Numbered List',
      icon: ListOrdered,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
  ].filter((item) => item.title.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5);
};

export const renderItems = () => {
  let component: ReactRenderer;
  let popup: any;

  return {
    onStart: (props: any) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      });

      popup = tippy('body', {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
      });
    },
    onUpdate: (props: any) => {
      component.updateProps(props);
      popup[0].setProps({
        getReferenceClientRect: props.clientRect,
      });
    },
    onKeyDown: (props: any) => {
      if (props.event.key === 'Escape') {
        popup[0].hide();
        return true;
      }
      return component.ref?.onKeyDown(props);
    },
    onExit: () => {
      popup[0].destroy();
      component.destroy();
    },
  };
};