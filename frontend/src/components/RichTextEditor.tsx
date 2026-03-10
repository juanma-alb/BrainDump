import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  disabled?: boolean;
}

export default function RichTextEditor({ content, onChange, disabled }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Efecto para actualizar el editor si el contenido cambia desde afuera 
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`flex flex-col border-2 rounded-2xl overflow-hidden transition-all duration-200 ${disabled ? 'opacity-50' : 'bg-gray-200 dark:bg-slate-900/50 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:border-blue-500 border-transparent dark:border-slate-700'}`}>
      {/* Barra de Herramientas */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200/50 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md transition-colors">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${editor.isActive('bold') ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm'}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-serif italic transition-all ${editor.isActive('italic') ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm'}`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={disabled}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold underline transition-all ${editor.isActive('underline') ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm'}`}
        >
          U
        </button>
        
        <div className="w-px h-5 bg-gray-300 dark:bg-slate-600 mx-1 rounded-full transition-colors"></div>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          disabled={disabled}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm'}`}
        >
          ⫷
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          disabled={disabled}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm'}`}
        >
          ≡
        </button>
      </div>
      
      <div className="p-5 min-h-[250px] max-h-[400px] overflow-y-auto prose prose-blue dark:prose-invert max-w-none focus:outline-none transition-colors">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}