"use client";
import { adminContent } from "@features/blog/admin/adminContent";
import { AdminButton, AdminDialog, AdminField, AdminInput } from "@features/blog/admin/components/AdminUi";
import type { BlogNode } from "@features/blog/lib/blog.types";
import { normalizeLink } from "@features/blog/lib/blogUtils";
import { cn } from "@shared/lib/utils";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

const copy = adminContent.editor;
const HEADING_LEVELS = [1, 2, 3, 4] as const;
const EMPTY_DOC: JSONContent[] = [{ type: "paragraph" }];

function ToolbarButton({ label, active = false, disabled = false, onClick }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn(
        "rounded-lg px-2.5 py-1.5 text-[13px] font-semibold transition-colors disabled:opacity-35",
        active ? "bg-primary text-white" : "text-[#12141F]/70 hover:bg-black/6 hover:text-[#12141F]"
      )}
    >
      {label}
    </button>
  );
}

interface RichTextEditorProps {
  initialBody: BlogNode[];
  onChange: (body: BlogNode[]) => void;
  onUploadImage: (file: File) => Promise<string | null>;
  uploading?: boolean;
}

export default function RichTextEditor({ initialBody, onChange, onUploadImage, uploading = false }: RichTextEditorProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [linkDialog, setLinkDialog] = useState<{ value: string; isEditing: boolean; error: string | null } | null>(null);
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [...HEADING_LEVELS] },
        codeBlock: false,
        code: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" }
      }),
      Image.configure({ allowBase64: false }),
      Placeholder.configure({ placeholder: copy.bodyPlaceholder })
    ],
    content: { type: "doc", content: initialBody.length > 0 ? (initialBody as JSONContent[]) : EMPTY_DOC },
    onUpdate: ({ editor: current }) => onChange((current.getJSON().content ?? []) as BlogNode[])
  });

  if (!editor) {
    return <div className="h-[28rem] animate-pulse rounded-2xl bg-black/6" />;
  }

  const openLinkDialog = () => {
    const href = (editor.getAttributes("link").href as string | undefined) ?? "";
    setLinkDialog({ value: href, isEditing: Boolean(href), error: null });
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkDialog(null);
  };

  const applyLink = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!linkDialog) {
      return;
    }
    const href = normalizeLink(linkDialog.value);
    if (!href) {
      setLinkDialog({ ...linkDialog, error: copy.linkDialog.invalid });
      return;
    }
    const chain = editor.chain().focus();
    if (editor.state.selection.empty && !editor.isActive("link")) {
      chain.insertContent({ type: "text", text: href, marks: [{ type: "link", attrs: { href } }] }).run();
    } else {
      chain.extendMarkRange("link").setLink({ href }).run();
    }
    setLinkDialog(null);
  };

  const handleImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    const src = await onUploadImage(file);
    if (src) {
      editor.chain().focus().setImage({ src }).run();
    }
  };

  const can = editor.can();
  const labels = copy.toolbar;

  return (
    <div className="blog-editor rounded-2xl border border-black/12 bg-white">
      <div
        role="toolbar"
        aria-label={copy.body}
        className="sticky top-16 z-10 flex flex-wrap items-center gap-0.5 rounded-t-2xl border-b border-black/8 bg-white p-1.5"
      >
        {HEADING_LEVELS.map((level) => (
          <ToolbarButton
            key={level}
            label={`H${level}`}
            active={editor.isActive("heading", { level })}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          />
        ))}
        <span aria-hidden className="mx-1 h-5 w-px bg-black/10" />
        <ToolbarButton label={labels.bold} active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
        <ToolbarButton label={labels.italic} active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
        <ToolbarButton label={labels.bulletList} active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <ToolbarButton label={labels.numberedList} active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        <ToolbarButton label={labels.quote} active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <ToolbarButton label={labels.link} active={editor.isActive("link")} onClick={openLinkDialog} />
        <ToolbarButton label={uploading ? copy.uploading : labels.image} disabled={uploading} onClick={() => fileInput.current?.click()} />
        <span aria-hidden className="mx-1 h-5 w-px bg-black/10" />
        <ToolbarButton label={labels.undo} disabled={!can.undo()} onClick={() => editor.chain().focus().undo().run()} />
        <ToolbarButton label={labels.redo} disabled={!can.redo()} onClick={() => editor.chain().focus().redo().run()} />
        <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handleImage} />
      </div>
      <EditorContent editor={editor} />

      {linkDialog && (
        <AdminDialog title={linkDialog.isEditing ? copy.linkDialog.editTitle : copy.linkDialog.addTitle} onClose={() => setLinkDialog(null)}>
          <form onSubmit={applyLink} noValidate>
            <AdminField label={copy.linkDialog.label} error={linkDialog.error}>
              <AdminInput
                name="link"
                type="url"
                inputMode="url"
                autoComplete="off"
                placeholder={copy.linkDialog.placeholder}
                value={linkDialog.value}
                error={Boolean(linkDialog.error)}
                onChange={(event) => setLinkDialog({ ...linkDialog, value: event.target.value, error: null })}
              />
            </AdminField>
            <div className="mt-6 flex flex-wrap items-center justify-end gap-2.5">
              {linkDialog.isEditing && (
                <AdminButton variant="ghost" className="mr-auto px-2 text-[#e5484d] hover:text-[#e5484d]" onClick={removeLink}>
                  {copy.linkDialog.remove}
                </AdminButton>
              )}
              <AdminButton variant="secondary" onClick={() => setLinkDialog(null)}>
                {copy.linkDialog.cancel}
              </AdminButton>
              <AdminButton type="submit">{linkDialog.isEditing ? copy.linkDialog.update : copy.linkDialog.add}</AdminButton>
            </div>
          </form>
        </AdminDialog>
      )}
    </div>
  );
}
