"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Subscript,
  Superscript,
  FontColor,
  FontBackgroundColor,
  FontSize,
  FontFamily,
  Highlight,
  Alignment,
  CodeBlock,
  BlockQuote,
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
  Link,
  List,
  ListProperties,
  HorizontalLine,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageResize,
  ImageUpload,
  FileRepository,
  SourceEditing,
  GeneralHtmlSupport,
  PasteFromOffice,
  Plugin,
  ButtonView,
  type Editor,
} from "ckeditor5";

import { MediaPickerDialog } from "@/components/media/media-picker-dialog";
import { resolveMediaUrl } from "@/lib/api-client";
import type { MediaAsset } from "@growthcoder/types";
import "./ckeditor.css";

interface CKEditorCustomProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Media icon SVG
const MEDIA_ICON_SVG = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
  <circle cx="9" cy="9" r="2"/>
  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
</svg>
`;

/**
 * Custom Upload Adapter for CKEditor 5
 */
class MediaUploadAdapter {
  private loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file: File) =>
        new Promise((resolve, reject) => {
          const data = new FormData();
          data.append("file", file);

          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("admin_token")
              : null;
          const apiBase =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

          fetch(`${apiBase}/api/admin/media/upload`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: data,
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.success && res.data) {
                const asset = res.data as MediaAsset;
                resolve({
                  default: resolveMediaUrl(asset.fileUrl),
                });
              } else {
                reject(res.message || "Gagal mengunggah gambar ke server.");
              }
            })
            .catch((err) => {
              reject(err.message || "Gagal menghubungi server.");
            });
        }),
    );
  }

  abort() {
    // Abort handling if needed
  }
}

function CustomUploadAdapterPlugin(editor: Editor) {
  editor.plugins.get(FileRepository).createUploadAdapter = (loader: any) => {
    return new MediaUploadAdapter(loader);
  };
}

export function CKEditorCustom({
  value,
  onChange,
  placeholder = "Tulis konten artikel di sini...",
}: CKEditorCustomProps) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const editorInstanceRef = useRef<ClassicEditor | null>(null);

  // Register global callback for Media Bridge Plugin
  useEffect(() => {
    (window as any).__openCkeditorMediaPicker = () => {
      setMediaPickerOpen(true);
    };
    return () => {
      delete (window as any).__openCkeditorMediaPicker;
    };
  }, []);

  // Custom Toolbar Button Plugin that triggers the Media Picker Dialog
  class MediaLibraryBridgePlugin extends Plugin {
    init() {
      const editor = this.editor;
      editor.ui.componentFactory.add("mediaLibrary", (locale) => {
        const view = new ButtonView(locale);
        view.set({
          label: "Sisipkan dari Media Library",
          icon: MEDIA_ICON_SVG,
          tooltip: true,
        });

        view.on("execute", () => {
          if (typeof (window as any).__openCkeditorMediaPicker === "function") {
            (window as any).__openCkeditorMediaPicker();
          }
        });

        return view;
      });
    }
  }

  const handleMediaSelect = useCallback(
    (selected: MediaAsset | MediaAsset[]) => {
      const editor = editorInstanceRef.current;
      if (!editor) return;

      const items = Array.isArray(selected) ? selected : [selected];

      editor.model.change((writer) => {
        for (const item of items) {
          const fullUrl = resolveMediaUrl(item.fileUrl);
          const imageElement = writer.createElement("imageBlock", {
            src: fullUrl,
            alt: item.altText || item.fileName,
          });
          editor.model.insertContent(
            imageElement,
            editor.model.document.selection,
          );
        }
      });
    },
    [],
  );

  const editorConfiguration = {
    plugins: [
      Essentials,
      Paragraph,
      Heading,
      Bold,
      Italic,
      Underline,
      Strikethrough,
      Code,
      Subscript,
      Superscript,
      FontColor,
      FontBackgroundColor,
      FontSize,
      FontFamily,
      Highlight,
      Alignment,
      CodeBlock,
      BlockQuote,
      Table,
      TableToolbar,
      TableProperties,
      TableCellProperties,
      Link,
      List,
      ListProperties,
      HorizontalLine,
      Image,
      ImageToolbar,
      ImageCaption,
      ImageStyle,
      ImageResize,
      ImageUpload,
      FileRepository,
      SourceEditing,
      GeneralHtmlSupport,
      PasteFromOffice,
      MediaLibraryBridgePlugin,
      CustomUploadAdapterPlugin,
    ],
    htmlSupport: {
      allow: [
        {
          name: /.*/,
          attributes: true,
          classes: true,
          styles: true,
        },
      ],
      disallow: [
        {
          name: /^(script|iframe|object|embed)$/,
        },
      ],
    },
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "code",
        "subscript",
        "superscript",
        "|",
        "fontColor",
        "fontBackgroundColor",
        "fontSize",
        "highlight",
        "alignment",
        "|",
        "link",
        "bulletedList",
        "numberedList",
        "|",
        "codeBlock",
        "blockQuote",
        "insertTable",
        "horizontalLine",
        "|",
        "mediaLibrary",
        "|",
        "sourceEditing",
        "|",
        "undo",
        "redo",
      ],
      shouldNotGroupWhenFull: false,
    },
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
      ],
    },
    codeBlock: {
      languages: [
        { language: "typescript", label: "TypeScript" },
        { language: "javascript", label: "JavaScript" },
        { language: "html", label: "HTML" },
        { language: "css", label: "CSS" },
        { language: "python", label: "Python" },
        { language: "sql", label: "SQL" },
        { language: "bash", label: "Bash / Shell" },
        { language: "json", label: "JSON" },
        { language: "php", label: "PHP" },
        { language: "markdown", label: "Markdown" },
      ],
    },
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
      ],
    },
    image: {
      toolbar: [
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "|",
        "toggleImageCaption",
        "imageTextAlternative",
        "|",
        "resizeImage",
      ],
    },
    placeholder,
    licenseKey: "GPL",
  };

  return (
    <div className="ck-editor-wrapper">
      <CKEditor
        editor={ClassicEditor}
        config={editorConfiguration as any}
        data={value}
        onReady={(editor) => {
          editorInstanceRef.current = editor as unknown as ClassicEditor;
        }}
        onChange={(_, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />

      {/* Media Picker Dialog Bridge */}
      <MediaPickerDialog
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={handleMediaSelect}
        multiple={true}
        acceptTypes={["image"]}
        title="Pilih Gambar untuk Konten Artikel"
      />
    </div>
  );
}
