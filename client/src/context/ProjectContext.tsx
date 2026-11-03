import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectFile } from '../types';

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  activeFile: ProjectFile | null;
  openFileIds: string[];
  isLoading: boolean;
  setActiveProject: (project: Project) => void;
  openFile: (fileId: string) => void;
  closeFile: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  createFile: (name: string, language?: string, initialContent?: string) => ProjectFile;
  deleteFile: (fileId: string) => void;
  renameFile: (fileId: string, newName: string) => void;
  changeLanguage: (fileId: string, language: string) => void;
  createProject: (name: string, description: string, language: string, template?: string) => Promise<Project>;
  saveCurrentProject: () => Promise<void>;
  resetProjectCode: () => void;
}

const DEFAULT_PROJECT: Project = {
  id: 'proj_ai_engine',
  userId: 'usr_demo_1',
  name: 'Smart Search & Vector Engine',
  description: 'Production vector search indexing algorithms and cosine similarity cache',
  language: 'typescript',
  activeFileId: 'f_index',
  files: [
    {
      id: 'f_index',
      name: 'index.ts',
      path: '/index.ts',
      language: 'typescript',
      content: `// CodeBuddy AI - Smart Search & Vector Engine
export interface VectorDocument {
  id: string;
  embedding: number[];
  metadata: Record<string, any>;
}

export class VectorStore {
  private docs: VectorDocument[] = [];

  public add(doc: VectorDocument): void {
    this.docs.push(doc);
  }

  public cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1e-9);
  }

  public query(target: number[], topK: number = 3): { doc: VectorDocument; score: number }[] {
    return this.docs
      .map(doc => ({ doc, score: this.cosineSimilarity(target, doc.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}

// Quick Test execution
const store = new VectorStore();
store.add({ id: '1', embedding: [0.9, 0.1, 0.2], metadata: { title: 'CodeBuddy Core' } });
store.add({ id: '2', embedding: [0.1, 0.8, 0.1], metadata: { title: 'Compiler Engine' } });
console.log("Vector Search Results:", store.query([0.85, 0.15, 0.2], 1));
`,
    },
    {
      id: 'f_utils',
      name: 'mathUtils.ts',
      path: '/mathUtils.ts',
      language: 'typescript',
      content: `export function normalize(vector: number[]): number[] {
  const norm = Math.hypot(...vector);
  return norm === 0 ? vector : vector.map(v => v / norm);
}

export function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((acc, val, i) => acc + Math.pow(val - (b[i] || 0), 2), 0));
}
`,
    },
    {
      id: 'f_readme',
      name: 'README.md',
      path: '/README.md',
      language: 'markdown',
      content: `# Vector Search Engine
High-throughput nearest-neighbor embedding index written in TypeScript.
Run code to execute test query in console.
`,
    }
  ],
  isPublic: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([DEFAULT_PROJECT]);
  const [activeProject, setActiveProjectState] = useState<Project>(DEFAULT_PROJECT);
  const [openFileIds, setOpenFileIds] = useState<string[]>(['f_index', 'f_utils']);
  const [activeFileId, setActiveFileId] = useState<string>('f_index');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch projects from server on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects);
          setActiveProjectState(data.projects[0]);
          if (data.projects[0].files.length > 0) {
            setActiveFileId(data.projects[0].files[0].id);
            setOpenFileIds(data.projects[0].files.map((f: ProjectFile) => f.id));
          }
        }
      }
    } catch (err) {
      console.warn('Using local project cache:', err);
    }
  };

  const activeFile = activeProject?.files.find(f => f.id === activeFileId) || activeProject?.files[0] || null;

  const setActiveProject = (proj: Project) => {
    setActiveProjectState(proj);
    if (proj.files.length > 0) {
      setActiveFileId(proj.files[0].id);
      setOpenFileIds(proj.files.slice(0, 3).map(f => f.id));
    } else {
      setActiveFileId('');
      setOpenFileIds([]);
    }
  };

  const openFile = (fileId: string) => {
    if (!openFileIds.includes(fileId)) {
      setOpenFileIds(prev => [...prev, fileId]);
    }
    setActiveFileId(fileId);
  };

  const closeFile = (fileId: string) => {
    const updated = openFileIds.filter(id => id !== fileId);
    setOpenFileIds(updated);
    if (activeFileId === fileId) {
      setActiveFileId(updated[updated.length - 1] || '');
    }
  };

  const updateFileContent = (fileId: string, content: string) => {
    setActiveProjectState(prev => {
      const updatedFiles = prev.files.map(f => (f.id === fileId ? { ...f, content } : f));
      return {
        ...prev,
        files: updatedFiles,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const createFile = (name: string, language: string = 'typescript', initialContent: string = '') => {
    // Detect language from extension if not explicitly set
    let lang = language;
    if (name.endsWith('.py')) lang = 'python';
    else if (name.endsWith('.cpp') || name.endsWith('.cc')) lang = 'cpp';
    else if (name.endsWith('.java')) lang = 'java';
    else if (name.endsWith('.js') || name.endsWith('.jsx')) lang = 'javascript';
    else if (name.endsWith('.ts') || name.endsWith('.tsx')) lang = 'typescript';
    else if (name.endsWith('.json')) lang = 'json';
    else if (name.endsWith('.md')) lang = 'markdown';
    else if (name.endsWith('.html')) lang = 'html';
    else if (name.endsWith('.css')) lang = 'css';

    const newFile: ProjectFile = {
      id: `f_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name,
      path: `/${name}`,
      language: lang,
      content: initialContent || `// ${name}\n`,
    };

    setActiveProjectState(prev => ({
      ...prev,
      files: [...prev.files, newFile],
    }));

    setOpenFileIds(prev => [...prev, newFile.id]);
    setActiveFileId(newFile.id);
    return newFile;
  };

  const deleteFile = (fileId: string) => {
    setActiveProjectState(prev => {
      const remaining = prev.files.filter(f => f.id !== fileId);
      return { ...prev, files: remaining };
    });
    closeFile(fileId);
  };

  const renameFile = (fileId: string, newName: string) => {
    setActiveProjectState(prev => {
      const updated = prev.files.map(f => (f.id === fileId ? { ...f, name: newName, path: `/${newName}` } : f));
      return { ...prev, files: updated };
    });
  };

  const changeLanguage = (fileId: string, language: string) => {
    setActiveProjectState(prev => {
      const updated = prev.files.map(f => (f.id === fileId ? { ...f, language } : f));
      return { ...prev, files: updated };
    });
  };

  const createProject = async (name: string, description: string, language: string, template: string = 'default'): Promise<Project> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, language, template }),
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(prev => [data.project, ...prev]);
        setActiveProject(data.project);
        return data.project;
      }
    } catch (err) {
      console.warn('Fallback to local project creation:', err);
    } finally {
      setIsLoading(false);
    }

    // Local fallback
    const fallbackProj: Project = {
      id: `proj_${Date.now()}`,
      userId: 'usr_demo_1',
      name,
      description,
      language,
      files: [
        {
          id: `f_main_${Date.now()}`,
          name: language === 'python' ? 'main.py' : 'index.ts',
          path: language === 'python' ? '/main.py' : '/index.ts',
          language,
          content: `// New ${name} Project\nconsole.log("Ready to ship with CodeBuddy AI!");\n`,
        }
      ],
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects(prev => [fallbackProj, ...prev]);
    setActiveProject(fallbackProj);
    return fallbackProj;
  };

  const saveCurrentProject = async () => {
    if (!activeProject) return;
    try {
      await fetch(`/api/projects/${activeProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: activeProject.name,
          files: activeProject.files,
          activeFileId,
        }),
      });
    } catch (err) {
      console.warn('Local save updated:', err);
    }
  };

  const resetProjectCode = () => {
    if (activeFile) {
      updateFileContent(activeFile.id, `// Reset file\n// Write your code here or ask CodeBuddy AI!\n`);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        activeFile,
        openFileIds,
        isLoading,
        setActiveProject,
        openFile,
        closeFile,
        updateFileContent,
        createFile,
        deleteFile,
        renameFile,
        changeLanguage,
        createProject,
        saveCurrentProject,
        resetProjectCode,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
};
