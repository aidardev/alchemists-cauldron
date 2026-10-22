import { App } from './app/app';
import './styles/globals.scss';

const root = document.createElement('div');
const app = new App();

root.append(app.element);
document.body.prepend(root);
