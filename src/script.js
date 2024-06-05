import './style.css';
import Experience from './Experience/Experience.js';
import { injectSpeedInsights } from '@vercel/speed-insights';

injectSpeedInsights();

const experience = new Experience(document.querySelector('canvas.webgl'));