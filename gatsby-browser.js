import { wrapRootElement as wrap } from './wrap-root-element'
import Prism from "prism-react-renderer/prism";

(typeof global !== "undefined" ? global : window).Prism = Prism;

require('./src/styles/global.min.css')
require(`katex/dist/katex.min.css`)
require(`prismjs/components/prism-csharp`);

export const wrapRootElement = wrap