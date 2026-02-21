"use client";
import { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface EditorContextType {
  instance: ReactFlowInstance<Node, Edge> | null;
  setEditorInstance: (instance: ReactFlowInstance<Node, Edge>) => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

interface EditorProviderProps {
  children: ReactNode;
}

function EditorProvider({ children }: EditorProviderProps) {
  const [editorInstance, setEditorInstance] = useState<ReactFlowInstance<
    Node,
    Edge
  > | null>(null);
  return (
    <EditorContext.Provider
      value={{ instance: editorInstance, setEditorInstance }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within EditorProvider");
  }
  return context;
}

export default EditorProvider;
