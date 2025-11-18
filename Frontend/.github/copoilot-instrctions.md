# 🚀 GitHub Copilot MCP Instructions (Magic UI → Shadcn Fallback)

## Core Principles

### MCP Server is the Authority
- For any UI task, I will **always** consult the MCP server tools first.  
- **Magic UI MCP** is the **primary source** for animations, effects, backgrounds, and prebuilt UI interactions.  
- If Magic UI does not provide the requested functionality, I will fall back to **shadcn/ui MCP** tools (`list_components`, `get_component_demo`, `install-component`, etc.).  

---

### Installation via Tooling
- For Magic UI, no manual installation is needed—code comes directly from MCP tools.  
- For shadcn/ui, I will **only use the `install-component` MCP tool** (which maps to `npx shadcn@latest add [component]`) to ensure proper installation.  

---

### Styling with Tailwind CSS
- All styling must use **Tailwind CSS utilities** for consistency.  
- No inline styles or raw CSS unless explicitly required.  

---

### Asset Management
- Icons → `/public/icons`  
- Images → `/public/images`  
- Avoid raw SVGs or third-party icon packs unless the request demands it.  

---

## Standard Workflow for Building UI Features

### 1. Deconstruct the Request
- Analyze the prompt and break down required UI elements.  
- Identify whether the feature belongs to Magic UI (animations, text, effects, layouts, backgrounds) or Shadcn (structured UI components like cards, modals, tables).  

---

### 2. Identify Components
- **Magic UI first:**  
  - Use `getUIComponents` for a full list.  
  - Use category tools like `getMotion`, `getTextEffects`, `getBackgrounds`, etc. for details.  
- **If not found → Shadcn:**  
  - Use `list_components` or `search_components` to find relevant Shadcn components.  

---

### 3. Consult Demos Before Coding
- **Magic UI:** All category tools (`getMotion`, `getButtons`, etc.) return **implementation details**—this is mandatory before generating code.  
- **Shadcn:** Always use `get_component_demo` or `get_component_examples` before writing implementation code.  

---

### 4. Install Required Components
- **Magic UI:** Code is copied directly from MCP tool responses.  
- **Shadcn:** Execute `install-component` for every needed component.  

---

### 5. Generate Code
- **React code only**, styled with Tailwind.  
- Magic UI snippets are inserted directly from MCP tools.  
- Shadcn components must follow official demos/examples exactly.  

---

## Tool-Specific Instructions

### 🔮 Magic UI Tools
- **getUIComponents** → Overview of all available components.  
- **getMotion / getTextReveal / getTextEffects / getEffects / getButtons** → Animations, transitions, visual effects, interactive buttons.  
- **getLayout / getBackgrounds / getWidgets / getMedia / getDevices** → Layout patterns, background effects, widgets, media UIs, and device mockups.  
- **When to use:** Always first for any animated, flashy, or visually interactive request.  

---

### 🎨 Shadcn Tools
- **list_components / search_components** → Find Shadcn UI elements.  
- **get_component_demo / get_component_examples** → Retrieve correct usage examples before coding.  
- **install-component** → Add components via MCP.  
- **get_block / list_blocks** → Larger prebuilt UI sections (dashboards, auth forms, etc.).  
- **When to use:** Only if Magic UI does not have the requested component.  

---

## Example Workflow Scenarios

1. **User asks:** “Add a blur fade text animation.”  
   - Check Magic UI → Use `getMotion` → Fetch blur-fade → Generate React code.  

2. **User asks:** “Add a form with input fields and a submit button.”  
   - Magic UI doesn’t provide structured form inputs.  
   - Fallback to Shadcn → `list_components` → find `form` → `install-component form` → fetch demo → implement with Tailwind styling.  

3. **User asks:** “Add a landing page with hero video and animated gradient text.”  
   - Magic UI:  
     - Use `getMedia` for hero-video-dialog.  
     - Use `getTextReveal` for animated-gradient-text.  
   - Compose the page using both.  

---

## ✅ Final Rule
👉 Always **try Magic UI first**, then **fallback to Shadcn MCP** if unavailable.  
👉 Never skip the “consult demo before coding” step.  
👉 All code must be **Tailwind-based, React, production-ready**.  
