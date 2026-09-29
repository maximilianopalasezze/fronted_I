import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages publica este repositorio bajo /fronted_I/.
export default defineConfig({ plugins: [react()], base: '/fronted_I/' });
