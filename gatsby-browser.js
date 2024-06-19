import { wrapRootElement as wrap } from './wrap-root-element'
import { Prism } from "prism-react-renderer";
import './src/styles/styles.scss';

(typeof global !== "undefined" ? global : window).Prism = Prism;

require(`katex/dist/katex.min.css`)

// custom language support
// see https://github.com/FormidableLabs/prism-react-renderer?tab=readme-ov-file#custom-language-support
require(`prismjs/components/prism-csharp`);
require(`prismjs/components/prism-toml`);
require(`prismjs/components/prism-bash`);
require(`prismjs/components/prism-powershell`);
require(`prismjs/components/prism-json`);

export const wrapRootElement = wrap