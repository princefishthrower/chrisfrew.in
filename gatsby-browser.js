import { wrapRootElement as wrap } from './wrap-root-element'
import Prism from "prism-react-renderer/prism";
import './src/styles-scss/styles.scss';

(typeof global !== "undefined" ? global : window).Prism = Prism;

require(`katex/dist/katex.min.css`)
require(`prismjs/components/prism-csharp`);

export const wrapRootElement = wrap