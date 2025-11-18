# Template Builder - Modular Architecture

This folder contains the workout template builder with a clean, modular architecture for better maintainability and readability.

## 📁 Folder Structure

```
app/templates/builder/
├── components/           # React components
│   ├── ExerciseSelectionModal.tsx    # Advanced exercise picker with filters
│   ├── TemplateInfoStep.tsx          # Step 1: Basic template information
│   ├── WeeklyStructureStep.tsx       # Step 2: Weekly workout schedule
│   ├── ExerciseBuilderStep.tsx       # Step 3: Add exercises to workouts
│   ├── ReviewStep.tsx                # Step 4: Review and save
│   ├── StepNavigation.tsx            # Navigation between steps
│   └── index.ts                      # Export all components
├── constants/            # Static data and configuration
│   └── index.ts                      # Categories, muscle groups, defaults
├── data/                # Exercise database
│   └── exercises.ts                  # Sample exercise data
├── hooks/               # Custom React hooks
│   └── useTemplateBuilder.ts         # Main template builder state management
├── page.tsx             # Main page component (new modular version)
└── page-old.tsx         # Original large file (backup)
```

## 🧩 Components Overview

### 1. **TemplateInfoStep** 
- Handles basic template information (name, description, difficulty, goals)
- Clean form with real-time preview
- Magic UI animations with `BlurFade` and `TextAnimate`

### 2. **WeeklyStructureStep**
- Visual weekly calendar interface
- Toggle rest days with smooth animations
- Quick template presets (Upper/Lower, Push/Pull/Legs, Full Body)
- Real-time statistics display

### 3. **ExerciseSelectionModal**
- Advanced exercise picker with multiple filters
- Search by name or muscle group
- Filter by category, difficulty, equipment
- Live customization of sets, reps, weight, rest time
- Premium UI with Magic UI components

### 4. **ExerciseBuilderStep**
- Day selection and exercise management
- Drag-and-drop exercise ordering
- Inline editing of exercise parameters
- Visual exercise cards with muscle group badges

### 5. **ReviewStep**
- Complete template overview
- Animated statistics with `NumberTicker`
- Detailed workout breakdown
- Save functionality with validation

### 6. **StepNavigation**
- Animated step indicator
- Progress tracking
- Mobile-responsive design
- Smart navigation validation

## 🎯 Key Features

### Magic UI Integration
- **BlurFade**: Smooth entrance animations
- **TextAnimate**: Dynamic text animations
- **ShimmerButton**: Premium interactive buttons
- **InteractiveHoverButton**: Enhanced button interactions
- **NumberTicker**: Animated number counters

### State Management
- **useTemplateBuilder**: Centralized state hook
- Immutable state updates
- Form validation
- Step progression logic

### TypeScript Support
- Full type safety
- Proper interface definitions
- Generic type handling
- Error prevention

### Responsive Design
- Mobile-first approach
- Adaptive layouts
- Touch-friendly interactions
- Responsive step navigation

## 🚀 Usage

```tsx
import { TemplateInfoStep } from "@/app/templates/builder/components";

// Or import all at once
import {
  TemplateInfoStep,
  WeeklyStructureStep,
  ExerciseBuilderStep,
  ReviewStep
} from "@/app/templates/builder/components";
```

## 🔧 State Hook Usage

```tsx
const {
  currentStep,
  templateData,
  setTemplateData,
  nextStep,
  prevStep,
  selectDay,
  saveTemplate
} = useTemplateBuilder();
```

## 📊 Benefits of This Architecture

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be used independently
3. **Readability**: Clear separation of concerns
4. **Testing**: Easier to unit test individual components
5. **Performance**: Better code splitting and lazy loading potential
6. **Collaboration**: Multiple developers can work on different components

## 🎨 Design Principles

- **Linear-inspired**: Clean, professional design aesthetic
- **Animation-first**: Smooth transitions and micro-interactions
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Optimized re-renders and efficient state updates

## 🔮 Future Enhancements

- [ ] Add exercise video previews
- [ ] Implement drag-and-drop exercise reordering
- [ ] Add AI-powered exercise suggestions
- [ ] Export templates to different formats
- [ ] Social sharing functionality
- [ ] Template marketplace integration

This modular architecture makes the template builder much more maintainable and provides a solid foundation for future enhancements.
