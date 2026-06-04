'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  minimal?: boolean
}

export function RichTextEditor({ value, onChange, minimal = false }: RichTextEditorProps) {
  const modules = useMemo(() => ({
    toolbar: minimal
      ? [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }]
        ]
      : [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
        ],
  }), [minimal])

  const handleChange = (content: string) => {
    if (content !== value) {
      onChange(content)
    }
  }

  return (
    <div className="bg-white rounded-md overflow-hidden">
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={handleChange}
        modules={modules}
      />
      <style jsx global>{`
        .ql-editor {
          min-height: ${minimal ? '80px' : '300px'};
          font-size: 16px;
        }
        .ql-toolbar.ql-snow {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          background-color: #f8fafc;
          border-color: #e2e8f0;
        }
        .ql-container.ql-snow {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          border-color: #e2e8f0;
        }
      `}</style>
    </div>
  )
}
