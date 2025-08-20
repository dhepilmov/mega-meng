# 🏗️ Architecture & AI Agent Guidelines

## 🎯 MANDATORY RULES for AI Agents

### File Naming Convention
**STRICT PATTERN:** `meng_[type]_[name].tsx`

**Types:**
- `component` = UI React components
- `layout` = Layout/structure files  
- `data` = Content data files
- `styles` = CSS styling files
- `types` = TypeScript interfaces

**Examples:**
- ✅ `meng_component_Hero.tsx`
- ✅ `meng_layout_LayoutConfig.ts`  
- ✅ `meng_data_cafeData.ts`
- ❌ `Hero.tsx` (missing prefix)
- ❌ `menuComponent.tsx` (wrong pattern)

### AI Agent Requirements

#### 🔴 MANDATORY ACTIONS
1. **MUST** update `MUST_READ_PROGRESS_LOG.md` after ANY change
2. **MUST** read this file before making modifications
3. **MUST** follow naming conventions
4. **MUST** keep files lightweight for old devices
5. **MUST** test on mobile devices

#### 🎯 Content Management
- All content edits go in `meng_data_cafeData.ts` ONLY
- Never hardcode menu items in components
- Keep contact info centralized in data file

#### ⚡ Performance Requirements
- No heavy libraries (React only, minimal deps)
- Optimize images (webp format preferred)
- Minimal CSS animations
- Fast loading on 2G connections

### File Responsibilities

#### `meng_component_*`
- Pure UI components
- Accept props from data file
- No hardcoded content
- Responsive design

#### `meng_layout_*` 
- Control spacing, positioning
- Manage responsive breakpoints
- Handle layout configurations

#### `meng_data_*`
- All editable content
- Menu items, prices, contact info
- Easy for non-developers to modify

## 🚨 Breaking Rules = Documentation Update Required
If you break these rules, you MUST document why in PROGRESS_LOG.md