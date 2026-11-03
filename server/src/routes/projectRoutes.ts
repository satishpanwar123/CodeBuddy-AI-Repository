import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db, Project, ProjectFile } from '../db/storage.js';

export const projectRouter = Router();

// List all projects
projectRouter.get('/', (_req: Request, res: Response) => {
  const projects = Array.from(db.projects.values());
  return res.json({ projects });
});

// Get single project
projectRouter.get('/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id as string);
  const project = db.projects.get(id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  return res.json({ project });
});

// Create project
projectRouter.post('/', (req: Request, res: Response) => {
  try {
    const { name, description = '', language = 'typescript', template = 'default' } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const projectId = `proj_${uuidv4().slice(0, 8)}`;
    let initialFiles: ProjectFile[] = [];

    switch (template) {
      case 'python':
        initialFiles = [
          {
            id: 'f_main',
            name: 'main.py',
            path: '/main.py',
            language: 'python',
            content: `def main():\n    print("Hello from CodeBuddy AI in Python!")\n\nif __name__ == "__main__":\n    main()\n`,
          },
        ];
        break;
      case 'cpp':
        initialFiles = [
          {
            id: 'f_main',
            name: 'main.cpp',
            path: '/main.cpp',
            language: 'cpp',
            content: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Code Together. Build Smarter. Ship Faster." << endl;\n    return 0;\n}\n`,
          },
        ];
        break;
      case 'java':
        initialFiles = [
          {
            id: 'f_main',
            name: 'Main.java',
            path: '/Main.java',
            language: 'java',
            content: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from CodeBuddy Java Workspace!");\n    }\n}\n`,
          },
        ];
        break;
      default:
        initialFiles = [
          {
            id: 'f_main',
            name: 'index.ts',
            path: '/index.ts',
            language: 'typescript',
            content: `// CodeBuddy AI Project\nfunction greet(name: string): string {\n  return \`Welcome to CodeBuddy AI, \${name}!\`;\n}\n\nconsole.log(greet("Developer"));\n`,
          },
          {
            id: 'f_utils',
            name: 'utils.ts',
            path: '/utils.ts',
            language: 'typescript',
            content: `export const timestamp = (): string => new Date().toISOString();\n`,
          },
        ];
    }

    const newProject: Project = {
      id: projectId,
      userId: 'usr_demo_1',
      name: name.trim(),
      description: description.trim(),
      language,
      files: initialFiles,
      activeFileId: initialFiles[0]?.id,
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.projects.set(newProject.id, newProject);

    // Update demo user stats
    const demoUser = db.users.get('usr_demo_1');
    if (demoUser) {
      demoUser.stats.totalProjects += 1;
    }

    return res.status(201).json({
      message: 'Project created successfully',
      project: newProject,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Update project (files, active file, name)
projectRouter.put('/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id as string);
  const project = db.projects.get(id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { name, description, files, activeFileId } = req.body;
  if (name) project.name = name;
  if (description !== undefined) project.description = description;
  if (files) project.files = files;
  if (activeFileId) project.activeFileId = activeFileId;
  project.updatedAt = new Date().toISOString();

  db.projects.set(id, project);
  return res.json({ message: 'Project saved', project });
});

// Delete project
projectRouter.delete('/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id as string);
  if (!db.projects.has(id)) {
    return res.status(404).json({ error: 'Project not found' });
  }
  db.projects.delete(id);
  return res.json({ message: 'Project deleted successfully' });
});
