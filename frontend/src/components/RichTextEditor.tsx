import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect } from 'react';

const extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
  }),
  Underline,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
];

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  disabled?: boolean;
}

export default function RichTextEditor({ content, onChange, disabled }: RichTextEditorProps) {
  const editor = useEditor({
    extensions,
    content: content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const MenuButton = ({ 
    isActive, onClick, children, title 
  }: { 
    isActive: boolean; onClick: () => void; children: React.ReactNode; title: string 
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all ${
        isActive 
          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 shadow-sm' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );

  const Divider = () => (
    <div className="shrink-0 w-px h-5 bg-gray-300 dark:bg-slate-600 mx-1 rounded-full transition-colors"></div>
  );

  return (
    <div className={`flex flex-col border-2 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 ${
        disabled 
          ? 'opacity-50' 
          : 'bg-gray-50 dark:bg-slate-900/50 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:border-blue-500 border-gray-200/80 dark:border-slate-700'
      }`}
    >
      <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto sm:overflow-visible items-center gap-1 p-2 border-b border-gray-200/80 dark:border-slate-700/80 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md transition-colors sticky top-0 z-10 custom-scrollbar pb-2 sm:pb-2">
        
        {/* Formato de Texto */}
        <MenuButton title="Negrita" isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <span className="font-bold">B</span>
        </MenuButton>
        <MenuButton title="Cursiva" isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <span className="font-serif italic">I</span>
        </MenuButton>
        <MenuButton title="Subrayado" isActive={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span className="font-semibold underline">U</span>
        </MenuButton>
        <MenuButton title="Tachado" isActive={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <span className="line-through">S</span>
        </MenuButton>

        <Divider />

        {/* Encabezados */}
        <MenuButton title="Título Principal" isActive={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <span className="font-bold text-base">H1</span>
        </MenuButton>
        <MenuButton title="Subtítulo" isActive={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <span className="font-bold text-sm">H2</span>
        </MenuButton>
        <MenuButton title="Sección" isActive={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <span className="font-bold text-xs">H3</span>
        </MenuButton>

        <Divider />

        {/* Listas y Citas */}
        <MenuButton title="Lista con viñetas" isActive={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <span>•=</span>
        </MenuButton>
        <MenuButton title="Lista numerada" isActive={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <span className="text-xs">1.=</span>
        </MenuButton>
        <MenuButton title="Cita (Blockquote)" isActive={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <span className="font-serif font-bold">❞</span>
        </MenuButton>

        <Divider />

        {/* Alineación */}
        <MenuButton title="Alinear a la izquierda" isActive={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
          ⫷
        </MenuButton>
        <MenuButton title="Centrar" isActive={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
          ≡
        </MenuButton>
        <MenuButton title="Alinear a la derecha" isActive={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
          ⫸
        </MenuButton>
      </div>
      
      <div 
        className="p-4 sm:p-5 cursor-text h-[250px] sm:h-[350px] overflow-y-auto custom-scrollbar bg-transparent transition-colors"
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent 
          editor={editor} 
          className="prose prose-blue dark:prose-invert max-w-none focus:outline-none text-sm sm:text-base
          prose-headings:mt-4 prose-headings:mb-2 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0
          [&>.ProseMirror]:min-h-full [&>.ProseMirror]:outline-none" 
        />
      </div>
    </div>
  );
}