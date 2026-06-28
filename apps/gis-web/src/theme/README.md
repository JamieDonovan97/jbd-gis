# theme

Theme registration and application.

| File                | Holds                                     |
| ------------------- | ----------------------------------------- |
| `themes.ts`         | The theme registry.                       |
| `useTheme.ts`       | Persisted current-theme store.            |
| `ThemeProvider.tsx` | Applies the active theme to the document. |

Add a theme: a token block in `../styles/themes.css` and an entry in `themes.ts`.
