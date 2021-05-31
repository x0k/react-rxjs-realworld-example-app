import React from 'react'
import { useParams } from 'react-router-dom'

import { EditorContainer } from 'containers/editor'

export default function EditorUpdatePage() {
  const { slug } = useParams()
  return <EditorContainer slug={slug} />
}
