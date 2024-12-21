import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code,
  Heading1,
  Heading2,
  ImageIcon,
  Loader2,
  Save,
  Link as LinkIcon,
  Strikethrough,
  CheckSquare,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

const lowlight = createLowlight(common);
const STORAGE_KEY = 'blog-editor-content';

const MenuBar = ({ editor, onImageUpload, isSaving }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await onImageUpload(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  if (!editor) return null;

  return (
    <div className="border-b dark:border-gray-700 mb-4 sticky top-0 bg-white dark:bg-gray-900 z-10">
      <div className="flex flex-wrap gap-2 p-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive('bold') ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive('italic') ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive('strike') ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        >
          <Strikethrough className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        >
          <Heading1 className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        >
          <Heading2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive('bulletList') ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive('orderedList') ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        >
          <ListOrdered className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive('taskList') ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        >
          <CheckSquare className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive('blockquote') ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        >
          <Quote className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive('codeBlock') ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        >
          <Code className="w-5 h-5" />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive('link') ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <LinkIcon className="w-5 h-5" />
          </button>
          {showLinkInput && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded shadow-lg p-2 flex">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Enter URL"
                className="text-sm border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                onClick={setLink}
                className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Add
              </button>
            </div>
          )}
        </div>
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
          </button>
        </div>
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        >
          <AlignLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        >
          <AlignCenter className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        >
          <AlignRight className="w-5 h-5" />
        </button>
        <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Saved</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const BlogEditor = ({ onReady, onPublish }) => {
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [imageUrlMap, setImageUrlMap] = useState(new Map());
  const [pendingUploads, setPendingUploads] = useState(new Set());

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your blog post...',
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'mx-auto max-w-full rounded-lg shadow-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:underline',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'rounded-lg bg-gray-100 dark:bg-gray-800 p-4 font-mono text-sm',
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px]',
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setIsSaving(true);
      const timeoutId = setTimeout(() => {
        const content = editor.getJSON();
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          title,
          content,
          lastSaved: Date.now(),
          imageUrlMap: Array.from(imageUrlMap.entries())
        }));
        setIsSaving(false);
      }, 500);
      return () => clearTimeout(timeoutId);
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { title: savedTitle, content, imageUrlMap: savedImageMap } = JSON.parse(saved);
      setTitle(savedTitle || '');
      if (editor && content) {
        editor.commands.setContent(content);
      }
      if (savedImageMap) {
        setImageUrlMap(new Map(savedImageMap));
      }
    }
  }, [editor]);

  const handleImageUpload = async (file) => {
    try {
      // Create local URL for immediate preview
      const localUrl = URL.createObjectURL(file);
      setPendingUploads(prev => new Set(prev).add(localUrl));
      
      // Insert image with local URL immediately
      editor.chain().focus().setImage({ src: localUrl }).run();
      
      // Upload to API
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      const { url: remoteUrl } = await response.json();
      
      // Store the mapping
      setImageUrlMap(prev => new Map(prev).set(localUrl, remoteUrl));
      setPendingUploads(prev => {
        const newSet = new Set(prev);
        newSet.delete(localUrl);
        return newSet;
      });

      return { localUrl, remoteUrl };
    } catch (error) {
      console.error('Error uploading image:', error);
      setPendingUploads(prev => {
        const newSet = new Set(prev);
        newSet.delete(localUrl);
        return newSet;
      });
      throw error;
    } finally {
      // Consider if you want to revoke the object URL here
      // URL.revokeObjectURL(localUrl);
    }
  };

  const getContent = (useRemoteUrls = false) => {
    if (!editor) return null;
    
    let html = editor.getHTML();
    
    if (useRemoteUrls && imageUrlMap.size > 0) {
      // Create a temporary DOM element to parse and modify the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Replace all image sources
      tempDiv.querySelectorAll('img').forEach(img => {
        const localUrl = img.getAttribute('src');
        const remoteUrl = imageUrlMap.get(localUrl);
        if (remoteUrl) {
          img.setAttribute('src', remoteUrl);
        }
      });
      
      // Get the modified HTML
      html = tempDiv.innerHTML;
    }
    
    return {
      title,
      content: html,
      hasPendingUploads: pendingUploads.size > 0
    };
  };

  useEffect(() => {
    onReady(() => getContent(true));
  }, [onReady, title, editor, imageUrlMap, pendingUploads]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          const savedContent = localStorage.getItem(STORAGE_KEY);
          const parsed = savedContent ? JSON.parse(savedContent) : {};
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            ...parsed,
            title: e.target.value,
            lastSaved: Date.now()
          }));
        }}
        placeholder="Untitled"
        className="w-full text-4xl font-bold mb-8 bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-600 focus:ring-0"
        spellCheck="false"
      />
      <MenuBar 
        editor={editor} 
        onImageUpload={handleImageUpload}
        isSaving={isSaving}
      />
      {pendingUploads.size > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-lg mb-4">
          <p className="text-sm flex items-center">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Uploading {pendingUploads.size} image{pendingUploads.size > 1 ? 's' : ''}...
          </p>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default BlogEditor;

