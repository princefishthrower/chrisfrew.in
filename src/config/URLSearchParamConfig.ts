import URLSearchParamKey from "../enums/URLSearchParamKey";
import URLSearchParamValue from "../enums/URLSearchParamValue";
import IURLSearchParamConfig from "../interfaces/IURLSearchParamConfig";

export const SearchParamValues: Array<IURLSearchParamConfig> = [
    {
        key: URLSearchParamKey.LANGUAGE_FILTER,
        value: URLSearchParamValue.TYPESCRIPT
    },
    {
        key: URLSearchParamKey.LANGUAGE_FILTER,
        value: URLSearchParamValue.JAVASCRIPT
    },
    {
        key: URLSearchParamKey.LANGUAGE_FILTER,
        value: URLSearchParamValue.CSHARP
    },
    {
        key: URLSearchParamKey.LANGUAGE_FILTER,
        value: URLSearchParamValue.SHELL
    }
]